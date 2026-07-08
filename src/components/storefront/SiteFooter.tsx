import { BRAND_LOGO, WhatsAppIcon } from './productHelpers';

type Props = {
  categories: string[];
  onCategory: (category: string) => void;
  phoneNumber: string;
};

const PAYMENT_METHODS = ['Pago con QR', 'Transferencia', 'Débito', 'Crédito'];

export default function SiteFooter({ categories, onCategory, phoneNumber }: Props) {
  return (
    <footer className="mt-16 bg-marca-900 text-marca-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-sm md:grid-cols-4">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-3 rounded-2xl bg-white/95 px-3 py-2 shadow">
            <img
              src={BRAND_LOGO}
              alt="Pasos Saludables"
              className="h-14 w-14 rounded-full object-cover"
            />
            <span className="font-bold text-marca-800">Pasos Saludables</span>
          </span>
          <p className="text-marca-100/80">
            Tu tienda saludable online: productos frescos, cuidado personal y
            mucho más, con stock real.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-white">
            Categorías
          </p>
          <ul className="space-y-1.5 text-marca-100/80">
            {categories.slice(0, 5).map((category) => (
              <li key={category}>
                <button
                  type="button"
                  onClick={() => onCategory(category)}
                  className="text-left transition-colors hover:text-white"
                >
                  {category}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => onCategory('Todos')}
                className="text-left transition-colors hover:text-white"
              >
                Ver todo
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-white">
            Atención
          </p>
          <p className="text-marca-100/80">Coordinamos entrega y pago con vos.</p>
          <p className="text-marca-100/80">
            <span className="font-semibold text-white">WhatsApp:</span> consultas
            y pedidos.
          </p>
          <a
            href={`https://wa.me/${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white transition-transform hover:scale-105"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Escribinos por WhatsApp
          </a>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-white">
            Medios de pago
          </p>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-medium text-marca-100"
              >
                {method}
              </span>
            ))}
          </div>
          <p className="mt-3 text-marca-100/80">
            <span className="font-semibold text-white">Envíos</span> a todo el
            país 🇵🇾
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 text-center text-xs text-marca-200/70 md:flex-row md:justify-between md:text-left">
          <p>
            © {new Date().getFullYear()} Pasos Saludables. Todos los derechos
            reservados.
          </p>
          <p>Hecho con 💚 en Paraguay</p>
        </div>
      </div>
    </footer>
  );
}
