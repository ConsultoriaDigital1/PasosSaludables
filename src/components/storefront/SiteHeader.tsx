import { BRAND_LOGO } from './productHelpers';

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  cartCount: number;
  cartPulse?: boolean;
  onOpenCart: () => void;
  phoneNumber: string;
};

export default function SiteHeader({
  search,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
  cartCount,
  cartPulse = false,
  onOpenCart,
  phoneNumber
}: Props) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-marca-100 bg-white/90 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-6">
          <a href="#top" className="flex shrink-0 items-center gap-2 rounded-xl">
            <img
              src={BRAND_LOGO}
              alt="Pasos Saludables"
              className="h-12 w-12 rounded-full object-cover drop-shadow-sm md:h-14 md:w-14"
            />
            <span className="hidden text-lg font-bold leading-tight text-marca-700 sm:inline md:text-xl">
              Pasos Saludables
            </span>
          </a>

          <div className="mx-auto max-w-3xl flex-1">
            <form
              role="search"
              onSubmit={(event) => event.preventDefault()}
              className="relative flex items-center rounded-full bg-white shadow-soft ring-1 ring-marca-100 focus-within:ring-2 focus-within:ring-marca-500"
            >
              <input
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Buscar por producto o categoría..."
                aria-label="Buscar productos"
                autoComplete="off"
                className="w-full rounded-full bg-transparent py-3 pl-5 pr-24 text-sm placeholder:text-slate-400 focus:outline-none md:text-base"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-14 top-1/2 -translate-y-1/2 text-slate-400 hover:text-marca-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
              <span
                aria-hidden
                className="absolute right-1 top-1 bottom-1 inline-flex w-11 items-center justify-center rounded-full bg-marca-600 text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
            </form>
          </div>

          <nav className="flex shrink-0 items-center gap-2 md:gap-3">
            <a
              href={`https://wa.me/${phoneNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full border-2 border-marca-600 px-3 py-2 text-sm font-semibold text-marca-700 transition-colors hover:bg-marca-600 hover:text-white sm:inline-flex md:px-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.52 3.48A11.93 11.93 0 0 0 12.05 0C5.5 0 .18 5.32.17 11.87a11.78 11.78 0 0 0 1.6 5.94L0 24l6.34-1.66a11.9 11.9 0 0 0 5.7 1.45c6.55 0 11.87-5.32 11.88-11.87a11.8 11.8 0 0 0-3.41-8.44Z" />
              </svg>
              <span className="hidden md:inline">Ayuda</span>
            </a>

            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Carrito (${cartCount} ${cartCount === 1 ? 'producto' : 'productos'})`}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-marca-700 transition-colors hover:bg-marca-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="9" cy="21" r="1.5" />
                <circle cx="18" cy="21" r="1.5" />
                <path d="M3 3h2l2.4 12.3a2 2 0 0 0 2 1.7h8.7a2 2 0 0 0 2-1.6L22 8H6" />
              </svg>
              <span
                className={`absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ring-2 ring-white transition-colors ${
                  cartCount > 0 ? 'bg-acento-500' : 'bg-slate-400'
                } ${cartPulse ? 'storefront-badge-bump' : ''}`}
              >
                {cartCount}
              </span>
            </button>
          </nav>
        </div>
      </header>

      <nav className="relative border-b border-marca-100 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="storefront-scroll-row flex items-center gap-1 overflow-x-auto">
            {categories.map((category) => {
              const active = activeCategory === category;
              const label = category === 'Todos' ? 'Todo el catálogo' : category;

              return (
                <li key={category} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => onCategoryChange(category)}
                    aria-current={active ? 'page' : undefined}
                    className={`relative inline-flex items-center px-3 py-3 text-xs font-semibold uppercase tracking-wide transition-colors md:text-sm ${
                      active ? 'text-marca-700' : 'text-slate-700 hover:text-marca-700'
                    }`}
                  >
                    {label}
                    {active && (
                      <span
                        aria-hidden
                        className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-marca-600"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent md:hidden"
        />
      </nav>
    </>
  );
}
