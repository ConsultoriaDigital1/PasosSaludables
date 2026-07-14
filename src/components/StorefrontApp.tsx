import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  X
} from 'lucide-react';
import type { CheckoutDetails, Product, StorefrontBootstrap } from '../types';
import { formatPriceARS } from '../lib/formatters';
import {
  formatProductInquiryMessage,
  formatWhatsAppMessage,
  openWhatsApp,
  WHATSAPP_CONFIG
} from '../lib/whatsapp';
import { useCartStore } from '../stores/cartStore';
import TopBar from './storefront/TopBar';
import SiteHeader from './storefront/SiteHeader';
import HeroCarousel from './storefront/HeroCarousel';
import TrustBar from './storefront/TrustBar';
import FeaturedCarousel from './storefront/FeaturedCarousel';
import ProductCard from './storefront/ProductCard';
import SiteFooter from './storefront/SiteFooter';
import WhatsAppFab from './storefront/WhatsAppFab';
import {
  BRAND_LOGO,
  ProductArtwork,
  WhatsAppIcon,
  canPurchaseProduct,
  dedupeProducts,
  formatProductPrice,
  hasPublishedPrice,
  isProductAvailable,
  productGallery,
  sortProductsForStore
} from './storefront/productHelpers';

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

const MIN_ORDER_TOTAL = 150000;
const PAYMENT_METHOD_OPTIONS = [
  'Pago con QR',
  'Transferencia',
  'Debito',
  'Credito'
] as const;
const INVOICE_PREFERENCE_OPTIONS = ['Prefiero Ticket', 'Quiero Factura'] as const;

const PHONE = WHATSAPP_CONFIG.phoneNumber;

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
    ruc: '',
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
    if (!cartRendered && !selectedProduct) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (selectedProduct) setSelectedProduct(null);
      else closeCart();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cartRendered, selectedProduct]);

  useEffect(() => {
    if (items.length > 0) {
      return;
    }

    setCheckoutFormVisible(false);
    setCheckoutErrors({});
    setCheckoutDetails({
      customerName: '',
      address: '',
      ruc: '',
      paymentMethod: '',
      invoicePreference: 'Prefiero Ticket'
    });
  }, [items.length]);

  const normalizedSearch = search.trim().toLowerCase();
  const visibleCategories = [
    'Todos',
    ...initialData.categories.map((category) => category.name)
  ];

  const allProducts = useMemo(
    () => dedupeProducts([...initialData.products]).sort(sortProductsForStore),
    [initialData.products]
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

  const featuredShelf = useMemo(() => {
    const base =
      initialData.featuredProducts.length > 0
        ? initialData.featuredProducts
        : allProducts.filter((product) => product.featured);

    return dedupeProducts(base).sort(sortProductsForStore);
  }, [initialData.featuredProducts, allProducts]);

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

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);

    if (typeof document !== 'undefined') {
      window.requestAnimationFrame(() => {
        document
          .getElementById('catalogo')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

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
      title: 'Se agregó al carrito',
      description: `${product.name} ya quedó listo para cerrar por WhatsApp cuando quieras.`,
      image: productGallery(product)[0] ?? BRAND_LOGO,
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
      nextErrors.address = 'La dirección es obligatoria.';
    }

    if (!checkoutDetails.paymentMethod) {
      nextErrors.paymentMethod = 'Seleccioná un método de pago.';
    }

    setCheckoutErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      showToast({
        title: 'El carrito está vacío',
        description: 'Agregá productos antes de mandar el pedido.',
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
        title: 'El carrito está vacío',
        description: 'Agregá productos antes de mandar el pedido.',
        tone: 'error'
      });
      return;
    }

    if (!minimumOrderReached) {
      showToast({
        title: 'Pedido mínimo no alcanzado',
        description: `El pedido debe ser de al menos ${formatPriceARS(MIN_ORDER_TOTAL)} para enviarse.`,
        tone: 'error'
      });
      return;
    }

    if (!validateCheckoutDetails()) {
      showToast({
        title: 'Faltan datos obligatorios',
        description: 'Completa nombre, dirección y método de pago antes de enviar.',
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
    <div
      id="top"
      className="relative z-10 flex min-h-screen flex-col bg-gradient-to-b from-white via-marca-50 to-white text-slate-900"
    >
      <TopBar phoneNumber={PHONE} />

      <SiteHeader
        search={search}
        onSearchChange={setSearch}
        categories={visibleCategories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        cartCount={totalItems}
        cartPulse={cartPulse}
        onOpenCart={openCart}
        phoneNumber={PHONE}
      />

      <main className="w-full flex-1">
        <HeroCarousel />

        <div id="como-comprar" className="scroll-mt-24">
          <TrustBar />
        </div>

        {featuredShelf.length > 0 && (
          <FeaturedCarousel
            products={featuredShelf}
            onOpen={setSelectedProduct}
            onAdd={handleAddToCart}
            onConsult={handleConsultProduct}
          />
        )}

        <section
          id="catalogo"
          className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-8 md:py-10"
        >
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-extrabold text-marca-800 md:text-3xl">
                Todo el catálogo
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {filteredProducts.length}
                {filteredProducts.length === 1 ? ' producto' : ' productos'}
                {activeCategory !== 'Todos' ? ` en ${activeCategory}` : ''}
              </p>
            </div>
            {activeCategory !== 'Todos' && (
              <button
                type="button"
                onClick={() => setActiveCategory('Todos')}
                className="text-sm font-bold text-marca-700 hover:text-marca-800 hover:underline"
              >
                Ver todo →
              </button>
            )}
          </div>

          <div className="storefront-scroll-row -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0">
            {visibleCategories.map((category) => {
              const active = activeCategory === category;
              const label = category === 'Todos' ? 'Todos' : category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-marca-600 text-white shadow-sm'
                      : 'border border-marca-200 bg-white text-slate-600 hover:border-marca-400 hover:text-marca-700'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-marca-200 bg-white p-12 text-center">
              <p className="text-lg font-semibold text-slate-900">
                No hay productos para ese filtro.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Probá otra categoría o una búsqueda más amplia.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={setSelectedProduct}
                  onAdd={handleAddToCart}
                  onConsult={handleConsultProduct}
                />
              ))}
            </div>
          )}

          {loadError && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              No pudimos cargar todo el stock en este momento.
            </div>
          )}
        </section>

        <div className="mx-auto w-full max-w-7xl px-4 pb-12">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-marca-700 via-marca-600 to-marca-700 px-6 py-10 text-white shadow-soft md:px-12">
            <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  💬 Atención personalizada
                </span>
                <h3 className="font-serif text-2xl font-extrabold md:text-3xl">
                  ¿No encontrás lo que buscás?
                </h3>
                <p className="max-w-xl text-white/85">
                  Escribinos por WhatsApp y coordinamos tu pedido, resolvemos dudas
                  y te contamos qué hay disponible.
                </p>
              </div>
              <a
                href={`https://wa.me/${PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Consultar por WhatsApp
              </a>
            </div>
            <div
              aria-hidden
              className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-acento-400/20 blur-2xl"
            />
          </section>
        </div>
      </main>

      <SiteFooter
        categories={initialData.categories.map((category) => category.name)}
        onCategory={handleCategoryChange}
        phoneNumber={PHONE}
      />

      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-[32px] bg-white shadow-cardHover"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              aria-label="Cerrar"
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-slate-600 shadow ring-1 ring-slate-200 transition hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid gap-0 lg:grid-cols-2">
              <div className="relative aspect-square overflow-hidden bg-slate-100 lg:rounded-l-[32px]">
                {productGallery(selectedProduct).length > 0 ? (
                  <ProductArtwork product={selectedProduct} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-16 w-16 text-marca-300" />
                  </div>
                )}
                {selectedProduct.featured && (
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-amber-600 shadow ring-1 ring-amber-100 backdrop-blur">
                    ⭐ Destacado
                  </span>
                )}
              </div>

              <div className="flex flex-col p-6 sm:p-8">
                {selectedProduct.category && (
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-marca-600">
                    {selectedProduct.category}
                  </span>
                )}
                <h3 className="mt-1 font-serif text-3xl leading-tight text-slate-950">
                  {selectedProduct.name}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {selectedProduct.description || 'Sin descripción cargada.'}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-marca-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-marca-600">
                      Precio
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-slate-950">
                      {formatProductPrice(selectedProduct)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                      Estado
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-slate-950">
                      {selectedProductCanPurchase
                        ? 'Disponible'
                        : selectedProductNeedsConsult
                          ? 'Consultar'
                          : 'Sin stock'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  {selectedProductCanPurchase ? (
                    <button
                      type="button"
                      onClick={() => handleAddToCart(selectedProduct)}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-marca-600 px-6 py-3 font-semibold text-white shadow-soft transition hover:bg-marca-700"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Agregar al carrito
                    </button>
                  ) : selectedProductNeedsConsult ? (
                    <button
                      type="button"
                      onClick={() => handleConsultProduct(selectedProduct)}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-marca-600 px-6 py-3 font-semibold text-white shadow-soft transition hover:bg-marca-700"
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
                    className="inline-flex items-center justify-center rounded-full border border-marca-200 px-6 py-3 font-semibold text-marca-700 transition hover:border-marca-400 hover:bg-marca-50"
                  >
                    Seguir viendo
                  </button>
                </div>

                <div className="mt-6 rounded-3xl border border-marca-100 bg-marca-50 p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-marca-700" />
                    <p className="text-sm leading-6 text-marca-800">
                      La disponibilidad viene del stock real. Si tiene precio
                      publicado lo sumás al carrito; si no, lo consultás directo
                      por WhatsApp sin frenar la compra.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {cartRendered && (
        <div
          className={`fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${
            cartVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeCart}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Tu carrito"
            className={`flex h-[100dvh] max-h-[100dvh] w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
              cartVisible ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-extrabold text-marca-800">
                  Tu carrito
                </h2>
                <p className="text-xs text-slate-500">
                  {items.length === 0
                    ? 'Todavía no agregaste productos.'
                    : `${items.length} ${items.length === 1 ? 'producto' : 'productos'} listos para enviar por WhatsApp.`}
                </p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Cerrar carrito"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-slate-500">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-marca-50 text-marca-500">
                    <ShoppingCart className="h-9 w-9" />
                  </div>
                  <p>
                    Explorá el catálogo y sumá productos para finalizar por
                    WhatsApp.
                  </p>
                </div>
              ) : checkoutFormVisible ? (
                <form
                  id="checkout-form"
                  onSubmit={handleCheckoutSubmit}
                  className="space-y-3"
                >
                  <div className="space-y-1.5">
                    <label
                      htmlFor="cart-nombre"
                      className="text-xs font-semibold text-slate-600"
                    >
                      Nombre
                    </label>
                    <input
                      id="cart-nombre"
                      type="text"
                      value={checkoutDetails.customerName}
                      onChange={(event) =>
                        handleCheckoutFieldChange(
                          'customerName',
                          event.target.value
                        )
                      }
                      autoComplete="name"
                      placeholder="Tu nombre"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-marca-400 focus:ring-2 focus:ring-marca-100"
                    />
                    {checkoutErrors.customerName && (
                      <span className="text-xs text-rose-600">
                        {checkoutErrors.customerName}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="cart-direccion"
                      className="text-xs font-semibold text-slate-600"
                    >
                      Dirección
                    </label>
                    <textarea
                      id="cart-direccion"
                      value={checkoutDetails.address}
                      onChange={(event) =>
                        handleCheckoutFieldChange('address', event.target.value)
                      }
                      autoComplete="street-address"
                      rows={2}
                      placeholder="Dirección de entrega"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-marca-400 focus:ring-2 focus:ring-marca-100"
                    />
                    {checkoutErrors.address && (
                      <span className="text-xs text-rose-600">
                        {checkoutErrors.address}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="cart-ruc"
                      className="text-xs font-semibold text-slate-600"
                    >
                      RUC (opcional)
                    </label>
                    <input
                      id="cart-ruc"
                      type="text"
                      value={checkoutDetails.ruc}
                      onChange={(event) =>
                        handleCheckoutFieldChange('ruc', event.target.value)
                      }
                      placeholder="RUC"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-marca-400 focus:ring-2 focus:ring-marca-100"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-600">
                      Método de pago
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
                            aria-pressed={selected}
                            className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                              selected
                                ? 'border-marca-600 bg-marca-600 text-white'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-marca-400'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    {checkoutErrors.paymentMethod && (
                      <span className="text-xs text-rose-600">
                        {checkoutErrors.paymentMethod}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-600">
                      Datos para tu factura
                    </span>
                    <div className="grid gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 sm:grid-cols-2">
                      {INVOICE_PREFERENCE_OPTIONS.map((option) => {
                        const checked =
                          checkoutDetails.invoicePreference === option;

                        return (
                          <label
                            key={option}
                            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-slate-50"
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
                              className="h-4 w-4 border-slate-300 text-marca-600 focus:ring-marca-500"
                            />
                            <span className="font-medium text-slate-700">
                              {option}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </form>
              ) : (
                <ul className="space-y-3">
                  {items.map((item) => {
                    const highlighted =
                      highlightedCartItemId === item.product.id;

                    return (
                      <li
                        key={item.product.id}
                        className={`flex gap-3 rounded-2xl border p-3 transition duration-300 ${
                          highlighted
                            ? 'storefront-cart-item-pop border-marca-300 bg-marca-50 shadow-soft'
                            : 'border-slate-100 bg-white shadow-sm'
                        }`}
                      >
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-50">
                          <ProductArtwork product={item.product} />
                        </div>
                        <div className="flex flex-1 flex-col gap-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
                              {item.product.name}
                            </h3>
                            <button
                              type="button"
                              onClick={() => removeItem(item.product.id)}
                              aria-label={`Quitar ${item.product.name}`}
                              className="shrink-0 text-slate-400 transition hover:text-rose-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="text-xs text-slate-500">
                            {formatPriceARS(item.product.price)} c/u
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="inline-flex items-center rounded-full border border-slate-200">
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                                aria-label="Quitar uno"
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-8 text-center text-sm font-semibold text-slate-800">
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
                                aria-label="Agregar uno"
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className="text-sm font-extrabold text-slate-900">
                              {formatPriceARS(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <footer className="shrink-0 space-y-2.5 border-t border-slate-100 bg-white px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Total estimado</span>
                <span className="text-xl font-extrabold text-slate-900">
                  {formatPriceARS(total)}
                </span>
              </div>

              {!minimumOrderReached && items.length > 0 && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
                  <p className="font-semibold">
                    Pedido mínimo: {formatPriceARS(MIN_ORDER_TOTAL)}
                  </p>
                  <p className="mt-1">
                    Te faltan {formatPriceARS(missingAmountToMinimum)} para poder
                    enviarlo.
                  </p>
                </div>
              )}

              {checkoutFormVisible && items.length > 0 ? (
                <>
                  <button
                    type="submit"
                    form="checkout-form"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Enviar pedido por WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutFormVisible(false)}
                    className="w-full rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                  >
                    ← Volver al carrito
                  </button>
                </>
              ) : (
                items.length > 0 && (
                  <>
                    <p className="text-[11px] text-slate-500">
                      El precio final puede ajustarse según stock y costo de
                      envío. Cerrás el pedido con una persona por WhatsApp.
                    </p>
                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-marca-600 px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-marca-700"
                    >
                      Continuar con el pedido
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="w-full rounded-full px-4 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-rose-600"
                    >
                      Vaciar carrito
                    </button>
                  </>
                )
              )}
            </footer>
          </aside>
        </div>
      )}

      {items.length > 0 && !cartRendered && (
        <button
          type="button"
          onClick={openCart}
          className="fixed bottom-4 left-4 right-4 z-30 flex items-center justify-between rounded-full bg-marca-800 px-5 py-4 text-left text-white shadow-[0_24px_50px_rgba(20,83,45,0.28)] transition hover:bg-marca-900 sm:left-auto sm:right-24 sm:w-auto sm:min-w-[280px]"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/15 p-2">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Ver carrito</p>
              <p className="text-xs text-white/75">{totalItems} unidades</p>
            </div>
          </div>
          <span className="text-sm font-semibold">{formatPriceARS(total)}</span>
        </button>
      )}

      {toast && (
        <div
          className={`fixed left-4 right-4 z-50 flex justify-center sm:left-auto sm:right-5 sm:w-auto ${
            items.length > 0 && !cartRendered ? 'bottom-24' : 'bottom-4'
          }`}
        >
          <div
            key={toastKey}
            className={`storefront-toast-pop w-full max-w-md rounded-[24px] border px-5 py-4 shadow-cardHover ${
              toast.tone === 'error'
                ? 'border-rose-200 bg-rose-50 text-rose-950'
                : 'border-marca-100 bg-white text-slate-950'
            }`}
          >
            <div className="flex items-start gap-4">
              {toast.image ? (
                <div className="h-16 w-16 overflow-hidden rounded-2xl bg-marca-50">
                  <img
                    src={toast.image}
                    alt={toast.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                    toast.tone === 'error'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-marca-50 text-marca-700'
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
                  className={`text-xs uppercase tracking-[0.18em] ${
                    toast.tone === 'error' ? 'text-rose-700' : 'text-marca-600'
                  }`}
                >
                  {toast.tone === 'error' ? 'Aviso' : 'Carrito actualizado'}
                </p>
                <h4 className="mt-1 text-base font-semibold">{toast.title}</h4>
                <p
                  className={`mt-1 text-sm leading-6 ${
                    toast.tone === 'error' ? 'text-rose-900/80' : 'text-slate-600'
                  }`}
                >
                  {toast.description}
                </p>

                {toast.showCartAction && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleToastCartAction}
                      className="rounded-full bg-marca-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-marca-700"
                    >
                      Ver carrito
                    </button>
                    <button
                      type="button"
                      onClick={() => setToast(null)}
                      className="rounded-full border border-marca-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-marca-400 hover:text-marca-700"
                    >
                      Seguir viendo
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setToast(null)}
                aria-label="Cerrar aviso"
                className="rounded-full border border-black/5 p-2 text-slate-400 transition hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <WhatsAppFab phoneNumber={PHONE} />

      <style>{`
        @keyframes storefront-badge-bump {
          0% { transform: scale(1); }
          45% { transform: scale(1.18) translateY(-2px); }
          100% { transform: scale(1); }
        }
        @keyframes storefront-cart-item-pop {
          0% { transform: translateX(20px) scale(0.98); opacity: 0.55; }
          60% { transform: translateX(-4px) scale(1.01); opacity: 1; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes storefront-toast-pop {
          0% { transform: translateY(18px) scale(0.94); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .storefront-badge-bump { animation: storefront-badge-bump 420ms ease; }
        .storefront-cart-item-pop { animation: storefront-cart-item-pop 420ms ease; }
        .storefront-toast-pop { animation: storefront-toast-pop 280ms cubic-bezier(0.18, 0.89, 0.32, 1.28); }
        .storefront-scroll-row { -ms-overflow-style: none; scrollbar-width: none; }
        .storefront-scroll-row::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
