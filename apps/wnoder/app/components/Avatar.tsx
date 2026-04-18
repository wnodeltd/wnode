'use client';

import React, { useState } from 'react';
import { User, Camera } from 'lucide-react';

export default function Avatar({ src, alt, size = 'md' }: { src?: string; alt?: string; size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-16 h-16'
    };

    return (
        <div className={`relative group cursor-pointer ${sizeClasses[size]}`}>
            <div className={`w-full h-full rounded-[2px] border border-white/10 bg-black overflow-hidden flex items-center justify-center transition-all group-hover:border-cyber-cyan/50 shadow-[0_0_15px_rgba(0,242,255,0.05)]`}>
                {src ? (
                    <img src={src} alt={alt} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                ) : (
                    <User className="w-1/2 h-1/2 text-white/40 group-hover:text-cyber-cyan transition-colors" />
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-cyber-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-4 h-4 text-cyber-cyan" />
                </div>
            </div>
            {/* Status indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-cyber-cyan rounded-none border border-black shadow-[0_0_10px_rgba(0,242,255,0.5)]" />
        </div>
    );
}
