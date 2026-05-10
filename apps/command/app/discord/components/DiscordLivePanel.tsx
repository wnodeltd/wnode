"use client";

import React, { useEffect, useState } from 'react';
import { MessageSquare, RefreshCw, AlertCircle } from 'lucide-react';

export default function DiscordLivePanel() {
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChannels = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using a dummy guild ID for now or from env
      const guildId = "1496144706776600697"; 
      const response = await fetch(`/discord/api/guild/${guildId}/channels`);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Discord Channels:", data);
      setChannels(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to fetch Discord channels:", err);
      setError(err.message || "Failed to initialize integration");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
        <span className="text-[10px] uppercase tracking-widest font-bold">Initializing Discord...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 p-8 text-center">
        <AlertCircle className="w-8 h-8 text-amber-500/50" />
        <div className="space-y-1">
          <p className="text-[11px] text-white font-medium">Discord integration is initializing.</p>
          <p className="text-[9px] text-slate-500 italic">Verify DISCORD_BOT_TOKEN and Server Permissions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black/20 p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <MessageSquare className="w-3 h-3 text-purple-400" />
          Live Community
        </h3>
        <span className="text-[9px] text-slate-500 font-mono">{channels.length} Channels</span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
        {channels.filter(c => c.type === 0).map((channel) => (
          <div key={channel.id} className="p-2 rounded hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer group">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-mono text-[12px]">#</span>
              <span className="text-[11px] text-slate-300 group-hover:text-white transition-colors">{channel.name}</span>
            </div>
          </div>
        ))}
        {channels.length === 0 && (
          <p className="text-[10px] text-slate-600 italic p-4 text-center">No public text channels found.</p>
        )}
      </div>
    </div>
  );
}
