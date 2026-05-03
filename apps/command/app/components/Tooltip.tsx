'use client';

import React, { useState } from 'react';

export default function Tooltip({ children, text }: { children: React.ReactNode, text: string }) {
  const [show, setShow] = useState(false);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute bottom-full left-0 mb-2 w-max max-w-[200px] bg-slate-800 text-slate-200 text-[10px] px-2 py-1.5 rounded shadow-xl z-50 whitespace-normal text-left border border-white/10">
          {text}
          <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  );
}
