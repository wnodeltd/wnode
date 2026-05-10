export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      // Keep connection open without streaming data
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
