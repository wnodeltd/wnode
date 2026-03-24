'use client';

import React, { useEffect, useRef } from 'react';

interface TerminalLog {
    timestamp: string;
    message: string;
    type?: 'info' | 'warn' | 'error' | 'success';
}

export default function Terminal({ logs }: { logs: TerminalLog[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const formatMessage = (msg: string) => {
        // Truncate long BRIDGE_ID strings: 12D3...uFmgNX
        return msg.replace(/(BRIDGE_ID: )([a-zA-Z0-9]{4})[a-zA-Z0-9]*([a-zA-Z0-9]{6})/, '$1$2...$3');
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-4  text-[10px] h-[400px] overflow-hidden flex flex-col group">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
                <span className="text-slate-500 uppercase flex items-center gap-2 font-bold tracking-tighter">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyber-crimson animate-pulse shadow-[0_0_5px_#ef4444]" />
                    Live Mesh Telemetry
                </span>
                <span className="text-[8px] text-slate-700 ">SYSTEM_TRACE_v2.0</span>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-1 terminal-scrollbar pr-2"
            >
                {logs.length === 0 ? (
                    <div className="text-slate-700 ">Awaiting telemetry packets...</div>
                ) : (
                    logs.map((log, i) => (
                        <div key={i} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-1 duration-300">
                            <span className="text-slate-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
                            <span className={`
                ${log.type === 'error' ? 'text-cyber-crimson' :
                                    log.type === 'warn' ? 'text-yellow-500' :
                                        log.type === 'success' ? 'text-cyber-blue' : 'text-slate-400'}
              `}>
                                {formatMessage(log.message)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
