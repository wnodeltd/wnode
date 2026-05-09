import React from 'react';
import DetailPanel from '../../components/DetailPanel';

interface SlideOutHostProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function SlideOutHost({ isOpen, onClose, title }: SlideOutHostProps) {
  return (
    <DetailPanel
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Governance Insight"
    >
      <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-[5px] p-20">
        <span className="text-[11px] text-slate-500 uppercase tracking-widest text-center">
          Slide-out content shell for {title}
        </span>
      </div>
    </DetailPanel>
  );
}
