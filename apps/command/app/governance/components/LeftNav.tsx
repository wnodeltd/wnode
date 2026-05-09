"use client";

import React from 'react';
import Tooltip from '../../components/Tooltip';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', tooltip: 'Jump to protocol summary' },
  { id: 'proposals', label: 'Proposals', tooltip: 'View active network proposals' },
  { id: 'voting', label: 'Voting', tooltip: 'Access the voting terminal' },
  { id: 'community', label: 'Community', tooltip: 'Discord integration and social' },
  { id: 'discord', label: 'Announcements', tooltip: 'Governance announcements' },
  { id: 'operational', label: 'Operational', tooltip: 'Infrastructure management' },
  { id: 'transparency', label: 'Transparency', tooltip: 'Audit logs and ledger' },
  { id: 'documents', label: 'Documents', tooltip: 'Protocol constitution and files' },
];

export default function LeftNav() {
  const scrollToAnchor = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        const yOffset = -120; // Account for fixed header and padding
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-32 h-fit w-48 p-4 hidden lg:block shrink-0">
      <div className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <Tooltip key={item.id} text={item.tooltip} direction="down">
            <button
              onClick={() => scrollToAnchor(item.id)}
              className="w-full text-left px-4 py-2 text-[11px] font-medium uppercase tracking-widest text-slate-500 hover:text-[#22D3EE] transition-all border-l border-white/5 hover:border-[#22D3EE]/50"
            >
              {item.label}
            </button>
          </Tooltip>
        ))}
      </div>
    </nav>
  );
}
