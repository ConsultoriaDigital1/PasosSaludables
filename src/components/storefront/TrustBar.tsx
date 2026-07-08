import type { ReactNode } from 'react';

type Item = {
  titulo: string;
  detalle: string;
  icon: ReactNode;
};

const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true
};

const items: Item[] = [
  {
    titulo: 'Envío coordinado',
    detalle: 'Acordamos la entrega con vos',
    icon: (
      <svg {...iconProps}>
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h4l3 3v3h-7" />
        <circle cx="7.5" cy="17.5" r="1.5" />
        <circle cx="17.5" cy="17.5" r="1.5" />
      </svg>
    )
  },
  {
    titulo: 'Productos saludables',
    detalle: 'Seleccionados y frescos',
    icon: (
      <svg {...iconProps}>
        <path d="M11 20A7 7 0 0 1 4 13c0-4 3-8 7-11 4 3 7 7 7 11a7 7 0 0 1-7 7Z" />
        <path d="M11 20v-8" />
      </svg>
    )
  },
  {
    titulo: 'Stock real',
    detalle: 'Ves lo que hay disponible',
    icon: (
      <svg {...iconProps}>
        <path d="M12 2 4 5v6c0 5 3.5 8 8 11 4.5-3 8-6 8-11V5z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  },
  {
    titulo: 'Atención por WhatsApp',
    detalle: 'Cerrás el pedido con una persona',
    icon: (
      <svg {...iconProps}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
      </svg>
    )
  }
];

export default function TrustBar() {
  return (
    <section className="border-y border-marca-100 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="grid grid-cols-2 divide-x divide-y divide-marca-100 sm:divide-y-0 lg:grid-cols-4">
          {items.map((item) => (
            <li
              key={item.titulo}
              className="flex items-center gap-3 px-2 py-4 sm:px-4"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-marca-50 text-marca-700 ring-1 ring-marca-100">
                {item.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-slate-900">
                  {item.titulo}
                </span>
                <span className="block text-xs text-slate-500">
                  {item.detalle}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
