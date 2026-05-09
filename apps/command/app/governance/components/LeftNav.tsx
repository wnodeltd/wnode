import React from 'react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'proposals', label: 'Proposals' },
  { id: 'voting', label: 'Voting' },
  { id: 'discord', label: 'Discord' },
  { id: 'operational', label: 'Operational' },
  { id: 'transparency', label: 'Transparency' },
  { id: 'documents', label: 'Documents' },
];

export default function LeftNav() {
  const scrollToAnchor = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="sticky top-32 h-fit w-48 p-4 hidden xl:block shrink-0">
      <div className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToAnchor(item.id)}
            className="w-full text-left px-4 py-2 text-[11px] font-medium uppercase tracking-widest text-slate-500 hover:text-[#22D3EE] transition-all border-l border-white/5 hover:border-[#22D3EE]/50"
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
