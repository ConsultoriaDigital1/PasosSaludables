import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Star,
  Truck,
  X
} from 'lucide-react';
import type {
  CheckoutDetails,
  Product,
  StorefrontBootstrap
} from '../types';
import { formatPriceARS } from '../lib/formatters';
import {
  formatProductInquiryMessage,
  formatWhatsAppMessage,
  openWhatsApp
} from '../lib/whatsapp';
import { useCartStore } from '../stores/cartStore';

interface Props {
  initialData: StorefrontBootstrap;
  loadError?: string | null;
}

interface ToastState {
  title: string;
  description: string;
  image?: string;
  tone: 'default' | 'error';
  productId?: number;
  showCartAction?: boolean;
}

type CheckoutErrors = Partial<Record<keyof CheckoutDetails, string>>;

const brandLogo = '/pasossaludablesstock-logo.jpeg';
const MIN_ORDER_TOTAL = 150000;
const PAYMENT_METHOD_OPTIONS = [
  'Pago con QR',
  'Transferencia',
  'Debito',
  'Credito'
] as const;
const INVOICE_PREFERENCE_OPTIONS = [
  'Prefiero Ticket',
  'Quiero Factura'
] as const;

const purchaseSteps = [
  {
    label: 'Explora el catalogo',
    detail: 'Encuentra productos por nombre, descripcion o categoria.',
    icon: Search
  },
  {
    label: 'Arma tu pedido',
    detail: 'Suma al carrito solo lo que tenga stock y precio listo para vender.',
    icon: ShoppingCart
  },
  {
    label: 'Confirma por WhatsApp',
    detail: 'Cierras el pedido directo con atencion humana y coordinacion real.',
    icon: Truck
  }
];

const navLinks = [
  { href: '#como-comprar', label: 'Como comprar' },
  { href: '#destacados', label: 'Destacados' },
  { href: '#catalogo', label: 'Catalogo' }
];

function isProductAvailable(product: Product) {
  return product.stockQuantity > 0;
}

function hasPublishedPrice(product: Product) {
  return product.price > 0;
}

function canPurchaseProduct(product: Product) {
  return isProductAvailable(product) && hasPublishedPrice(product);
}

function formatProductPrice(product: Product) {
  return hasPublishedPrice(product) ? formatPriceARS(product.price) : 'Consultar';
}

function productMerchandisingScore(product: Product) {
  let score = 0;

  if (product.featured) {
    score += 500;
  }

  if (canPurchaseProduct(product)) {
    score += 400;
  } else if (isProductAvailable(product)) {
    score += 180;
  }

  if (product.image || product.images.length > 0) {
    score += 120;
  }

  score += Math.min(product.stockQuantity, 60);

  if (hasPublishedPrice(product)) {
    score += 40;
  }

  return score;
}

function sortProductsForStore(a: Product, b: Product) {
  const scoreDiff = productMerchandisingScore(b) - productMerchandisingScore(a);

  if (scoreDiff !== 0) {
    return scoreDiff;
  }

  return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
}

function dedupeProducts(products: Product[]) {
  const seen = new Set<number>();

  return products.filter((product) => {
    if (seen.has(product.id)) {
      return false;
    }

    seen.add(product.id);
    return true;
  });
}

function productGallery(product: Product) {
  if (product.images.length > 0) {
    return product.images;
  }

  return product.image ? [product.image] : [];
}

function ProductArtwork({ product }: { product: Product }) {
  if (product.image) {
    return (
      <img
        src={product.image}
        alt={product.name}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(141,198,63,0.24),_transparent_52%),linear-gradient(135deg,_#173b2d_0%,_#1f2937_52%,_#335e22_100%)]">
      <Package className="h-14 w-14 text-emerald-100" />
    </div>
  );
}

export default function StorefrontApp({ initialData, loadError = null }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [toastKey, setToastKey] = useState(0);
  const [cartRendered, setCartRendered] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [checkoutFormVisible, setCheckoutFormVisible] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails>({
    customerName: '',
    address: '',
    paymentMethod: '',
    invoicePreference: 'Prefiero Ticket'
  });
  const [checkoutErrors, setCheckoutErrors] = useState<CheckoutErrors>({});
  const [highlightedCartItemId, setHighlightedCartItemId] = useState<number | null>(
    null
  );
  const closeCartTimerRef = useRef<number | null>(null);

  const {
    items,
    total,
    addItem,
    clearCart,
    getTotalItems,
    removeItem,
    updateQuantity
  } = useCartStore();

  const showToast = (nextToast: ToastState) => {
    setToastKey((current) => current + 1);
    setToast(nextToast);
  };

  const openCart = () => {
    if (closeCartTimerRef.current) {
      window.clearTimeout(closeCartTimerRef.current);
      closeCartTimerRef.current = null;
    }

    setCartRendered(true);
    window.requestAnimationFrame(() => setCartVisible(true));
  };

  const closeCart = () => {
    setCartVisible(false);

    if (closeCartTimerRef.current) {
      window.clearTimeout(closeCartTimerRef.current);
    }

    closeCartTimerRef.current = window.setTimeout(() => {
      setCartRendered(false);
      closeCartTimerRef.current = null;
    }, 280);
  };

  const pulseCart = () => {
    setCartPulse(false);
    window.requestAnimationFrame(() => setCartPulse(true));
  };

  const flashCartItem = (productId: number) => {
    setHighlightedCartItemId(null);
    window.requestAnimationFrame(() => setHighlightedCartItemId(productId));
  };

  useEffect(() => {
    document.body.dataset.storefrontMounted = '1';

    return () => {
      delete document.body.dataset.storefrontMounted;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (closeCartTimerRef.current) {
        window.clearTimeout(closeCartTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeout = window.setTimeout(
      () => setToast(null),
      toast.showCartAction ? 3400 : 2400
    );

    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!cartPulse) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setCartPulse(false), 420);
    return () => window.clearTimeout(timeout);
  }, [cartPulse]);

  useEffect(() => {
    if (!highlightedCartItemId) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setHighlightedCartItemId(null), 850);
    return () => window.clearTimeout(timeout);
  }, [highlightedCartItemId]);

  useEffect(() => {
    document.body.style.overflow = cartRendered ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [cartRendered]);

  useEffect(() => {
    if (!cartRendered) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cartRendered]);

  useEffect(() => {
    if (items.length > 0) {
      return;
    }

    setCheckoutFormVisible(false);
    setCheckoutErrors({});
    setCheckoutDetails({
      customerName: '',
      address: '',
      paymentMethod: '',
      invoicePreference: 'Prefiero Ticket'
    });
  }, [items.length]);

  const normalizedSearch = search.trim().toLowerCase();
  const visibleCategories = [
    'Todos',
    ...initialData.categories.map((category) => category.name)
  ];

  const allProducts = dedupeProducts([...initialData.products]).sort(
    sortProductsForStore
  );

  const filteredProducts = allProducts.filter((product) => {
    const description = product.description || '';
    const category = product.category || '';

    const matchesSearch =
      !normalizedSearch ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      description.toLowerCase().includes(normalizedSearch) ||
      category.toLowerCase().includes(normalizedSearch);

    const matchesCategory =
      activeCategory === 'Todos' || product.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredShelf = allProducts.filter((product) => product.featured);

  const totalItems = getTotalItems();
  const minimumOrderReached = total >= MIN_ORDER_TOTAL;
  const missingAmountToMinimum = Math.max(MIN_ORDER_TOTAL - total, 0);
  const selectedProductAvailable = selectedProduct
    ? isProductAvailable(selectedProduct)
    : false;
  const selectedProductCanPurchase = selectedProduct
    ? canPurchaseProduct(selectedProduct)
    : false;
  const selectedProductNeedsConsult = selectedProduct
    ? selectedProductAvailable && !hasPublishedPrice(selectedProduct)
    : false;

  const handleAddToCart = (product: Product) => {
    if (product.stockQuantity <= 0) {
      showToast({
        title: 'Sin stock disponible',
        description: 'Ese producto no tiene unidades para vender ahora.',
        tone: 'error'
      });
      return;
    }

    if (product.price <= 0) {
      showToast({
        title: 'Precio a confirmar',
        description:
          'Ese producto todavia no tiene precio publicado. Consultalo por WhatsApp antes de cerrar el pedido.',
        tone: 'error'
      });
      return;
    }

    addItem(product, 1);
    pulseCart();
    flashCartItem(product.id);

    showToast({
      title: 'Se agrego al carrito',
      description: `${product.name} ya quedo listo para cerrar por WhatsApp cuando quieras.`,
      image: productGallery(product)[0] ?? brandLogo,
      tone: 'default',
      productId: product.id,
      showCartAction: true
    });
  };

  const handleConsultProduct = (product: Product) => {
    openWhatsApp(formatProductInquiryMessage(product));
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    updateQuantity(productId, quantity);

    if (quantity > 0) {
      flashCartItem(productId);
    }
  };

  const handleCheckoutFieldChange = (
    field: keyof CheckoutDetails,
    value: string
  ) => {
    setCheckoutDetails((current) => ({
      ...current,
      [field]: value
    }));

    setCheckoutErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const validateCheckoutDetails = () => {
    const nextErrors: CheckoutErrors = {};

    if (!checkoutDetails.customerName.trim()) {
      nextErrors.customerName = 'El nombre es obligatorio.';
    }

    if (!checkoutDetails.address.trim()) {
      nextErrors.address = 'La direccion es obligatoria.';
    }

    if (!checkoutDetails.paymentMethod) {
      nextErrors.paymentMethod = 'Selecciona un metodo de pago.';
    }

    setCheckoutErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      showToast({
        title: 'El carrito esta vacio',
        description: 'Agrega productos antes de mandar el pedido.',
        tone: 'error'
      });
      return;
    }

    setCheckoutFormVisible(true);
  };

  const handleCheckoutSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (items.length === 0) {
      showToast({
        title: 'El carrito esta vacio',
        description: 'Agrega productos antes de mandar el pedido.',
        tone: 'error'
      });
      return;
    }

    if (!minimumOrderReached) {
      showToast({
        title: 'Pedido minimo no alcanzado',
        description: `El pedido debe ser de al menos ${formatPriceARS(MIN_ORDER_TOTAL)} para enviarse.`,
        tone: 'error'
      });
      return;
    }

    if (!validateCheckoutDetails()) {
      showToast({
        title: 'Faltan datos obligatorios',
        description: 'Completa nombre, direccion y metodo de pago antes de enviar.',
        tone: 'error'
      });
      return;
    }

    openWhatsApp(formatWhatsAppMessage(items, total, checkoutDetails));
  };

  const handleToastCartAction = () => {
    if (toast?.productId) {
      flashCartItem(toast.productId);
    }

    openCart();
    setToast(null);
  };

  return (
    <div className="relative z-10 min-h-screen overflow-x-hidden bg-[#f8f4ea] text-slate-950">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(141,198,63,0.16),_transparent_28%),radial-gradient(circle_at_85%_14%,_rgba(16,185,129,0.14),_transparent_26%),linear-gradient(180deg,_#f8f4ea_0%,_#fbfbf7_55%,_#eef5dc_100%)]" />

      <header className="sticky top-0 z-30 border-b border-[#dce2cd]/80 bg-[#f8f4ea]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <a
            href="#como-comprar"
            className="flex min-w-0 items-center gap-3 rounded-full border border-white/80 bg-white/85 px-2 py-2 pr-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
          >
            <img
              src={brandLogo}
              alt="Logo Pasos Saludables"
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-950">
                Pasos Saludables
              </p>
              <p className="truncate text-xs uppercase tracking-[0.24em] text-[#6f8f2f]">
                tienda + stock real
              </p>
            </div>
          </a>

          <button
            type="button"
            onClick={openCart}
            className={`inline-flex items-center gap-2 rounded-full bg-[#173b2d] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(23,59,45,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#21503c] ${
              cartPulse ? 'pss-badge-bump' : ''
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Carrito</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                cartPulse
                  ? 'bg-[#8dc63f] text-[#173b2d]'
                  : 'bg-white/12 text-white'
              }`}
            >
              {totalItems}
            </span>
          </button>

          <nav className="flex w-full flex-wrap gap-2 md:w-auto md:gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full border border-[#dce2cd] bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-[#8dc63f] hover:text-[#173b2d] md:border-0 md:bg-transparent md:px-0 md:py-0"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="pb-28 pt-4 sm:pb-12 sm:pt-6">

        <section
          id="como-comprar"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-6 sm:px-6 lg:px-8"
        >
          <div className="rounded-[36px] border border-[#dce2cd] bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur md:p-8">
            <div className="max-w-2xl">
              <h1 className="font-serif text-3xl text-slate-950 md:text-5xl">
                Comprar online no tiene que ser un tramite.
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Filtras, eliges y cierras el pedido con informacion real.
              </p>
            </div>

            {loadError && (
              <div className="mt-6 rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                No pudimos cargar todo el stock en este momento.
              </div>
            )}

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {purchaseSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.label}
                    className="rounded-[28px] border border-[#dde5cc] bg-[#fbfaf5] p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="rounded-full bg-[#173b2d] p-3 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-semibold text-[#6f8f2f]">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-slate-950">
                      {step.label}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {step.detail}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="destacados"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 sm:px-6 lg:px-8"
        >
          <div className="mb-8">
            <h2 className="font-serif text-3xl text-slate-950 md:text-5xl">
              Productos destacados
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-4">
            {featuredShelf.map((product) => {
              const canPurchase = canPurchaseProduct(product);
              const available = isProductAvailable(product);
              const needsConsult = available && !hasPublishedPrice(product);

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-[28px] border border-[#dce2cd] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_80px_rgba(15,23,42,0.12)]"
                >
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <div className="h-full w-full transition duration-500 group-hover:scale-105">
                      <ProductArtwork product={product} />
                    </div>
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-slate-900">
                      <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
                      Destacado
                    </div>
                    <div
                      className={`absolute bottom-4 left-4 rounded-full px-3 py-1 text-xs font-semibold ${
                        canPurchase
                          ? 'bg-emerald-100 text-emerald-900'
                          : needsConsult
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-white/90 text-slate-700'
                      }`}
                    >
                      {canPurchase
                        ? 'Compra directa'
                        : needsConsult
                          ? 'Consultar precio'
                          : 'Stock limitado'}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-slate-950">
                      {product.name}
                    </h3>
                    <div className="mt-5 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-2xl font-semibold text-slate-950">
                          {formatProductPrice(product)}
                        </p>
                      </div>
                      {canPurchase ? (
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className="inline-flex items-center gap-2 rounded-full bg-[#173b2d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#21503c]"
                        >
                          <Plus className="h-4 w-4" />
                          Agregar
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleConsultProduct(product)}
                          className="inline-flex items-center gap-2 rounded-full border border-[#cad4b2] px-4 py-2 text-sm font-semibold text-[#173b2d] transition hover:border-[#8dc63f] hover:bg-[#edf7d7]"
                        >
                          <ArrowRight className="h-4 w-4" />
                          Consultar
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {featuredShelf.length === 0 && (
            <div className="rounded-[30px] border border-dashed border-[#cfd8b6] bg-white/70 px-8 py-16 text-center">
              <p className="text-lg font-semibold text-slate-900">
                No hay productos destacados.
              </p>
            </div>
          )}
        </section>

        <section
          id="catalogo"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8"
        >
          <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h2 className="font-serif text-3xl text-slate-950 md:text-5xl">
                Catalogo
              </h2>
            </div>

            <div className="w-full max-w-xl">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por nombre, descripcion o categoria"
                  className="w-full rounded-full border border-[#d6debf] bg-white px-12 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#8dc63f]"
                />
              </label>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-3">
            {visibleCategories.map((category) => {
              const active = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-[#173b2d] text-white'
                      : 'border border-[#d6debf] bg-white text-slate-600 hover:border-[#8dc63f] hover:text-[#173b2d]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => {
              const available = isProductAvailable(product);
              const canPurchase = canPurchaseProduct(product);
              const needsConsult = available && !hasPublishedPrice(product);

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-[30px] border border-[#dce2cd] bg-white shadow-[0_16px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    <div className="h-full w-full transition duration-500 group-hover:scale-105">
                      <ProductArtwork product={product} />
                    </div>
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      {product.featured && (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                          Destacado
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-2xl font-semibold text-slate-950">
                          {product.name}
                        </h3>
                      </div>
                      <div
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          canPurchase
                            ? 'bg-emerald-100 text-emerald-800'
                            : needsConsult
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {canPurchase
                          ? 'Disponible'
                          : needsConsult
                            ? 'Consultar precio'
                            : 'Sin stock'}
                      </div>
                    </div>

                    <div className="mt-6 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-3xl font-semibold text-slate-950">
                          {formatProductPrice(product)}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedProduct(product)}
                          className="rounded-full border border-[#d6debf] px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#8dc63f] hover:text-[#173b2d]"
                        >
                          Ver
                        </button>
                        {canPurchase ? (
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="rounded-full bg-[#173b2d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#21503c]"
                          >
                            Agregar
                          </button>
                        ) : needsConsult ? (
                          <button
                            type="button"
                            onClick={() => handleConsultProduct(product)}
                            className="rounded-full border border-[#cad4b2] px-4 py-2 text-sm font-semibold text-[#173b2d] transition hover:border-[#8dc63f] hover:bg-[#edf7d7]"
                          >
                            Consultar
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="rounded-full bg-slate-300 px-4 py-2 text-sm font-semibold text-white"
                          >
                            Sin stock
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="rounded-[30px] border border-dashed border-[#cfd8b6] bg-white/70 px-8 py-16 text-center">
              <p className="text-lg font-semibold text-slate-900">
                No hay productos para ese filtro.
              </p>
              <p className="mt-2 text-slate-500">
                Proba otra categoria o una busqueda mas amplia.
              </p>
            </div>
          )}
        </section>
      </main>

      {selectedProduct && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-5xl overflow-auto rounded-[32px] bg-white shadow-[0_40px_120px_rgba(15,23,42,0.28)]">
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute right-5 top-5 z-10 rounded-full bg-[#173b2d] p-2 text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="grid gap-3 bg-slate-100 p-6">
                {productGallery(selectedProduct).length > 0 ? (
                  productGallery(selectedProduct).map((image, index) => (
                    <img
                      key={`${selectedProduct.id}-${index}`}
                      src={image}
                      alt={`${selectedProduct.name} ${index + 1}`}
                      className="h-72 w-full rounded-[24px] object-cover"
                    />
                  ))
                ) : (
                  <div className="flex h-[460px] items-center justify-center rounded-[24px] bg-[radial-gradient(circle_at_top,_rgba(141,198,63,0.24),_transparent_58%),linear-gradient(135deg,_#173b2d_0%,_#111827_52%,_#335e22_100%)]">
                    <Package className="h-16 w-16 text-emerald-100" />
                  </div>
                )}
              </div>

              <div className="p-8 lg:p-10">
                <h3 className="font-serif text-4xl leading-tight text-slate-950">
                  {selectedProduct.name}
                </h3>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  {selectedProduct.description || 'Sin descripcion cargada.'}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Precio
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {formatProductPrice(selectedProduct)}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Estado
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {selectedProductCanPurchase
                        ? 'Disponible'
                        : selectedProductNeedsConsult
                          ? 'Consultar'
                          : 'Sin stock'}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {selectedProductCanPurchase ? (
                    <button
                      type="button"
                      onClick={() => handleAddToCart(selectedProduct)}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173b2d] px-6 py-3 font-semibold text-white transition hover:bg-[#21503c]"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Agregar al carrito
                    </button>
                  ) : selectedProductNeedsConsult ? (
                    <button
                      type="button"
                      onClick={() => handleConsultProduct(selectedProduct)}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#173b2d] px-6 py-3 font-semibold text-white transition hover:bg-[#21503c]"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Consultar por WhatsApp
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex cursor-not-allowed items-center justify-center rounded-full bg-slate-300 px-6 py-3 font-semibold text-white"
                    >
                      Sin stock
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="inline-flex items-center justify-center rounded-full border border-[#d6debf] px-6 py-3 font-semibold text-slate-700 transition hover:border-[#8dc63f] hover:text-[#173b2d]"
                  >
                    Seguir viendo
                  </button>
                </div>

                <div className="mt-8 rounded-[28px] border border-[#d9edb1] bg-[#edf7d7] p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#365221]" />
                    <div>
                      <p className="font-semibold text-[#2f4a1f]">
                        La disponibilidad viene del stock real.
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#3f612a]">
                        Si el producto tiene precio publicado puedes sumarlo al
                        carrito. Si no, lo consultas directo y sigues con el
                        pedido sin frenar la compra.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {cartRendered && (
        <div
          className={`fixed inset-0 z-50 flex justify-end bg-slate-950/52 backdrop-blur-sm transition-opacity duration-300 ${
            cartVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeCart}
        >
          <div
            className={`flex h-full w-full max-w-xl flex-col bg-[#fffdf8] shadow-[0_24px_80px_rgba(15,23,42,0.24)] transition duration-300 ${
              cartVisible ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e4ead2] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="overflow-hidden rounded-[18px] bg-[#8dc63f] p-1">
                  <img
                    src={brandLogo}
                    alt="Logo Pasos Saludables Stock"
                    className="h-11 w-11 rounded-[14px] object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                    Pedido
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-slate-950">
                    Carrito actual
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-full bg-[#173b2d] p-2 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-[#cdd8b7] bg-white p-10 text-center">
                  <p className="text-lg font-semibold text-slate-900">
                    Todavia no agregaste productos.
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    El popup te va a avisar apenas sumes uno. Despues lo cerras por
                    WhatsApp.
                  </p>
                </div>
              ) : (
                items.map((item) => {
                  const highlighted = highlightedCartItemId === item.product.id;

                  return (
                    <article
                      key={item.product.id}
                      className={`rounded-[28px] border p-4 transition duration-300 ${
                        highlighted
                          ? 'pss-cart-item-pop border-[#cfe799] bg-[#f3fbe3] shadow-[0_20px_40px_rgba(141,198,63,0.18)]'
                          : 'border-[#e4ead2] bg-[#fbfaf5]'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-24 w-24 overflow-hidden rounded-2xl bg-slate-100">
                          <ProductArtwork product={item.product} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="text-lg font-semibold text-slate-950">
                                {item.product.name}
                              </h4>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.product.id)}
                              className="rounded-full border border-[#d6debf] p-2 text-slate-500 transition hover:border-rose-300 hover:text-rose-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-4">
                            <div className="inline-flex items-center rounded-full border border-[#d6debf] bg-white">
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                                className="p-3 text-slate-700 transition hover:text-[#173b2d]"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="min-w-10 text-center text-sm font-semibold text-slate-950">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                                className="p-3 text-slate-700 transition hover:text-[#173b2d]"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                Subtotal
                              </p>
                              <p className="mt-1 text-lg font-semibold text-slate-950">
                                {formatPriceARS(item.product.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            <div className="border-t border-[#e4ead2] px-6 py-6">
              <div className="rounded-[32px] bg-[#173b2d] p-6 text-white shadow-[0_24px_60px_rgba(23,59,45,0.22)]">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-[#daf3af]">
                      Total
                    </p>
                    <p className="mt-2 text-4xl font-semibold">
                      {formatPriceARS(total)}
                    </p>
                  </div>
                  <div className="text-right text-sm text-white/72">
                    <p>{totalItems} unidades</p>
                    <p className="mt-1">Pedido listo para WhatsApp</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  {!minimumOrderReached && items.length > 0 && (
                    <div className="rounded-[24px] border border-[#d9b65a] bg-[#f7d470]/14 px-4 py-4 text-sm text-[#fff0c7]">
                      <p className="font-semibold text-white">
                        Pedido minimo: {formatPriceARS(MIN_ORDER_TOTAL)}
                      </p>
                      <p className="mt-1">
                        Te faltan {formatPriceARS(missingAmountToMinimum)} para poder
                        enviarlo.
                      </p>
                    </div>
                  )}

                  {checkoutFormVisible ? (
                    <form
                      onSubmit={handleCheckoutSubmit}
                      className="grid gap-4 rounded-[28px] border border-white/12 bg-white/8 p-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Datos obligatorios
                        </p>
                        <p className="mt-1 text-sm text-white/72">
                          Antes de enviar el pedido necesitamos nombre, direccion y
                          metodo de pago.
                        </p>
                      </div>

                      <label className="grid gap-2 text-sm">
                        <span className="font-medium text-white">Nombre</span>
                        <input
                          type="text"
                          value={checkoutDetails.customerName}
                          onChange={(event) =>
                            handleCheckoutFieldChange(
                              'customerName',
                              event.target.value
                            )
                          }
                          autoComplete="name"
                          className="rounded-2xl border border-white/12 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#8dc63f]"
                          placeholder="Tu nombre"
                        />
                        {checkoutErrors.customerName && (
                          <span className="text-xs text-[#ffd7d7]">
                            {checkoutErrors.customerName}
                          </span>
                        )}
                      </label>

                      <label className="grid gap-2 text-sm">
                        <span className="font-medium text-white">Direccion</span>
                        <textarea
                          value={checkoutDetails.address}
                          onChange={(event) =>
                            handleCheckoutFieldChange('address', event.target.value)
                          }
                          autoComplete="street-address"
                          rows={3}
                          className="rounded-2xl border border-white/12 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#8dc63f]"
                          placeholder="Direccion de entrega"
                        />
                        {checkoutErrors.address && (
                          <span className="text-xs text-[#ffd7d7]">
                            {checkoutErrors.address}
                          </span>
                        )}
                      </label>

                      <div className="grid gap-2 text-sm">
                        <span className="font-medium text-white">
                          Metodo de pago
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {PAYMENT_METHOD_OPTIONS.map((option) => {
                            const selected =
                              checkoutDetails.paymentMethod === option;

                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() =>
                                  handleCheckoutFieldChange('paymentMethod', option)
                                }
                                className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                                  selected
                                    ? 'border-[#8dc63f] bg-[#8dc63f] text-[#173b2d]'
                                    : 'border-white/14 bg-white/8 text-white hover:border-white/28'
                                }`}
                                aria-pressed={selected}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                        {checkoutErrors.paymentMethod && (
                          <span className="text-xs text-[#ffd7d7]">
                            {checkoutErrors.paymentMethod}
                          </span>
                        )}
                      </div>

                      <div className="grid gap-3 text-sm">
                        <span className="font-medium text-white">
                          Datos para su factura
                        </span>
                        <div className="grid gap-3 rounded-[24px] border border-white/12 bg-white px-4 py-4 text-slate-700 sm:grid-cols-2">
                          {INVOICE_PREFERENCE_OPTIONS.map((option) => {
                            const checked =
                              checkoutDetails.invoicePreference === option;

                            return (
                              <label
                                key={option}
                                className="flex cursor-pointer items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-slate-50"
                              >
                                <input
                                  type="radio"
                                  name="invoicePreference"
                                  value={option}
                                  checked={checked}
                                  onChange={(event) =>
                                    handleCheckoutFieldChange(
                                      'invoicePreference',
                                      event.target.value
                                    )
                                  }
                                  className="h-4 w-4 border-slate-300 text-[#1473e6] focus:ring-[#1473e6]"
                                />
                                <span className="font-medium text-slate-700">
                                  {option}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8dc63f] px-6 py-3 font-semibold text-[#173b2d] transition hover:bg-[#9fd348]"
                        >
                          Confirmar y enviar
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCheckoutFormVisible(false)}
                          className="rounded-full border border-white/16 px-6 py-3 font-medium text-white/84 transition hover:border-white/30 hover:text-white"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8dc63f] px-6 py-3 font-semibold text-[#173b2d] transition hover:bg-[#9fd348]"
                    >
                      Enviar pedido
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={clearCart}
                    className="rounded-full border border-white/16 px-6 py-3 font-medium text-white/84 transition hover:border-white/30 hover:text-white"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {items.length > 0 && !cartRendered && (
        <button
          type="button"
          onClick={openCart}
          className="fixed bottom-4 left-4 right-4 z-40 flex items-center justify-between rounded-full bg-[#173b2d] px-5 py-4 text-left text-white shadow-[0_24px_50px_rgba(23,59,45,0.28)] transition hover:bg-[#21503c] sm:left-auto sm:right-5 sm:w-auto sm:min-w-[280px]"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/12 p-2">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Ver carrito</p>
              <p className="text-xs text-white/72">{totalItems} unidades</p>
            </div>
          </div>
          <span className="text-sm font-semibold">{formatPriceARS(total)}</span>
        </button>
      )}

      {toast && (
        <div
          className={`fixed left-4 right-4 z-50 flex justify-center sm:left-auto sm:right-5 sm:w-auto ${
            items.length > 0 && !cartRendered ? 'bottom-24 sm:bottom-24' : 'bottom-4'
          }`}
        >
          <div
            key={toastKey}
            className={`pss-toast-pop w-full max-w-md rounded-[28px] border px-5 py-4 shadow-[0_30px_80px_rgba(15,23,42,0.16)] ${
              toast.tone === 'error'
                ? 'border-rose-200 bg-rose-50 text-rose-950'
                : 'border-[#dce3ca] bg-white text-slate-950'
            }`}
          >
            <div className="flex items-start gap-4">
              {toast.image ? (
                <div className="h-16 w-16 overflow-hidden rounded-[20px] bg-[#8dc63f] p-1">
                  <img
                    src={toast.image}
                    alt={toast.title}
                    className="h-full w-full rounded-[16px] object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-[18px] ${
                    toast.tone === 'error'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-[#edf7d7] text-[#173b2d]'
                  }`}
                >
                  {toast.tone === 'error' ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <ShoppingCart className="h-5 w-5" />
                  )}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs uppercase tracking-[0.22em] ${
                    toast.tone === 'error' ? 'text-rose-700' : 'text-[#6f8f2f]'
                  }`}
                >
                  {toast.tone === 'error' ? 'Aviso' : 'Carrito actualizado'}
                </p>
                <h4 className="mt-1 text-lg font-semibold">{toast.title}</h4>
                <p
                  className={`mt-2 text-sm leading-6 ${
                    toast.tone === 'error' ? 'text-rose-900/80' : 'text-slate-600'
                  }`}
                >
                  {toast.description}
                </p>

                {toast.showCartAction && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleToastCartAction}
                      className="rounded-full bg-[#173b2d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#21503c]"
                    >
                      Ver carrito
                    </button>
                    <button
                      type="button"
                      onClick={() => setToast(null)}
                      className="rounded-full border border-[#d6debf] px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#8dc63f] hover:text-[#173b2d]"
                    >
                      Seguir viendo
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setToast(null)}
                className="rounded-full border border-black/5 p-2 text-slate-400 transition hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pss-logo-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes pss-badge-bump {
          0% {
            transform: scale(1);
          }
          45% {
            transform: scale(1.08) translateY(-2px);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes pss-cart-item-pop {
          0% {
            transform: translateX(20px) scale(0.98);
            opacity: 0.55;
          }
          60% {
            transform: translateX(-4px) scale(1.01);
            opacity: 1;
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes pss-toast-pop {
          0% {
            transform: translateY(18px) scale(0.94);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        .pss-logo-float {
          animation: pss-logo-float 6s ease-in-out infinite;
        }

        .pss-badge-bump {
          animation: pss-badge-bump 420ms ease;
        }

        .pss-cart-item-pop {
          animation: pss-cart-item-pop 420ms ease;
        }

        .pss-toast-pop {
          animation: pss-toast-pop 280ms cubic-bezier(0.18, 0.89, 0.32, 1.28);
        }
      `}</style>
    </div>
  );
}
