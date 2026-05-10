import { discordGateway } from "../../../../discord/gateway/client";

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const onEvent = (event: any) => {
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(new TextEncoder().encode(data));
      };
      
      discordGateway.on('discord_event', onEvent);
      
      const heartbeat = setInterval(() => {
        controller.enqueue(new TextEncoder().encode("event: ping\ndata: {}\n\n"));
      }, 15000);
      
      // Cleanup on close
      return () => {
        discordGateway.off('discord_event', onEvent);
        clearInterval(heartbeat);
      };
    }
  });
  
  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
}
