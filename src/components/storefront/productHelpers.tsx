import type { Product } from '../../types';
import { formatPriceARS } from '../../lib/formatters';

// Logo de la marca: se usa como imagen por defecto cuando un producto no tiene
// foto propia (equivalente al /icon.png del diseño original de farmacia).
export const BRAND_LOGO = '/pasossaludablesstock-logo.jpeg';

export function isProductAvailable(product: Product) {
  return product.stockQuantity > 0;
}

export function hasPublishedPrice(product: Product) {
  return product.price > 0;
}

export function canPurchaseProduct(product: Product) {
  return isProductAvailable(product) && hasPublishedPrice(product);
}

export function needsConsult(product: Product) {
  return isProductAvailable(product) && !hasPublishedPrice(product);
}

export function formatProductPrice(product: Product) {
  return hasPublishedPrice(product) ? formatPriceARS(product.price) : 'Consultar';
}

export function productGallery(product: Product) {
  if (product.images.length > 0) {
    return product.images;
  }

  return product.image ? [product.image] : [];
}

export type StockTone = 'emerald' | 'amber' | 'rose';

type StockBadge = { label: string; tone: StockTone };

// Badge de disponibilidad al estilo de las tarjetas de farmacia, pero derivado
// del stock real de Pasos Saludables.
export function getStockBadge(product: Product): StockBadge {
  if (!isProductAvailable(product)) {
    return { label: 'Sin stock', tone: 'rose' };
  }

  if (!hasPublishedPrice(product)) {
    return { label: 'Consultar precio', tone: 'amber' };
  }

  if (product.stockQuantity <= 3) {
    return { label: '¡Últimas unidades!', tone: 'amber' };
  }

  return { label: 'En stock', tone: 'emerald' };
}

// Orden de vidriera: destacados y comprables primero, luego con imagen y stock.
export function merchandisingScore(product: Product) {
  let score = 0;

  if (product.featured) score += 500;

  if (canPurchaseProduct(product)) {
    score += 400;
  } else if (isProductAvailable(product)) {
    score += 180;
  }

  if (product.image || product.images.length > 0) score += 120;

  score += Math.min(product.stockQuantity, 60);

  if (hasPublishedPrice(product)) score += 40;

  return score;
}

export function sortProductsForStore(a: Product, b: Product) {
  const diff = merchandisingScore(b) - merchandisingScore(a);
  if (diff !== 0) return diff;
  return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
}

export function dedupeProducts(products: Product[]) {
  const seen = new Set<number>();
  return products.filter((product) => {
    if (seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });
}

// Imagen del producto (o logo atenuado como placeholder).
export function ProductArtwork({
  product,
  className = ''
}: {
  product: Product;
  className?: string;
}) {
  if (product.image) {
    return (
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className="flex h-full w-full items-center justify-center bg-slate-50 p-8"
      role="img"
      aria-label={product.name}
    >
      <img
        src={BRAND_LOGO}
        alt={product.name}
        loading="lazy"
        decoding="async"
        className="max-h-full max-w-full rounded-2xl object-contain opacity-50"
      />
    </div>
  );
}

export function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M17.47 14.38c-.29-.15-1.72-.85-1.99-.94-.27-.1-.46-.15-.65.15-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.44-.86-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.15-.24-.56-.48-.48-.65-.49-.17-.01-.36-.01-.55-.01-.19 0-.51.07-.77.36-.27.29-1.01.99-1.01 2.41 0 1.42 1.04 2.79 1.18 2.98.15.19 2.04 3.12 4.95 4.37.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34ZM12.05 21.79h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.82 9.82 0 0 1 9.89 9.89c0 5.45-4.44 9.88-9.9 9.88ZM20.47 3.48A11.82 11.82 0 0 0 12.04.03C5.5.03.18 5.35.18 11.89c0 2.09.55 4.13 1.59 5.93L.08 24l6.33-1.66a11.85 11.85 0 0 0 5.63 1.44h.01c6.54 0 11.86-5.32 11.87-11.86a11.8 11.8 0 0 0-3.45-8.44Z" />
    </svg>
  );
}
