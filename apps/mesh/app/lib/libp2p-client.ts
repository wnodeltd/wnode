import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { mplex } from '@libp2p/mplex';

export async function startNodlNode() {
    try {
        const node = await createLibp2p({
            transports: [webSockets()],
            connectionEncryption: [noise()],
            streamMuxers: [yamux(), mplex()],
        });
        await node.start();
        console.log('Nodl Node started:', node.getMultiaddrs());
        return node;
    } catch (err) {
        console.error('Failed to start Nodl node:', err);
    }
}

export async function stopNodlNode() {
    console.log('Nodl Node stopping...');
}
