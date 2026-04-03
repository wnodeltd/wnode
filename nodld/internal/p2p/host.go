package p2p

import (
	"context"
	"fmt"
	"time"

	"github.com/libp2p/go-libp2p"
	dht "github.com/libp2p/go-libp2p-kad-dht"
	pubsub "github.com/libp2p/go-libp2p-pubsub"
	"github.com/libp2p/go-libp2p/core/crypto"
	"github.com/libp2p/go-libp2p/core/host"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/libp2p/go-libp2p/p2p/discovery/mdns"
	"github.com/libp2p/go-libp2p/p2p/net/connmgr"
	"github.com/libp2p/go-libp2p/p2p/protocol/circuitv2/relay"
	"github.com/libp2p/go-libp2p/p2p/transport/tcp"
	libp2pwebrtc "github.com/libp2p/go-libp2p/p2p/transport/webrtc"
	libp2pwebtransport "github.com/libp2p/go-libp2p/p2p/transport/webtransport"
	"github.com/libp2p/go-libp2p/p2p/transport/websocket"
	"github.com/multiformats/go-multiaddr"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

const (
	NodlProtocol = "/nodl/1.0.0"
	mdnsServiceTag = "nodl-mesh"
)

type Host struct {
	h        host.Host
	dht      *dht.IpfsDHT
	pubsub   *pubsub.PubSub
	registry *Registry
	rdb      *redis.Client
	log      *zap.Logger
}

type mdnsNotifee struct {
	h   host.Host
	log *zap.Logger
}

func (n *mdnsNotifee) HandlePeerFound(pi peer.AddrInfo) {
	n.log.Info("mDNS: discovered peer", zap.String("peer", pi.ID.String()))
	if err := n.h.Connect(context.Background(), pi); err != nil {
		n.log.Warn("mDNS: failed to connect", zap.Error(err))
	}
}

func New(ctx context.Context, p2pPort int, priv crypto.PrivKey, bootstrapPeers []string, rdb *redis.Client, log *zap.Logger) (*Host, error) {
	listenAddrs := []string{
		fmt.Sprintf("/ip4/0.0.0.0/tcp/%d", p2pPort),
		fmt.Sprintf("/ip4/0.0.0.0/tcp/%d/ws", p2pPort+1000),
		fmt.Sprintf("/ip4/0.0.0.0/udp/%d/webrtc-direct", p2pPort+1),
		fmt.Sprintf("/ip4/0.0.0.0/udp/%d/quic-v1/webtransport", p2pPort+2),
	}

	maddrs := make([]multiaddr.Multiaddr, 0, len(listenAddrs))
	for _, s := range listenAddrs {
		ma, err := multiaddr.NewMultiaddr(s)
		if err != nil {
			return nil, fmt.Errorf("invalid listen addr %q: %w", s, err)
		}
		maddrs = append(maddrs, ma)
	}

	cm, err := connmgr.NewConnManager(100, 400)
	if err != nil {
		return nil, fmt.Errorf("failed to create conn manager: %w", err)
	}

	h, err := libp2p.New(
		libp2p.Identity(priv),
		libp2p.ListenAddrs(maddrs...),
		libp2p.Transport(tcp.NewTCPTransport),
		libp2p.Transport(websocket.New),
		libp2p.Transport(libp2pwebrtc.New),
		libp2p.Transport(libp2pwebtransport.New),
		libp2p.ConnectionManager(cm),
		libp2p.EnableRelayService(),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create libp2p host: %w", err)
	}

	log.Info("libp2p Anchor host started",
		zap.String("id", h.ID().String()),
		zap.Any("addrs", h.Addrs()),
	)

	_, err = relay.New(h)
	if err != nil {
		return nil, fmt.Errorf("failed to instantiate relay: %w", err)
	}

	mdnsService := mdns.NewMdnsService(h, mdnsServiceTag, &mdnsNotifee{h: h, log: log})
	if err := mdnsService.Start(); err != nil {
		return nil, fmt.Errorf("failed to start mDNS: %w", err)
	}

	kadDHT, err := dht.New(ctx, h, dht.Mode(dht.ModeServer))
	if err != nil {
		return nil, fmt.Errorf("failed to create DHT: %w", err)
	}

	if err := bootstrapDHT(ctx, h, kadDHT, bootstrapPeers, log); err != nil {
		log.Warn("DHT bootstrap partial failure", zap.Error(err))
	}

	ps, err := pubsub.NewGossipSub(ctx, h)
	if err != nil {
		return nil, fmt.Errorf("failed to create pubsub: %w", err)
	}

	host := &Host{
		h:        h,
		dht:      kadDHT,
		pubsub:   ps,
		registry: NewRegistry(rdb),
		rdb:      rdb,
		log:      log,
	}

	go host.StartHeartbeatMonitor(ctx)

	return host, nil
}

func bootstrapDHT(ctx context.Context, h host.Host, kadDHT *dht.IpfsDHT, peers []string, log *zap.Logger) error {
	if err := kadDHT.Bootstrap(ctx); err != nil {
		return err
	}

	bootstrapList := peers
	if len(bootstrapList) == 0 {
		bootstrapList = []string{}
	}
	for _, p := range bootstrapList {
		ma, err := multiaddr.NewMultiaddr(p)
		if err != nil {
			log.Warn("invalid bootstrap peer addr", zap.String("addr", p))
			continue
		}
		addrInfo, err := peer.AddrInfoFromP2pAddr(ma)
		if err != nil {
			log.Warn("cannot parse bootstrap peer", zap.String("addr", p))
			continue
		}
		pi := *addrInfo

		if err := h.Connect(ctx, pi); err != nil {
			log.Warn("bootstrap peer connect failed", zap.String("peer", pi.ID.String()), zap.Error(err))
		} else {
			log.Info("connected to bootstrap peer", zap.String("peer", pi.ID.String()))
		}
	}
	return nil
}

func (n *Host) ID() string {
	return n.h.ID().String()
}

func (n *Host) PeerCount() int {
	return len(n.h.Network().Peers())
}

func (n *Host) ConnectedPeers() []peer.AddrInfo {
	peers := n.h.Network().Peers()
	infos := make([]peer.AddrInfo, 0, len(peers))
	for _, p := range peers {
		infos = append(infos, n.h.Peerstore().PeerInfo(p))
	}
	return infos
}

func (n *Host) Registry() *Registry {
	return n.registry
}

func (n *Host) PubSub() *pubsub.PubSub {
	return n.pubsub
}

func (n *Host) StartHeartbeatMonitor(ctx context.Context) {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			peers := n.h.Network().Peers()
			for _, p := range peers {
				go func(peerID peer.ID) {
					start := time.Now()
					rtt := time.Since(start)
					n.registry.UpdateHealth(peerID.String(), rtt, true)
				}(p)
			}
		}
	}
}

func (n *Host) Close() error {
	if err := n.dht.Close(); err != nil {
		n.log.Warn("DHT close error", zap.Error(err))
	}
	return n.h.Close()
}
