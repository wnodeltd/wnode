import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: guildId } = await params;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!botToken) {
    return NextResponse.json({ error: 'DISCORD_BOT_TOKEN not configured' }, { status: 500 });
  }

  // NOTE: Discord API doesn't have a direct "guild messages" endpoint.
  // This route is a placeholder or would need to iterate through channels.
  // For now, we'll return a 400 or a custom message suggesting channel-specific fetching.
  return NextResponse.json({ 
    error: 'Please use /api/discord/channel/[id]/messages for specific channel messages',
    guildId 
  }, { status: 400 });
}
