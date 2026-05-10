import { discordGateway } from "../../../../discord/gateway/client";

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const onEvent = (event: any) => {
        console.log("SSE Stream: Sending Discord event", event.t);
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(new TextEncoder().encode(data));
      };
      
      console.log("SSE Stream: Subscribing to discordGateway");
      discordGateway.on('discord_event', onEvent);
      
      const heartbeat = setInterval(() => {
        controller.enqueue(new TextEncoder().encode(": heartbeat\n\n"));
      }, 15000);
      
      // Cleanup on close
      return () => {
        console.log("SSE Stream: Unsubscribing from discordGateway");
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
