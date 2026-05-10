import { NextRequest } from 'next/server';
import { discordGateway } from '../../../../discord/gateway/client';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const onDiscordEvent = (event: any) => {
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(data));
      };

      discordGateway.on('discord_event', onDiscordEvent);

      request.signal.addEventListener('abort', () => {
        discordGateway.off('discord_event', onDiscordEvent);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
