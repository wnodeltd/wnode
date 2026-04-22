import { ModalMode } from "./CTAModal";

interface PersonaCardProps {
    title: string;
    hook: string;
    bullets: string[];
    ctaLabel: string;
    mode: ModalMode;
    onOpenModal: (mode: ModalMode) => void;
}

export default function PersonaCard({ title, hook, bullets, ctaLabel, mode, onOpenModal }: PersonaCardProps) {
    return (
        <div className="card-minimal p-8 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-primary font-medium mb-6">{hook}</p>
            
            <ul className="space-y-4 mb-8 flex-grow">
                {bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-400">
                        <span className="text-primary mt-1.5">•</span>
                        <span>{b}</span>
                    </li>
                ))}
            </ul>

            <button 
                onClick={() => onOpenModal(mode)}
                className="button-secondary w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider"
            >
                {ctaLabel}
            </button>
        </div>
    );
}
