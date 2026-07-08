import { useEffect, useRef } from 'react';
import type { Product } from '../../types';
import ProductCard from './ProductCard';

type Props = {
  products: Product[];
  onOpen: (product: Product) => void;
  onAdd: (product: Product) => void;
  onConsult: (product: Product) => void;
};

// Estante de destacados: fila con scroll horizontal, flechas y auto-avance.
export default function FeaturedCarousel({
  products,
  onOpen,
  onAdd,
  onConsult
}: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);

  const scrollByCards = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const amount = Math.max(track.clientWidth * 0.8, 240);
    track.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  useEffect(() => {
    if (products.length <= 2) return undefined;

    const timer = window.setInterval(() => {
      const track = trackRef.current;
      if (!track || pausedRef.current) return;

      const nearEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;

      if (nearEnd) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({
          left: Math.max(track.clientWidth * 0.8, 240),
          behavior: 'smooth'
        });
      }
    }, 4000);

    return () => window.clearInterval(timer);
  }, [products.length]);

  return (
    <section
      id="destacados"
      className="relative scroll-mt-24 overflow-hidden border-y border-marca-100 bg-white py-8 md:py-10"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-marca-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-marca-800">
              Destacados
            </span>
            <h2 className="mt-3 font-serif text-3xl font-extrabold leading-tight text-slate-950 md:text-4xl">
              Los más buscados
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Productos seleccionados por nuestro equipo.
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              aria-label="Anterior"
              className="grid h-10 w-10 place-items-center rounded-full border border-marca-200 bg-white text-marca-800 shadow-sm transition hover:border-marca-400 hover:bg-marca-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              aria-label="Siguiente"
              className="grid h-10 w-10 place-items-center rounded-full border border-marca-200 bg-white text-marca-800 shadow-sm transition hover:border-marca-400 hover:bg-marca-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="storefront-scroll-row -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 md:gap-4"
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23%] xl:w-[19%]"
            >
              <ProductCard
                product={product}
                onOpen={onOpen}
                onAdd={onAdd}
                onConsult={onConsult}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
