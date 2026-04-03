package p2p

import (
	"context"
	"testing"

	"github.com/libp2p/go-libp2p/core/crypto"
	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
)

func TestNewHost(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	priv, _, _ := crypto.GenerateKeyPair(crypto.Ed25519, -1)
	log := zap.NewNop()

	h, err := New(ctx, 0, priv, nil, nil, log)
	assert.NoError(t, err)
	assert.NotNil(t, h)
	assert.NotEmpty(t, h.ID())

	err = h.Close()
	assert.NoError(t, err)
}

func TestHostConnectedPeers(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	priv, _, _ := crypto.GenerateKeyPair(crypto.Ed25519, -1)
	log := zap.NewNop()

	h, err := New(ctx, 0, priv, nil, nil, log)
	assert.NoError(t, err)
	defer h.Close()

	assert.Equal(t, 0, h.PeerCount())
	assert.Len(t, h.ConnectedPeers(), 0)
}

func TestHostRegistryAccess(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	priv, _, _ := crypto.GenerateKeyPair(crypto.Ed25519, -1)
	log := zap.NewNop()

	h, err := New(ctx, 0, priv, nil, nil, log)
	assert.NoError(t, err)
	defer h.Close()

	assert.NotNil(t, h.Registry())
}
