import { WhatsAppIcon } from './productHelpers';

// Cinta superior con promos que se desplazan (marquee) y un contacto a la
// derecha. Portada del diseño de Farmacia del Barrio, adaptada a Paraguay.
const PROMOS = [
  { icon: '🚚', text: 'Envíos a todo el país' },
  { icon: '🌿', text: 'Productos frescos y saludables' },
  { icon: '💬', text: 'Pedidos y consultas por WhatsApp' },
  { icon: '📦', text: 'Stock real, precios al día' },
  { icon: '⏱️', text: 'Coordinamos la entrega con vos' }
];

export default function TopBar({ phoneNumber }: { phoneNumber: string }) {
  return (
    <div className="bg-marca-700 text-white text-xs md:text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="hidden md:flex items-center shrink-0">
          <span className="flex items-center gap-2 rounded-full border border-white/40 px-3 py-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="font-medium">Paraguay 🇵🇾</span>
          </span>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex w-max animate-marquee items-center whitespace-nowrap">
            {[0, 1].map((dup) => (
              <div
                key={dup}
                className="flex items-center gap-8 pr-8"
                aria-hidden={dup === 1}
              >
                {PROMOS.map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-2">
                    <span aria-hidden>{item.icon}</span>
                    <span>{item.text}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <a
          href={`https://wa.me/${phoneNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 shrink-0 font-medium hover:text-white/80"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Escribinos
        </a>
      </div>
    </div>
  );
}
