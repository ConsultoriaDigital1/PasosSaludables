import type { Product } from '../../types';
import {
  ProductArtwork,
  canPurchaseProduct,
  formatProductPrice,
  getStockBadge,
  needsConsult,
  type StockTone
} from './productHelpers';

const STOCK_BADGE_CLASSES: Record<StockTone, string> = {
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  rose: 'bg-slate-100 text-slate-500 ring-slate-200'
};

type Props = {
  product: Product;
  onOpen: (product: Product) => void;
  onAdd: (product: Product) => void;
  onConsult: (product: Product) => void;
};

export default function ProductCard({ product, onOpen, onAdd, onConsult }: Props) {
  const canPurchase = canPurchaseProduct(product);
  const consult = needsConsult(product);
  const badge = getStockBadge(product);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-cardHover hover:ring-marca-200">
      <button
        type="button"
        onClick={() => onOpen(product)}
        className="relative block aspect-square overflow-hidden bg-slate-50 text-left"
        aria-label={`Ver ${product.name}`}
      >
        <div className="h-full w-full transition-transform duration-300 group-hover:scale-105">
          <ProductArtwork product={product} />
        </div>
        {product.featured && (
          <span className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-extrabold text-amber-600 shadow ring-1 ring-amber-100 backdrop-blur">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Destacado
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {product.category && (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-marca-600">
            {product.category}
          </span>
        )}
        <button
          type="button"
          onClick={() => onOpen(product)}
          className="line-clamp-2 min-h-[2.5rem] text-left text-sm font-medium text-slate-900 transition-colors group-hover:text-marca-700"
        >
          {product.name}
        </button>

        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${STOCK_BADGE_CLASSES[badge.tone]}`}
          >
            {badge.tone === 'emerald' && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            )}
            {badge.label}
          </span>
        </div>

        <div className="mt-auto space-y-2.5 pt-2">
          <span className="block text-lg font-extrabold text-slate-900">
            {formatProductPrice(product)}
          </span>

          {canPurchase ? (
            <button
              type="button"
              onClick={() => onAdd(product)}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-marca-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-marca-700"
              aria-label={`Agregar ${product.name} al carrito`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="9" cy="21" r="1.5" />
                <circle cx="18" cy="21" r="1.5" />
                <path d="M3 3h2l2.4 12.3a2 2 0 0 0 2 1.7h8.7a2 2 0 0 0 2-1.6L22 8H6" />
              </svg>
              Agregar
            </button>
          ) : consult ? (
            <button
              type="button"
              onClick={() => onConsult(product)}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-marca-200 px-3 py-2 text-xs font-bold text-marca-700 transition-colors hover:border-marca-400 hover:bg-marca-50"
            >
              Consultar por WhatsApp
            </button>
          ) : (
            <span className="inline-flex w-full items-center justify-center rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-400">
              Sin stock
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
