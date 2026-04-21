import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/StorefrontApp.tsx");import { jsxDEV } from "/node_modules/react/jsx-dev-runtime.js?v=30349ae4";
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
let prevRefreshReg;
let prevRefreshSig;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("D:/dev/PasosSaludables/src/components/StorefrontApp.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import React, { useEffect, useRef, useState } from "/node_modules/react/index.js?v=30349ae4";
import {
  ArrowRight,
  CheckCircle2,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  X
} from "/node_modules/lucide-react/dist/esm/lucide-react.js?v=30349ae4";
import {
  formatCompactNumber,
  formatDateLabel,
  formatPriceARS
} from "/src/lib/formatters.ts";
import { formatWhatsAppMessage, openWhatsApp } from "/src/lib/whatsapp.ts";
import { useCartStore } from "/src/stores/cartStore.ts";
const brandLogo = "/pasossaludablesstock-logo.jpeg";
const metricCards = (summary) => [
  {
    label: "Productos activos",
    value: formatCompactNumber(summary.totalProducts),
    detail: `${summary.totalCategories} categorias`
  },
  {
    label: "Unidades en stock",
    value: formatCompactNumber(summary.totalStock),
    detail: `${summary.lowStockProducts} con stock bajo`
  },
  {
    label: "Inventario valorizado",
    value: formatPriceARS(summary.inventoryValue),
    detail: `${summary.featuredProducts} destacados`
  }
];
const storeSignals = [
  {
    label: "Stock real y visible",
    detail: "La tienda no inventa disponibilidad. Lee la misma base del stock.",
    icon: CheckCircle2
  },
  {
    label: "Carrito con movimiento",
    detail: "El drawer entra suave, el badge rebota y los items se remarcan al cambiar.",
    icon: ShoppingCart
  },
  {
    label: "Pedido listo para cerrar",
    detail: "El cliente elige, suma y termina el pedido por WhatsApp sin pasos raros.",
    icon: Truck
  }
];
function productGallery(product) {
  if (product.images.length > 0) {
    return product.images;
  }
  return product.image ? [product.image] : [];
}
function ProductArtwork({ product }) {
  if (product.image) {
    return /* @__PURE__ */ jsxDEV(
      "img",
      {
        src: product.image,
        alt: product.name,
        className: "h-full w-full object-cover"
      },
      void 0,
      false,
      {
        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
        lineNumber: 107,
        columnNumber: 7
      },
      this
    );
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(141,198,63,0.24),_transparent_52%),linear-gradient(135deg,_#173b2d_0%,_#1f2937_52%,_#335e22_100%)]", children: /* @__PURE__ */ jsxDEV(Package, { className: "h-14 w-14 text-emerald-100" }, void 0, false, {
    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
    lineNumber: 117,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
    lineNumber: 116,
    columnNumber: 5
  }, this);
}
_c = ProductArtwork;
export default function StorefrontApp({ initialData, loadError = null }) {
  _s();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [toastKey, setToastKey] = useState(0);
  const [cartRendered, setCartRendered] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [highlightedCartItemId, setHighlightedCartItemId] = useState(
    null
  );
  const closeCartTimerRef = useRef(null);
  const {
    items,
    total,
    addItem,
    clearCart,
    getTotalItems,
    removeItem,
    updateQuantity
  } = useCartStore();
  const showToast = (nextToast) => {
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
  const flashCartItem = (productId) => {
    setHighlightedCartItemId(null);
    window.requestAnimationFrame(() => setHighlightedCartItemId(productId));
  };
  useEffect(() => {
    return () => {
      if (closeCartTimerRef.current) {
        window.clearTimeout(closeCartTimerRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if (!toast) {
      return void 0;
    }
    const timeout = window.setTimeout(
      () => setToast(null),
      toast.showCartAction ? 3400 : 2400
    );
    return () => window.clearTimeout(timeout);
  }, [toast]);
  useEffect(() => {
    if (!cartPulse) {
      return void 0;
    }
    const timeout = window.setTimeout(() => setCartPulse(false), 420);
    return () => window.clearTimeout(timeout);
  }, [cartPulse]);
  useEffect(() => {
    if (!highlightedCartItemId) {
      return void 0;
    }
    const timeout = window.setTimeout(() => setHighlightedCartItemId(null), 850);
    return () => window.clearTimeout(timeout);
  }, [highlightedCartItemId]);
  useEffect(() => {
    document.body.style.overflow = cartRendered ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartRendered]);
  useEffect(() => {
    if (!cartRendered) {
      return void 0;
    }
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cartRendered]);
  const normalizedSearch = search.trim().toLowerCase();
  const visibleCategories = [
    "Todos",
    ...initialData.categories.map((category) => category.name)
  ];
  const filteredProducts = initialData.products.filter((product) => {
    const description = product.description || "";
    const category = product.category || "";
    const matchesSearch = !normalizedSearch || product.name.toLowerCase().includes(normalizedSearch) || description.toLowerCase().includes(normalizedSearch) || category.toLowerCase().includes(normalizedSearch);
    const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  const featured = initialData.featuredProducts.length ? initialData.featuredProducts : initialData.products.slice(0, 4);
  const heroFeatured = featured[0] ?? null;
  const totalItems = getTotalItems();
  const currentUpdateLabel = formatDateLabel((/* @__PURE__ */ new Date()).toISOString());
  const handleAddToCart = (product) => {
    if (product.stockQuantity <= 0) {
      showToast({
        title: "Sin stock disponible",
        description: "Ese producto no tiene unidades para vender ahora.",
        tone: "error"
      });
      return;
    }
    addItem(product, 1);
    pulseCart();
    flashCartItem(product.id);
    showToast({
      title: "Se agrego al carrito",
      description: `${product.name} ya quedo listo para cerrar por WhatsApp cuando quieras.`,
      image: productGallery(product)[0] ?? brandLogo,
      tone: "default",
      productId: product.id,
      showCartAction: true
    });
  };
  const handleQuantityChange = (productId, quantity) => {
    updateQuantity(productId, quantity);
    if (quantity > 0) {
      flashCartItem(productId);
    }
  };
  const handleCheckout = () => {
    if (items.length === 0) {
      showToast({
        title: "El carrito esta vacio",
        description: "Agrega productos antes de mandar el pedido.",
        tone: "error"
      });
      return;
    }
    openWhatsApp(formatWhatsAppMessage(items, total));
  };
  const handleToastCartAction = () => {
    if (toast?.productId) {
      flashCartItem(toast.productId);
    }
    openCart();
    setToast(null);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "relative min-h-screen overflow-x-hidden bg-[#f8f4ea] text-slate-950", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(141,198,63,0.16),_transparent_28%),radial-gradient(circle_at_85%_14%,_rgba(16,185,129,0.14),_transparent_26%),linear-gradient(180deg,_#f8f4ea_0%,_#fbfbf7_55%,_#eef5dc_100%)]" }, void 0, false, {
      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
      lineNumber: 331,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("header", { className: "sticky top-0 z-30 border-b border-[#d8dec5] bg-[#f8f4ea]/90 backdrop-blur-xl", children: /* @__PURE__ */ jsxDEV("div", { className: "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxDEV(
        "a",
        {
          href: "/",
          className: "flex items-center gap-3 rounded-full border border-white/75 bg-white/80 px-2 py-2 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur",
          children: [
            /* @__PURE__ */ jsxDEV("div", { className: "overflow-hidden rounded-[20px] bg-[#8dc63f] p-1.5 shadow-inner", children: /* @__PURE__ */ jsxDEV(
              "img",
              {
                src: brandLogo,
                alt: "Logo Pasos Saludables Stock",
                className: "h-12 w-12 rounded-[16px] object-cover"
              },
              void 0,
              false,
              {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 340,
                columnNumber: 15
              },
              this
            ) }, void 0, false, {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 339,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "pr-3", children: [
              /* @__PURE__ */ jsxDEV("p", { className: "font-semibold tracking-tight text-slate-950", children: "Pasos Saludables" }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 347,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs uppercase tracking-[0.24em] text-[#6f8f2f]", children: "tienda + stock real" }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 350,
                columnNumber: 15
              }, this)
            ] }, void 0, true, {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 346,
              columnNumber: 13
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
          lineNumber: 335,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxDEV(
          "a",
          {
            href: "/admin",
            className: "hidden rounded-full border border-[#cad4b2] px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#8dc63f] hover:text-[#173b2d] md:inline-flex",
            children: "Dashboard"
          },
          void 0,
          false,
          {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 357,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: openCart,
            className: `inline-flex items-center gap-2 rounded-full bg-[#173b2d] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(23,59,45,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#21503c] ${cartPulse ? "pss-badge-bump" : ""}`,
            children: [
              /* @__PURE__ */ jsxDEV(ShoppingCart, { className: "h-4 w-4" }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 370,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV("span", { children: "Carrito" }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 371,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV(
                "span",
                {
                  className: `rounded-full px-2 py-0.5 text-xs font-semibold ${cartPulse ? "bg-[#8dc63f] text-[#173b2d]" : "bg-white/12 text-white"}`,
                  children: totalItems
                },
                void 0,
                false,
                {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 372,
                  columnNumber: 15
                },
                this
              )
            ]
          },
          void 0,
          true,
          {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 363,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
        lineNumber: 356,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
      lineNumber: 334,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
      lineNumber: 333,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("main", { children: [
      loadError && /* @__PURE__ */ jsxDEV("section", { className: "mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxDEV("div", { className: "rounded-[28px] border border-amber-200 bg-amber-50 px-5 py-4 text-amber-950 shadow-[0_18px_40px_rgba(120,53,15,0.08)]", children: [
        /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-semibold uppercase tracking-[0.2em] text-amber-700", children: "Datos no disponibles" }, void 0, false, {
          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
          lineNumber: 390,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "mt-2 text-sm leading-6", children: "La tienda cargo, pero no se pudo leer la base de datos en este momento. Se muestra la interfaz sin productos para evitar la pantalla blanca." }, void 0, false, {
          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
          lineNumber: 393,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
        lineNumber: 389,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
        lineNumber: 388,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("section", { className: "mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-20", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "inline-flex items-center gap-2 rounded-full border border-[#b8d87b] bg-[#edf7d7] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#365221]", children: [
            /* @__PURE__ */ jsxDEV(Sparkles, { className: "h-4 w-4" }, void 0, false, {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 405,
              columnNumber: 15
            }, this),
            "ecommerce nuevo sobre la base real"
          ] }, void 0, true, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 404,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("h1", { className: "mt-6 max-w-4xl font-serif text-5xl leading-[0.98] tracking-tight text-slate-950 md:text-7xl", children: "Pasos Saludables ahora tiene una tienda mas natural, mas clara y lista para vender." }, void 0, false, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 409,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "mt-6 max-w-2xl text-lg leading-8 text-slate-700", children: "El logo real del stock ya forma parte de la marca, el catalogo respira mejor y el cliente recibe feedback inmediato cuando suma productos al carrito." }, void 0, false, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 414,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "mt-8 flex flex-col gap-4 sm:flex-row", children: [
            /* @__PURE__ */ jsxDEV(
              "a",
              {
                href: "#catalogo",
                className: "inline-flex items-center justify-center gap-2 rounded-full bg-[#173b2d] px-6 py-3 font-semibold text-white transition hover:bg-[#21503c]",
                children: [
                  "Explorar catalogo",
                  /* @__PURE__ */ jsxDEV(ArrowRight, { className: "h-4 w-4" }, void 0, false, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 426,
                    columnNumber: 17
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 421,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                onClick: openCart,
                className: "inline-flex items-center justify-center gap-2 rounded-full border border-[#cad4b2] px-6 py-3 font-semibold text-slate-700 transition hover:border-[#8dc63f] hover:text-[#173b2d]",
                children: [
                  "Ver carrito",
                  /* @__PURE__ */ jsxDEV(ShoppingBag, { className: "h-4 w-4" }, void 0, false, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 434,
                    columnNumber: 17
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 428,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 420,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "mt-8 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "inline-flex w-fit items-center gap-3 rounded-full border border-white/80 bg-white/80 px-3 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.06)]", children: [
              /* @__PURE__ */ jsxDEV(
                "img",
                {
                  src: brandLogo,
                  alt: "Logo Pasos Saludables Stock",
                  className: "h-10 w-10 rounded-full object-cover"
                },
                void 0,
                false,
                {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 440,
                  columnNumber: 17
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("span", { children: "Marca original integrada en toda la portada" }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 445,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 439,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("p", { children: [
              "Catalogo actualizado ",
              currentUpdateLabel,
              " con stock visible."
            ] }, void 0, true, {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 447,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 438,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "mt-10 grid gap-4 sm:grid-cols-3", children: metricCards(initialData.summary).map(
            (item) => /* @__PURE__ */ jsxDEV(
              "article",
              {
                className: "rounded-[28px] border border-white/75 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur",
                children: [
                  /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-slate-500", children: item.label }, void 0, false, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 456,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "mt-2 text-2xl font-semibold text-slate-950", children: item.value }, void 0, false, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 457,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "mt-2 text-sm text-[#6f8f2f]", children: item.detail }, void 0, false, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 460,
                    columnNumber: 19
                  }, this)
                ]
              },
              item.label,
              true,
              {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 452,
                columnNumber: 15
              },
              this
            )
          ) }, void 0, false, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 450,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
          lineNumber: 403,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "absolute -left-6 top-10 h-28 w-28 rounded-full bg-[#8dc63f]/25 blur-3xl" }, void 0, false, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 467,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "absolute -right-4 bottom-8 h-36 w-36 rounded-full bg-emerald-300/25 blur-3xl" }, void 0, false, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 468,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "relative overflow-hidden rounded-[36px] border border-[#345340] bg-[#173b2d] p-6 text-white shadow-[0_34px_100px_rgba(23,59,45,0.3)]", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_36%),linear-gradient(160deg,_rgba(141,198,63,0.18)_0%,_rgba(23,59,45,0)_54%)]" }, void 0, false, {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 471,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "rounded-[30px] border border-white/12 bg-white/8 p-4 backdrop-blur", children: /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "w-fit rounded-[28px] bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.2)]", children: /* @__PURE__ */ jsxDEV(
                  "img",
                  {
                    src: brandLogo,
                    alt: "Logo Pasos Saludables Stock",
                    className: "pss-logo-float h-24 w-24 rounded-[22px] object-cover"
                  },
                  void 0,
                  false,
                  {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 477,
                    columnNumber: 23
                  },
                  this
                ) }, void 0, false, {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 476,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("p", { className: "text-xs uppercase tracking-[0.24em] text-[#daf3af]", children: "identidad original" }, void 0, false, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 484,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("h2", { className: "mt-2 text-2xl font-semibold", children: "La tienda ya no parece genérica." }, void 0, false, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 487,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "mt-3 max-w-md text-sm leading-6 text-white/76", children: "El verde y el logo del stock ahora conviven con una interfaz nueva, mas humana y menos rigida." }, void 0, false, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 490,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 483,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 475,
                columnNumber: 19
              }, this) }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 474,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "mt-5 grid gap-3", children: storeSignals.map((item) => {
                const Icon = item.icon;
                return /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    className: "flex items-start gap-3 rounded-[24px] border border-white/10 bg-white/8 p-4",
                    children: [
                      /* @__PURE__ */ jsxDEV("div", { className: "rounded-full bg-white/12 p-3", children: /* @__PURE__ */ jsxDEV(Icon, { className: "h-5 w-5 text-[#d9f3af]" }, void 0, false, {
                        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                        lineNumber: 508,
                        columnNumber: 27
                      }, this) }, void 0, false, {
                        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                        lineNumber: 507,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { children: [
                        /* @__PURE__ */ jsxDEV("p", { className: "font-semibold text-white", children: item.label }, void 0, false, {
                          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                          lineNumber: 511,
                          columnNumber: 27
                        }, this),
                        /* @__PURE__ */ jsxDEV("p", { className: "mt-1 text-sm leading-6 text-white/70", children: item.detail }, void 0, false, {
                          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                          lineNumber: 512,
                          columnNumber: 27
                        }, this)
                      ] }, void 0, true, {
                        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                        lineNumber: 510,
                        columnNumber: 25
                      }, this)
                    ]
                  },
                  item.label,
                  true,
                  {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 503,
                    columnNumber: 23
                  },
                  this
                );
              }) }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 498,
                columnNumber: 17
              }, this),
              heroFeatured && /* @__PURE__ */ jsxDEV("div", { className: "mt-5 rounded-[30px] bg-white p-5 text-slate-950", children: [
                /* @__PURE__ */ jsxDEV("p", { className: "text-xs uppercase tracking-[0.22em] text-[#6f8f2f]", children: "para mover ventas hoy" }, void 0, false, {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 523,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "mt-4 flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "h-20 w-20 overflow-hidden rounded-[22px] bg-slate-100", children: /* @__PURE__ */ jsxDEV(ProductArtwork, { product: heroFeatured }, void 0, false, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 528,
                    columnNumber: 25
                  }, this) }, void 0, false, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 527,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxDEV("h3", { className: "truncate text-lg font-semibold text-slate-950", children: heroFeatured.name }, void 0, false, {
                      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                      lineNumber: 531,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "mt-1 text-sm text-slate-500", children: heroFeatured.category }, void 0, false, {
                      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                      lineNumber: 534,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "mt-3 flex items-center justify-between gap-3", children: [
                      /* @__PURE__ */ jsxDEV("p", { className: "text-lg font-semibold text-slate-950", children: formatPriceARS(heroFeatured.price) }, void 0, false, {
                        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                        lineNumber: 538,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleAddToCart(heroFeatured),
                          className: "inline-flex items-center gap-2 rounded-full bg-[#173b2d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#21503c]",
                          children: [
                            /* @__PURE__ */ jsxDEV(Plus, { className: "h-4 w-4" }, void 0, false, {
                              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                              lineNumber: 546,
                              columnNumber: 29
                            }, this),
                            "Sumar ahora"
                          ]
                        },
                        void 0,
                        true,
                        {
                          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                          lineNumber: 541,
                          columnNumber: 27
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                      lineNumber: 537,
                      columnNumber: 25
                    }, this)
                  ] }, void 0, true, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 530,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 526,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 522,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 473,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 470,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
          lineNumber: 466,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
        lineNumber: 402,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("section", { className: "mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "mb-6 flex items-center justify-between", children: /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("p", { className: "text-sm uppercase tracking-[0.24em] text-[#6f8f2f]", children: "Seleccionados" }, void 0, false, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 562,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("h2", { className: "mt-2 font-serif text-3xl text-slate-950 md:text-4xl", children: "Productos que empujan la tienda con una compra mas fluida" }, void 0, false, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 565,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
          lineNumber: 561,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
          lineNumber: 560,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid gap-5 lg:grid-cols-4", children: featured.map(
          (product) => /* @__PURE__ */ jsxDEV(
            "article",
            {
              className: "group overflow-hidden rounded-[28px] border border-[#dce2cd] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_80px_rgba(15,23,42,0.12)]",
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: "relative h-56 overflow-hidden bg-slate-100", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "h-full w-full transition duration-500 group-hover:scale-105", children: /* @__PURE__ */ jsxDEV(ProductArtwork, { product }, void 0, false, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 579,
                    columnNumber: 21
                  }, this) }, void 0, false, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 578,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-slate-900", children: [
                    /* @__PURE__ */ jsxDEV(Star, { className: "h-3.5 w-3.5 fill-current text-amber-500" }, void 0, false, {
                      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                      lineNumber: 582,
                      columnNumber: 21
                    }, this),
                    "Destacado"
                  ] }, void 0, true, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 581,
                    columnNumber: 19
                  }, this)
                ] }, void 0, true, {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 577,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "p-5", children: [
                  /* @__PURE__ */ jsxDEV("p", { className: "text-xs uppercase tracking-[0.22em] text-[#6f8f2f]", children: product.category }, void 0, false, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 587,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("h3", { className: "mt-2 text-xl font-semibold text-slate-950", children: product.name }, void 0, false, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 590,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "mt-3 line-clamp-3 text-sm leading-6 text-slate-600", children: product.description || "Sin descripcion cargada." }, void 0, false, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 593,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "mt-5 flex items-end justify-between gap-4", children: [
                    /* @__PURE__ */ jsxDEV("div", { children: [
                      /* @__PURE__ */ jsxDEV("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: "Precio" }, void 0, false, {
                        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                        lineNumber: 598,
                        columnNumber: 23
                      }, this),
                      /* @__PURE__ */ jsxDEV("p", { className: "mt-1 text-2xl font-semibold text-slate-950", children: formatPriceARS(product.price) }, void 0, false, {
                        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                        lineNumber: 601,
                        columnNumber: 23
                      }, this)
                    ] }, void 0, true, {
                      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                      lineNumber: 597,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleAddToCart(product),
                        className: "inline-flex items-center gap-2 rounded-full bg-[#173b2d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#21503c]",
                        children: [
                          /* @__PURE__ */ jsxDEV(Plus, { className: "h-4 w-4" }, void 0, false, {
                            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                            lineNumber: 610,
                            columnNumber: 23
                          }, this),
                          "Agregar"
                        ]
                      },
                      void 0,
                      true,
                      {
                        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                        lineNumber: 605,
                        columnNumber: 21
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 596,
                    columnNumber: 19
                  }, this)
                ] }, void 0, true, {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 586,
                  columnNumber: 17
                }, this)
              ]
            },
            product.id,
            true,
            {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 573,
              columnNumber: 13
            },
            this
          )
        ) }, void 0, false, {
          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
          lineNumber: 571,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
        lineNumber: 559,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "section",
        {
          id: "catalogo",
          className: "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8",
          children: [
            /* @__PURE__ */ jsxDEV("div", { className: "mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("p", { className: "text-sm uppercase tracking-[0.24em] text-[#6f8f2f]", children: "Catalogo" }, void 0, false, {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 626,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV("h2", { className: "mt-2 font-serif text-3xl text-slate-950 md:text-5xl", children: "Buscar, filtrar y sumar al carrito sin romper el ritmo" }, void 0, false, {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 629,
                  columnNumber: 15
                }, this)
              ] }, void 0, true, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 625,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "w-full max-w-xl", children: /* @__PURE__ */ jsxDEV("label", { className: "relative block", children: [
                /* @__PURE__ */ jsxDEV(Search, { className: "pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" }, void 0, false, {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 636,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    value: search,
                    onChange: (event) => setSearch(event.target.value),
                    placeholder: "Buscar por nombre, descripcion o categoria",
                    className: "w-full rounded-full border border-[#d6debf] bg-white px-12 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#8dc63f]"
                  },
                  void 0,
                  false,
                  {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 637,
                    columnNumber: 17
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 635,
                columnNumber: 15
              }, this) }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 634,
                columnNumber: 13
              }, this)
            ] }, void 0, true, {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 624,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "mb-8 flex flex-wrap gap-3", children: visibleCategories.map((category) => {
              const active = activeCategory === category;
              return /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveCategory(category),
                  className: `rounded-full px-4 py-2 text-sm font-medium transition ${active ? "bg-[#173b2d] text-white" : "border border-[#d6debf] bg-white text-slate-600 hover:border-[#8dc63f] hover:text-[#173b2d]"}`,
                  children: category
                },
                category,
                false,
                {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 652,
                  columnNumber: 17
                },
                this
              );
            }) }, void 0, false, {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 647,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "mb-6 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between", children: [
              /* @__PURE__ */ jsxDEV("p", { children: [
                filteredProducts.length,
                " productos visibles sobre",
                " ",
                initialData.summary.totalProducts,
                "."
              ] }, void 0, true, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 669,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("p", { children: [
                "Ultima actualizacion visible: ",
                currentUpdateLabel,
                "."
              ] }, void 0, true, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 673,
                columnNumber: 13
              }, this)
            ] }, void 0, true, {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 668,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid gap-5 md:grid-cols-2 xl:grid-cols-3", children: filteredProducts.map((product) => {
              const available = product.stockQuantity > 0;
              return /* @__PURE__ */ jsxDEV(
                "article",
                {
                  className: "group overflow-hidden rounded-[30px] border border-[#dce2cd] bg-white shadow-[0_16px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1",
                  children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "relative h-64 overflow-hidden bg-slate-100", children: [
                      /* @__PURE__ */ jsxDEV("div", { className: "h-full w-full transition duration-500 group-hover:scale-105", children: /* @__PURE__ */ jsxDEV(ProductArtwork, { product }, void 0, false, {
                        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                        lineNumber: 687,
                        columnNumber: 23
                      }, this) }, void 0, false, {
                        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                        lineNumber: 686,
                        columnNumber: 21
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "absolute left-4 top-4 flex flex-wrap gap-2", children: [
                        /* @__PURE__ */ jsxDEV("span", { className: "rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-slate-900", children: product.category }, void 0, false, {
                          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                          lineNumber: 690,
                          columnNumber: 23
                        }, this),
                        product.featured && /* @__PURE__ */ jsxDEV("span", { className: "rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800", children: "Destacado" }, void 0, false, {
                          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                          lineNumber: 694,
                          columnNumber: 23
                        }, this)
                      ] }, void 0, true, {
                        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                        lineNumber: 689,
                        columnNumber: 21
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-4 left-4 rounded-full bg-[#173b2d]/90 px-3 py-1 text-xs font-medium text-white backdrop-blur", children: [
                        "Stock: ",
                        product.stockQuantity
                      ] }, void 0, true, {
                        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                        lineNumber: 699,
                        columnNumber: 21
                      }, this)
                    ] }, void 0, true, {
                      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                      lineNumber: 685,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "p-6", children: [
                      /* @__PURE__ */ jsxDEV("div", { className: "flex items-start justify-between gap-4", children: [
                        /* @__PURE__ */ jsxDEV("div", { children: [
                          /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-semibold text-slate-950", children: product.name }, void 0, false, {
                            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                            lineNumber: 707,
                            columnNumber: 25
                          }, this),
                          /* @__PURE__ */ jsxDEV("p", { className: "mt-3 line-clamp-3 text-sm leading-6 text-slate-600", children: product.description || "Sin descripcion cargada." }, void 0, false, {
                            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                            lineNumber: 710,
                            columnNumber: 25
                          }, this)
                        ] }, void 0, true, {
                          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                          lineNumber: 706,
                          columnNumber: 23
                        }, this),
                        /* @__PURE__ */ jsxDEV(
                          "div",
                          {
                            className: `rounded-full px-3 py-1 text-xs font-semibold ${available ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`,
                            children: available ? "Disponible" : "Sin stock"
                          },
                          void 0,
                          false,
                          {
                            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                            lineNumber: 714,
                            columnNumber: 23
                          },
                          this
                        )
                      ] }, void 0, true, {
                        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                        lineNumber: 705,
                        columnNumber: 21
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "mt-6 flex items-end justify-between gap-4", children: [
                        /* @__PURE__ */ jsxDEV("div", { children: [
                          /* @__PURE__ */ jsxDEV("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: "Precio" }, void 0, false, {
                            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                            lineNumber: 727,
                            columnNumber: 25
                          }, this),
                          /* @__PURE__ */ jsxDEV("p", { className: "mt-1 text-3xl font-semibold text-slate-950", children: formatPriceARS(product.price) }, void 0, false, {
                            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                            lineNumber: 730,
                            columnNumber: 25
                          }, this)
                        ] }, void 0, true, {
                          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                          lineNumber: 726,
                          columnNumber: 23
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
                          /* @__PURE__ */ jsxDEV(
                            "button",
                            {
                              type: "button",
                              onClick: () => setSelectedProduct(product),
                              className: "rounded-full border border-[#d6debf] px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#8dc63f] hover:text-[#173b2d]",
                              children: "Ver"
                            },
                            void 0,
                            false,
                            {
                              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                              lineNumber: 736,
                              columnNumber: 25
                            },
                            this
                          ),
                          /* @__PURE__ */ jsxDEV(
                            "button",
                            {
                              type: "button",
                              onClick: () => handleAddToCart(product),
                              disabled: !available,
                              className: "rounded-full bg-[#173b2d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#21503c] disabled:cursor-not-allowed disabled:bg-slate-300",
                              children: "Agregar"
                            },
                            void 0,
                            false,
                            {
                              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                              lineNumber: 743,
                              columnNumber: 25
                            },
                            this
                          )
                        ] }, void 0, true, {
                          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                          lineNumber: 735,
                          columnNumber: 23
                        }, this)
                      ] }, void 0, true, {
                        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                        lineNumber: 725,
                        columnNumber: 21
                      }, this)
                    ] }, void 0, true, {
                      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                      lineNumber: 704,
                      columnNumber: 19
                    }, this)
                  ]
                },
                product.id,
                true,
                {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 681,
                  columnNumber: 17
                },
                this
              );
            }) }, void 0, false, {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 676,
              columnNumber: 11
            }, this),
            filteredProducts.length === 0 && /* @__PURE__ */ jsxDEV("div", { className: "rounded-[30px] border border-dashed border-[#cfd8b6] bg-white/70 px-8 py-16 text-center", children: [
              /* @__PURE__ */ jsxDEV("p", { className: "text-lg font-semibold text-slate-900", children: "No hay productos para ese filtro." }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 761,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "mt-2 text-slate-500", children: "Proba otra categoria o una busqueda mas amplia." }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 764,
                columnNumber: 15
              }, this)
            ] }, void 0, true, {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 760,
              columnNumber: 11
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
          lineNumber: 620,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
      lineNumber: 386,
      columnNumber: 7
    }, this),
    selectedProduct && /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 z-40 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm", children: /* @__PURE__ */ jsxDEV("div", { className: "relative max-h-[90vh] w-full max-w-5xl overflow-auto rounded-[32px] bg-white shadow-[0_40px_120px_rgba(15,23,42,0.28)]", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: () => setSelectedProduct(null),
          className: "absolute right-5 top-5 z-10 rounded-full bg-[#173b2d] p-2 text-white",
          children: /* @__PURE__ */ jsxDEV(X, { className: "h-4 w-4" }, void 0, false, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 780,
            columnNumber: 15
          }, this)
        },
        void 0,
        false,
        {
          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
          lineNumber: 775,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "grid gap-0 lg:grid-cols-[1.05fr_0.95fr]", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "grid gap-3 bg-slate-100 p-6", children: productGallery(selectedProduct).length > 0 ? productGallery(selectedProduct).map(
          (image, index) => /* @__PURE__ */ jsxDEV(
            "img",
            {
              src: image,
              alt: `${selectedProduct.name} ${index + 1}`,
              className: "h-72 w-full rounded-[24px] object-cover"
            },
            `${selectedProduct.id}-${index}`,
            false,
            {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 787,
              columnNumber: 15
            },
            this
          )
        ) : /* @__PURE__ */ jsxDEV("div", { className: "flex h-[460px] items-center justify-center rounded-[24px] bg-[radial-gradient(circle_at_top,_rgba(141,198,63,0.24),_transparent_58%),linear-gradient(135deg,_#173b2d_0%,_#111827_52%,_#335e22_100%)]", children: /* @__PURE__ */ jsxDEV(Package, { className: "h-16 w-16 text-emerald-100" }, void 0, false, {
          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
          lineNumber: 796,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
          lineNumber: 795,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
          lineNumber: 784,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "p-8 lg:p-10", children: [
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs uppercase tracking-[0.24em] text-[#6f8f2f]", children: selectedProduct.category }, void 0, false, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 802,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("h3", { className: "mt-3 font-serif text-4xl leading-tight text-slate-950", children: selectedProduct.name }, void 0, false, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 805,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "mt-5 text-base leading-8 text-slate-600", children: selectedProduct.description || "Sin descripcion cargada." }, void 0, false, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 808,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "mt-8 grid gap-4 sm:grid-cols-3", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "rounded-3xl bg-slate-50 p-4", children: [
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: "Precio" }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 814,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "mt-2 text-2xl font-semibold text-slate-950", children: formatPriceARS(selectedProduct.price) }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 817,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 813,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "rounded-3xl bg-slate-50 p-4", children: [
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: "Stock" }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 822,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "mt-2 text-2xl font-semibold text-slate-950", children: selectedProduct.stockQuantity }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 825,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 821,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "rounded-3xl bg-slate-50 p-4", children: [
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: "Estado" }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 830,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "mt-2 text-2xl font-semibold text-slate-950", children: selectedProduct.stockQuantity > 0 ? "Disponible" : "Agotado" }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 833,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 829,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 812,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "mt-8 flex flex-col gap-3 sm:flex-row", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                onClick: () => handleAddToCart(selectedProduct),
                className: "inline-flex items-center justify-center gap-2 rounded-full bg-[#173b2d] px-6 py-3 font-semibold text-white transition hover:bg-[#21503c]",
                children: [
                  /* @__PURE__ */ jsxDEV(ShoppingCart, { className: "h-4 w-4" }, void 0, false, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 845,
                    columnNumber: 21
                  }, this),
                  "Agregar al carrito"
                ]
              },
              void 0,
              true,
              {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 840,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                onClick: () => setSelectedProduct(null),
                className: "inline-flex items-center justify-center rounded-full border border-[#d6debf] px-6 py-3 font-semibold text-slate-700 transition hover:border-[#8dc63f] hover:text-[#173b2d]",
                children: "Seguir viendo"
              },
              void 0,
              false,
              {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 848,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 839,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "mt-8 rounded-[28px] border border-[#d9edb1] bg-[#edf7d7] p-5", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxDEV(CheckCircle2, { className: "mt-0.5 h-5 w-5 text-[#365221]" }, void 0, false, {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 859,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("p", { className: "font-semibold text-[#2f4a1f]", children: "Esta ficha sale de la DB del stock manager." }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 861,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "mt-1 text-sm leading-6 text-[#3f612a]", children: "La disponibilidad no esta dibujada a mano. Sale del stock real que usa PasosSaludablesStock." }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 864,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 860,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 858,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 857,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
          lineNumber: 801,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
        lineNumber: 783,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
      lineNumber: 774,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
      lineNumber: 773,
      columnNumber: 7
    }, this),
    cartRendered && /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: `fixed inset-0 z-50 flex justify-end bg-slate-950/52 backdrop-blur-sm transition-opacity duration-300 ${cartVisible ? "opacity-100" : "opacity-0"}`,
        onClick: closeCart,
        children: /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: `flex h-full w-full max-w-xl flex-col bg-[#fffdf8] shadow-[0_24px_80px_rgba(15,23,42,0.24)] transition duration-300 ${cartVisible ? "translate-x-0" : "translate-x-full"}`,
            onClick: (event) => event.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between border-b border-[#e4ead2] px-6 py-5", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "overflow-hidden rounded-[18px] bg-[#8dc63f] p-1", children: /* @__PURE__ */ jsxDEV(
                    "img",
                    {
                      src: brandLogo,
                      alt: "Logo Pasos Saludables Stock",
                      className: "h-11 w-11 rounded-[14px] object-cover"
                    },
                    void 0,
                    false,
                    {
                      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                      lineNumber: 893,
                      columnNumber: 19
                    },
                    this
                  ) }, void 0, false, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 892,
                    columnNumber: 17
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    /* @__PURE__ */ jsxDEV("p", { className: "text-sm uppercase tracking-[0.22em] text-[#6f8f2f]", children: "Pedido" }, void 0, false, {
                      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                      lineNumber: 900,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV("h3", { className: "mt-1 text-2xl font-semibold text-slate-950", children: "Carrito actual" }, void 0, false, {
                      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                      lineNumber: 903,
                      columnNumber: 19
                    }, this)
                  ] }, void 0, true, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 899,
                    columnNumber: 17
                  }, this)
                ] }, void 0, true, {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 891,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    type: "button",
                    onClick: closeCart,
                    className: "rounded-full bg-[#173b2d] p-2 text-white",
                    children: /* @__PURE__ */ jsxDEV(X, { className: "h-4 w-4" }, void 0, false, {
                      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                      lineNumber: 913,
                      columnNumber: 17
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 908,
                    columnNumber: 15
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 890,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex-1 space-y-4 overflow-auto px-6 py-6", children: items.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "rounded-[28px] border border-dashed border-[#cdd8b7] bg-white p-10 text-center", children: [
                /* @__PURE__ */ jsxDEV("p", { className: "text-lg font-semibold text-slate-900", children: "Todavia no agregaste productos." }, void 0, false, {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 920,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "mt-2 text-sm text-slate-500", children: "El popup te va a avisar apenas sumes uno. Despues lo cerras por WhatsApp." }, void 0, false, {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 923,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 919,
                columnNumber: 13
              }, this) : items.map((item) => {
                const highlighted = highlightedCartItemId === item.product.id;
                return /* @__PURE__ */ jsxDEV(
                  "article",
                  {
                    className: `rounded-[28px] border p-4 transition duration-300 ${highlighted ? "pss-cart-item-pop border-[#cfe799] bg-[#f3fbe3] shadow-[0_20px_40px_rgba(141,198,63,0.18)]" : "border-[#e4ead2] bg-[#fbfaf5]"}`,
                    children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-4", children: [
                      /* @__PURE__ */ jsxDEV("div", { className: "h-24 w-24 overflow-hidden rounded-2xl bg-slate-100", children: /* @__PURE__ */ jsxDEV(ProductArtwork, { product: item.product }, void 0, false, {
                        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                        lineNumber: 943,
                        columnNumber: 27
                      }, this) }, void 0, false, {
                        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                        lineNumber: 942,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "min-w-0 flex-1", children: [
                        /* @__PURE__ */ jsxDEV("div", { className: "flex items-start justify-between gap-4", children: [
                          /* @__PURE__ */ jsxDEV("div", { children: [
                            /* @__PURE__ */ jsxDEV("p", { className: "text-sm uppercase tracking-[0.22em] text-[#6f8f2f]", children: item.product.category }, void 0, false, {
                              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                              lineNumber: 948,
                              columnNumber: 31
                            }, this),
                            /* @__PURE__ */ jsxDEV("h4", { className: "mt-1 text-lg font-semibold text-slate-950", children: item.product.name }, void 0, false, {
                              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                              lineNumber: 951,
                              columnNumber: 31
                            }, this)
                          ] }, void 0, true, {
                            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                            lineNumber: 947,
                            columnNumber: 29
                          }, this),
                          /* @__PURE__ */ jsxDEV(
                            "button",
                            {
                              type: "button",
                              onClick: () => removeItem(item.product.id),
                              className: "rounded-full border border-[#d6debf] p-2 text-slate-500 transition hover:border-rose-300 hover:text-rose-600",
                              children: /* @__PURE__ */ jsxDEV(X, { className: "h-4 w-4" }, void 0, false, {
                                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                                lineNumber: 960,
                                columnNumber: 31
                              }, this)
                            },
                            void 0,
                            false,
                            {
                              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                              lineNumber: 955,
                              columnNumber: 29
                            },
                            this
                          )
                        ] }, void 0, true, {
                          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                          lineNumber: 946,
                          columnNumber: 27
                        }, this),
                        /* @__PURE__ */ jsxDEV("div", { className: "mt-4 flex items-center justify-between gap-4", children: [
                          /* @__PURE__ */ jsxDEV("div", { className: "inline-flex items-center rounded-full border border-[#d6debf] bg-white", children: [
                            /* @__PURE__ */ jsxDEV(
                              "button",
                              {
                                type: "button",
                                onClick: () => handleQuantityChange(
                                  item.product.id,
                                  item.quantity - 1
                                ),
                                className: "p-3 text-slate-700 transition hover:text-[#173b2d]",
                                children: /* @__PURE__ */ jsxDEV(Minus, { className: "h-4 w-4" }, void 0, false, {
                                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                                  lineNumber: 976,
                                  columnNumber: 33
                                }, this)
                              },
                              void 0,
                              false,
                              {
                                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                                lineNumber: 966,
                                columnNumber: 31
                              },
                              this
                            ),
                            /* @__PURE__ */ jsxDEV("span", { className: "min-w-10 text-center text-sm font-semibold text-slate-950", children: item.quantity }, void 0, false, {
                              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                              lineNumber: 978,
                              columnNumber: 31
                            }, this),
                            /* @__PURE__ */ jsxDEV(
                              "button",
                              {
                                type: "button",
                                onClick: () => handleQuantityChange(
                                  item.product.id,
                                  item.quantity + 1
                                ),
                                className: "p-3 text-slate-700 transition hover:text-[#173b2d]",
                                children: /* @__PURE__ */ jsxDEV(Plus, { className: "h-4 w-4" }, void 0, false, {
                                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                                  lineNumber: 991,
                                  columnNumber: 33
                                }, this)
                              },
                              void 0,
                              false,
                              {
                                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                                lineNumber: 981,
                                columnNumber: 31
                              },
                              this
                            )
                          ] }, void 0, true, {
                            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                            lineNumber: 965,
                            columnNumber: 29
                          }, this),
                          /* @__PURE__ */ jsxDEV("div", { className: "text-right", children: [
                            /* @__PURE__ */ jsxDEV("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: "Subtotal" }, void 0, false, {
                              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                              lineNumber: 996,
                              columnNumber: 31
                            }, this),
                            /* @__PURE__ */ jsxDEV("p", { className: "mt-1 text-lg font-semibold text-slate-950", children: formatPriceARS(item.product.price * item.quantity) }, void 0, false, {
                              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                              lineNumber: 999,
                              columnNumber: 31
                            }, this)
                          ] }, void 0, true, {
                            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                            lineNumber: 995,
                            columnNumber: 29
                          }, this)
                        ] }, void 0, true, {
                          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                          lineNumber: 964,
                          columnNumber: 27
                        }, this)
                      ] }, void 0, true, {
                        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                        lineNumber: 945,
                        columnNumber: 25
                      }, this)
                    ] }, void 0, true, {
                      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                      lineNumber: 941,
                      columnNumber: 23
                    }, this)
                  },
                  item.product.id,
                  false,
                  {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 933,
                    columnNumber: 17
                  },
                  this
                );
              }) }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 917,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "border-t border-[#e4ead2] px-6 py-6", children: /* @__PURE__ */ jsxDEV("div", { className: "rounded-[32px] bg-[#173b2d] p-6 text-white shadow-[0_24px_60px_rgba(23,59,45,0.22)]", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-end justify-between gap-4", children: [
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    /* @__PURE__ */ jsxDEV("p", { className: "text-sm uppercase tracking-[0.22em] text-[#daf3af]", children: "Total" }, void 0, false, {
                      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                      lineNumber: 1016,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "mt-2 text-4xl font-semibold", children: formatPriceARS(total) }, void 0, false, {
                      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                      lineNumber: 1019,
                      columnNumber: 21
                    }, this)
                  ] }, void 0, true, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 1015,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "text-right text-sm text-white/72", children: [
                    /* @__PURE__ */ jsxDEV("p", { children: [
                      totalItems,
                      " unidades"
                    ] }, void 0, true, {
                      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                      lineNumber: 1024,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "mt-1", children: "Pedido listo para WhatsApp" }, void 0, false, {
                      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                      lineNumber: 1025,
                      columnNumber: 21
                    }, this)
                  ] }, void 0, true, {
                    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                    lineNumber: 1023,
                    columnNumber: 19
                  }, this)
                ] }, void 0, true, {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 1014,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "mt-6 grid gap-3", children: [
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      type: "button",
                      onClick: handleCheckout,
                      className: "inline-flex items-center justify-center gap-2 rounded-full bg-[#8dc63f] px-6 py-3 font-semibold text-[#173b2d] transition hover:bg-[#9fd348]",
                      children: [
                        "Enviar pedido",
                        /* @__PURE__ */ jsxDEV(ArrowRight, { className: "h-4 w-4" }, void 0, false, {
                          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                          lineNumber: 1036,
                          columnNumber: 21
                        }, this)
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                      lineNumber: 1030,
                      columnNumber: 19
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      type: "button",
                      onClick: clearCart,
                      className: "rounded-full border border-white/16 px-6 py-3 font-medium text-white/84 transition hover:border-white/30 hover:text-white",
                      children: "Vaciar carrito"
                    },
                    void 0,
                    false,
                    {
                      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                      lineNumber: 1038,
                      columnNumber: 19
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 1029,
                  columnNumber: 17
                }, this)
              ] }, void 0, true, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 1013,
                columnNumber: 15
              }, this) }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 1012,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 884,
            columnNumber: 11
          },
          this
        )
      },
      void 0,
      false,
      {
        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
        lineNumber: 878,
        columnNumber: 7
      },
      this
    ),
    toast && /* @__PURE__ */ jsxDEV("div", { className: "fixed bottom-4 left-4 right-4 z-50 flex justify-center sm:left-auto sm:right-5 sm:w-auto", children: /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: `pss-toast-pop w-full max-w-md rounded-[28px] border px-5 py-4 shadow-[0_30px_80px_rgba(15,23,42,0.16)] ${toast.tone === "error" ? "border-rose-200 bg-rose-50 text-rose-950" : "border-[#dce3ca] bg-white text-slate-950"}`,
        children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-4", children: [
          toast.image ? /* @__PURE__ */ jsxDEV("div", { className: "h-16 w-16 overflow-hidden rounded-[20px] bg-[#8dc63f] p-1", children: /* @__PURE__ */ jsxDEV(
            "img",
            {
              src: toast.image,
              alt: toast.title,
              className: "h-full w-full rounded-[16px] object-cover"
            },
            void 0,
            false,
            {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 1065,
              columnNumber: 19
            },
            this
          ) }, void 0, false, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 1064,
            columnNumber: 13
          }, this) : /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: `flex h-14 w-14 items-center justify-center rounded-[18px] ${toast.tone === "error" ? "bg-rose-100 text-rose-700" : "bg-[#edf7d7] text-[#173b2d]"}`,
              children: toast.tone === "error" ? /* @__PURE__ */ jsxDEV(X, { className: "h-5 w-5" }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 1080,
                columnNumber: 15
              }, this) : /* @__PURE__ */ jsxDEV(ShoppingCart, { className: "h-5 w-5" }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 1082,
                columnNumber: 15
              }, this)
            },
            void 0,
            false,
            {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 1072,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxDEV(
              "p",
              {
                className: `text-xs uppercase tracking-[0.22em] ${toast.tone === "error" ? "text-rose-700" : "text-[#6f8f2f]"}`,
                children: toast.tone === "error" ? "Aviso" : "Carrito actualizado"
              },
              void 0,
              false,
              {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 1088,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("h4", { className: "mt-1 text-lg font-semibold", children: toast.title }, void 0, false, {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 1095,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              "p",
              {
                className: `mt-2 text-sm leading-6 ${toast.tone === "error" ? "text-rose-900/80" : "text-slate-600"}`,
                children: toast.description
              },
              void 0,
              false,
              {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 1096,
                columnNumber: 17
              },
              this
            ),
            toast.showCartAction && /* @__PURE__ */ jsxDEV("div", { className: "mt-4 flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "button",
                  onClick: handleToastCartAction,
                  className: "rounded-full bg-[#173b2d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#21503c]",
                  children: "Ver carrito"
                },
                void 0,
                false,
                {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 1106,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "button",
                  onClick: () => setToast(null),
                  className: "rounded-full border border-[#d6debf] px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#8dc63f] hover:text-[#173b2d]",
                  children: "Seguir viendo"
                },
                void 0,
                false,
                {
                  fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                  lineNumber: 1113,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 1105,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
            lineNumber: 1087,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => setToast(null),
              className: "rounded-full border border-black/5 p-2 text-slate-400 transition hover:text-slate-700",
              children: /* @__PURE__ */ jsxDEV(X, { className: "h-4 w-4" }, void 0, false, {
                fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
                lineNumber: 1129,
                columnNumber: 17
              }, this)
            },
            void 0,
            false,
            {
              fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
              lineNumber: 1124,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
          lineNumber: 1062,
          columnNumber: 13
        }, this)
      },
      toastKey,
      false,
      {
        fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
        lineNumber: 1054,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
      lineNumber: 1053,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("style", { children: `
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
      ` }, void 0, false, {
      fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
      lineNumber: 1136,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "D:/dev/PasosSaludables/src/components/StorefrontApp.tsx",
    lineNumber: 330,
    columnNumber: 5
  }, this);
}
_s(StorefrontApp, "9ifAbUJzIzW6N6/5CiNuCXuXM18=", false, function() {
  return [useCartStore];
});
_c2 = StorefrontApp;
var _c, _c2;
$RefreshReg$(_c, "ProductArtwork");
$RefreshReg$(_c2, "StorefrontApp");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("D:/dev/PasosSaludables/src/components/StorefrontApp.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("D:/dev/PasosSaludables/src/components/StorefrontApp.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBdUZNOzs7Ozs7Ozs7Ozs7Ozs7OztBQXZGTixPQUFPQSxTQUFTQyxXQUFXQyxRQUFRQyxnQkFBZ0I7QUFDbkQ7QUFBQSxFQUNFQztBQUFBQSxFQUNBQztBQUFBQSxFQUNBQztBQUFBQSxFQUNBQztBQUFBQSxFQUNBQztBQUFBQSxFQUNBQztBQUFBQSxFQUNBQztBQUFBQSxFQUNBQztBQUFBQSxFQUNBQztBQUFBQSxFQUNBQztBQUFBQSxFQUNBQztBQUFBQSxFQUNBQztBQUFBQSxPQUNLO0FBRVA7QUFBQSxFQUNFQztBQUFBQSxFQUNBQztBQUFBQSxFQUNBQztBQUFBQSxPQUNLO0FBQ1AsU0FBU0MsdUJBQXVCQyxvQkFBb0I7QUFDcEQsU0FBU0Msb0JBQW9CO0FBZ0I3QixNQUFNQyxZQUFZO0FBRWxCLE1BQU1DLGNBQWNBLENBQUNDLFlBQTRDO0FBQUEsRUFDL0Q7QUFBQSxJQUNFQyxPQUFPO0FBQUEsSUFDUEMsT0FBT1Ysb0JBQW9CUSxRQUFRRyxhQUFhO0FBQUEsSUFDaERDLFFBQVEsR0FBR0osUUFBUUssZUFBZTtBQUFBLEVBQ3BDO0FBQUEsRUFDQTtBQUFBLElBQ0VKLE9BQU87QUFBQSxJQUNQQyxPQUFPVixvQkFBb0JRLFFBQVFNLFVBQVU7QUFBQSxJQUM3Q0YsUUFBUSxHQUFHSixRQUFRTyxnQkFBZ0I7QUFBQSxFQUNyQztBQUFBLEVBQ0E7QUFBQSxJQUNFTixPQUFPO0FBQUEsSUFDUEMsT0FBT1IsZUFBZU0sUUFBUVEsY0FBYztBQUFBLElBQzVDSixRQUFRLEdBQUdKLFFBQVFTLGdCQUFnQjtBQUFBLEVBQ3JDO0FBQUM7QUFHSCxNQUFNQyxlQUFlO0FBQUEsRUFDbkI7QUFBQSxJQUNFVCxPQUFPO0FBQUEsSUFDUEcsUUFBUTtBQUFBLElBQ1JPLE1BQU05QjtBQUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0VvQixPQUFPO0FBQUEsSUFDUEcsUUFBUTtBQUFBLElBQ1JPLE1BQU14QjtBQUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0VjLE9BQU87QUFBQSxJQUNQRyxRQUFRO0FBQUEsSUFDUk8sTUFBTXJCO0FBQUFBLEVBQ1I7QUFBQztBQUdILFNBQVNzQixlQUFlQyxTQUFrQjtBQUN4QyxNQUFJQSxRQUFRQyxPQUFPQyxTQUFTLEdBQUc7QUFDN0IsV0FBT0YsUUFBUUM7QUFBQUEsRUFDakI7QUFFQSxTQUFPRCxRQUFRRyxRQUFRLENBQUNILFFBQVFHLEtBQUssSUFBSTtBQUMzQztBQUVBLFNBQVNDLGVBQWUsRUFBRUosUUFBOEIsR0FBRztBQUN6RCxNQUFJQSxRQUFRRyxPQUFPO0FBQ2pCLFdBQ0U7QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUNDLEtBQUtILFFBQVFHO0FBQUFBLFFBQ2IsS0FBS0gsUUFBUUs7QUFBQUEsUUFDYixXQUFVO0FBQUE7QUFBQSxNQUhaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUd3QztBQUFBLEVBRzVDO0FBRUEsU0FDRSx1QkFBQyxTQUFJLFdBQVUsNkxBQ2IsaUNBQUMsV0FBUSxXQUFVLGdDQUFuQjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBQStDLEtBRGpEO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FFQTtBQUVKO0FBQUNDLEtBaEJRRjtBQWtCVCx3QkFBd0JHLGNBQWMsRUFBRUMsYUFBYUMsWUFBWSxLQUFZLEdBQUc7QUFBQUMsS0FBQTtBQUM5RSxRQUFNLENBQUNDLFFBQVFDLFNBQVMsSUFBSTlDLFNBQVMsRUFBRTtBQUN2QyxRQUFNLENBQUMrQyxnQkFBZ0JDLGlCQUFpQixJQUFJaEQsU0FBUyxPQUFPO0FBQzVELFFBQU0sQ0FBQ2lELGlCQUFpQkMsa0JBQWtCLElBQUlsRCxTQUF5QixJQUFJO0FBQzNFLFFBQU0sQ0FBQ21ELE9BQU9DLFFBQVEsSUFBSXBELFNBQTRCLElBQUk7QUFDMUQsUUFBTSxDQUFDcUQsVUFBVUMsV0FBVyxJQUFJdEQsU0FBUyxDQUFDO0FBQzFDLFFBQU0sQ0FBQ3VELGNBQWNDLGVBQWUsSUFBSXhELFNBQVMsS0FBSztBQUN0RCxRQUFNLENBQUN5RCxhQUFhQyxjQUFjLElBQUkxRCxTQUFTLEtBQUs7QUFDcEQsUUFBTSxDQUFDMkQsV0FBV0MsWUFBWSxJQUFJNUQsU0FBUyxLQUFLO0FBQ2hELFFBQU0sQ0FBQzZELHVCQUF1QkMsd0JBQXdCLElBQUk5RDtBQUFBQSxJQUN4RDtBQUFBLEVBQ0Y7QUFDQSxRQUFNK0Qsb0JBQW9CaEUsT0FBc0IsSUFBSTtBQUVwRCxRQUFNO0FBQUEsSUFDSmlFO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLElBQ0FDO0FBQUFBLEVBQ0YsSUFBSXBELGFBQWE7QUFFakIsUUFBTXFELFlBQVlBLENBQUNDLGNBQTBCO0FBQzNDbEIsZ0JBQVksQ0FBQ21CLFlBQVlBLFVBQVUsQ0FBQztBQUNwQ3JCLGFBQVNvQixTQUFTO0FBQUEsRUFDcEI7QUFFQSxRQUFNRSxXQUFXQSxNQUFNO0FBQ3JCLFFBQUlYLGtCQUFrQlUsU0FBUztBQUM3QkUsYUFBT0MsYUFBYWIsa0JBQWtCVSxPQUFPO0FBQzdDVix3QkFBa0JVLFVBQVU7QUFBQSxJQUM5QjtBQUVBakIsb0JBQWdCLElBQUk7QUFDcEJtQixXQUFPRSxzQkFBc0IsTUFBTW5CLGVBQWUsSUFBSSxDQUFDO0FBQUEsRUFDekQ7QUFFQSxRQUFNb0IsWUFBWUEsTUFBTTtBQUN0QnBCLG1CQUFlLEtBQUs7QUFFcEIsUUFBSUssa0JBQWtCVSxTQUFTO0FBQzdCRSxhQUFPQyxhQUFhYixrQkFBa0JVLE9BQU87QUFBQSxJQUMvQztBQUVBVixzQkFBa0JVLFVBQVVFLE9BQU9JLFdBQVcsTUFBTTtBQUNsRHZCLHNCQUFnQixLQUFLO0FBQ3JCTyx3QkFBa0JVLFVBQVU7QUFBQSxJQUM5QixHQUFHLEdBQUc7QUFBQSxFQUNSO0FBRUEsUUFBTU8sWUFBWUEsTUFBTTtBQUN0QnBCLGlCQUFhLEtBQUs7QUFDbEJlLFdBQU9FLHNCQUFzQixNQUFNakIsYUFBYSxJQUFJLENBQUM7QUFBQSxFQUN2RDtBQUVBLFFBQU1xQixnQkFBZ0JBLENBQUNDLGNBQXNCO0FBQzNDcEIsNkJBQXlCLElBQUk7QUFDN0JhLFdBQU9FLHNCQUFzQixNQUFNZix5QkFBeUJvQixTQUFTLENBQUM7QUFBQSxFQUN4RTtBQUVBcEYsWUFBVSxNQUFNO0FBQ2QsV0FBTyxNQUFNO0FBQ1gsVUFBSWlFLGtCQUFrQlUsU0FBUztBQUM3QkUsZUFBT0MsYUFBYWIsa0JBQWtCVSxPQUFPO0FBQUEsTUFDL0M7QUFBQSxJQUNGO0FBQUEsRUFDRixHQUFHLEVBQUU7QUFFTDNFLFlBQVUsTUFBTTtBQUNkLFFBQUksQ0FBQ3FELE9BQU87QUFDVixhQUFPZ0M7QUFBQUEsSUFDVDtBQUVBLFVBQU1DLFVBQVVULE9BQU9JO0FBQUFBLE1BQ3JCLE1BQU0zQixTQUFTLElBQUk7QUFBQSxNQUNuQkQsTUFBTWtDLGlCQUFpQixPQUFPO0FBQUEsSUFDaEM7QUFFQSxXQUFPLE1BQU1WLE9BQU9DLGFBQWFRLE9BQU87QUFBQSxFQUMxQyxHQUFHLENBQUNqQyxLQUFLLENBQUM7QUFFVnJELFlBQVUsTUFBTTtBQUNkLFFBQUksQ0FBQzZELFdBQVc7QUFDZCxhQUFPd0I7QUFBQUEsSUFDVDtBQUVBLFVBQU1DLFVBQVVULE9BQU9JLFdBQVcsTUFBTW5CLGFBQWEsS0FBSyxHQUFHLEdBQUc7QUFDaEUsV0FBTyxNQUFNZSxPQUFPQyxhQUFhUSxPQUFPO0FBQUEsRUFDMUMsR0FBRyxDQUFDekIsU0FBUyxDQUFDO0FBRWQ3RCxZQUFVLE1BQU07QUFDZCxRQUFJLENBQUMrRCx1QkFBdUI7QUFDMUIsYUFBT3NCO0FBQUFBLElBQ1Q7QUFFQSxVQUFNQyxVQUFVVCxPQUFPSSxXQUFXLE1BQU1qQix5QkFBeUIsSUFBSSxHQUFHLEdBQUc7QUFDM0UsV0FBTyxNQUFNYSxPQUFPQyxhQUFhUSxPQUFPO0FBQUEsRUFDMUMsR0FBRyxDQUFDdkIscUJBQXFCLENBQUM7QUFFMUIvRCxZQUFVLE1BQU07QUFDZHdGLGFBQVNDLEtBQUtDLE1BQU1DLFdBQVdsQyxlQUFlLFdBQVc7QUFFekQsV0FBTyxNQUFNO0FBQ1grQixlQUFTQyxLQUFLQyxNQUFNQyxXQUFXO0FBQUEsSUFDakM7QUFBQSxFQUNGLEdBQUcsQ0FBQ2xDLFlBQVksQ0FBQztBQUVqQnpELFlBQVUsTUFBTTtBQUNkLFFBQUksQ0FBQ3lELGNBQWM7QUFDakIsYUFBTzRCO0FBQUFBLElBQ1Q7QUFFQSxVQUFNTyxnQkFBZ0JBLENBQUNDLFVBQXlCO0FBQzlDLFVBQUlBLE1BQU1DLFFBQVEsVUFBVTtBQUMxQmQsa0JBQVU7QUFBQSxNQUNaO0FBQUEsSUFDRjtBQUVBSCxXQUFPa0IsaUJBQWlCLFdBQVdILGFBQWE7QUFDaEQsV0FBTyxNQUFNZixPQUFPbUIsb0JBQW9CLFdBQVdKLGFBQWE7QUFBQSxFQUNsRSxHQUFHLENBQUNuQyxZQUFZLENBQUM7QUFFakIsUUFBTXdDLG1CQUFtQmxELE9BQU9tRCxLQUFLLEVBQUVDLFlBQVk7QUFDbkQsUUFBTUMsb0JBQW9CO0FBQUEsSUFDeEI7QUFBQSxJQUNBLEdBQUd4RCxZQUFZeUQsV0FBV0MsSUFBSSxDQUFDQyxhQUFhQSxTQUFTOUQsSUFBSTtBQUFBLEVBQUM7QUFHNUQsUUFBTStELG1CQUFtQjVELFlBQVk2RCxTQUFTQyxPQUFPLENBQUN0RSxZQUFZO0FBQ2hFLFVBQU11RSxjQUFjdkUsUUFBUXVFLGVBQWU7QUFDM0MsVUFBTUosV0FBV25FLFFBQVFtRSxZQUFZO0FBRXJDLFVBQU1LLGdCQUNKLENBQUNYLG9CQUNEN0QsUUFBUUssS0FBSzBELFlBQVksRUFBRVUsU0FBU1osZ0JBQWdCLEtBQ3BEVSxZQUFZUixZQUFZLEVBQUVVLFNBQVNaLGdCQUFnQixLQUNuRE0sU0FBU0osWUFBWSxFQUFFVSxTQUFTWixnQkFBZ0I7QUFFbEQsVUFBTWEsa0JBQ0o3RCxtQkFBbUIsV0FBV2IsUUFBUW1FLGFBQWF0RDtBQUVyRCxXQUFPMkQsaUJBQWlCRTtBQUFBQSxFQUMxQixDQUFDO0FBRUQsUUFBTUMsV0FBV25FLFlBQVlaLGlCQUFpQk0sU0FDMUNNLFlBQVlaLG1CQUNaWSxZQUFZNkQsU0FBU08sTUFBTSxHQUFHLENBQUM7QUFDbkMsUUFBTUMsZUFBZUYsU0FBUyxDQUFDLEtBQUs7QUFDcEMsUUFBTUcsYUFBYTVDLGNBQWM7QUFDakMsUUFBTTZDLHFCQUFxQm5HLGlCQUFnQixvQkFBSW9HLEtBQUssR0FBRUMsWUFBWSxDQUFDO0FBRW5FLFFBQU1DLGtCQUFrQkEsQ0FBQ2xGLFlBQXFCO0FBQzVDLFFBQUlBLFFBQVFtRixpQkFBaUIsR0FBRztBQUM5QjlDLGdCQUFVO0FBQUEsUUFDUitDLE9BQU87QUFBQSxRQUNQYixhQUFhO0FBQUEsUUFDYmMsTUFBTTtBQUFBLE1BQ1IsQ0FBQztBQUNEO0FBQUEsSUFDRjtBQUVBckQsWUFBUWhDLFNBQVMsQ0FBQztBQUNsQjhDLGNBQVU7QUFDVkMsa0JBQWMvQyxRQUFRc0YsRUFBRTtBQUV4QmpELGNBQVU7QUFBQSxNQUNSK0MsT0FBTztBQUFBLE1BQ1BiLGFBQWEsR0FBR3ZFLFFBQVFLLElBQUk7QUFBQSxNQUM1QkYsT0FBT0osZUFBZUMsT0FBTyxFQUFFLENBQUMsS0FBS2Y7QUFBQUEsTUFDckNvRyxNQUFNO0FBQUEsTUFDTnJDLFdBQVdoRCxRQUFRc0Y7QUFBQUEsTUFDbkJuQyxnQkFBZ0I7QUFBQSxJQUNsQixDQUFDO0FBQUEsRUFDSDtBQUVBLFFBQU1vQyx1QkFBdUJBLENBQUN2QyxXQUFtQndDLGFBQXFCO0FBQ3BFcEQsbUJBQWVZLFdBQVd3QyxRQUFRO0FBRWxDLFFBQUlBLFdBQVcsR0FBRztBQUNoQnpDLG9CQUFjQyxTQUFTO0FBQUEsSUFDekI7QUFBQSxFQUNGO0FBRUEsUUFBTXlDLGlCQUFpQkEsTUFBTTtBQUMzQixRQUFJM0QsTUFBTTVCLFdBQVcsR0FBRztBQUN0Qm1DLGdCQUFVO0FBQUEsUUFDUitDLE9BQU87QUFBQSxRQUNQYixhQUFhO0FBQUEsUUFDYmMsTUFBTTtBQUFBLE1BQ1IsQ0FBQztBQUNEO0FBQUEsSUFDRjtBQUVBdEcsaUJBQWFELHNCQUFzQmdELE9BQU9DLEtBQUssQ0FBQztBQUFBLEVBQ2xEO0FBRUEsUUFBTTJELHdCQUF3QkEsTUFBTTtBQUNsQyxRQUFJekUsT0FBTytCLFdBQVc7QUFDcEJELG9CQUFjOUIsTUFBTStCLFNBQVM7QUFBQSxJQUMvQjtBQUVBUixhQUFTO0FBQ1R0QixhQUFTLElBQUk7QUFBQSxFQUNmO0FBRUEsU0FDRSx1QkFBQyxTQUFJLFdBQVUsdUVBQ2I7QUFBQSwyQkFBQyxTQUFJLFdBQVUsdVBBQWY7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFrUTtBQUFBLElBRWxRLHVCQUFDLFlBQU8sV0FBVSxnRkFDaEIsaUNBQUMsU0FBSSxXQUFVLHVGQUNiO0FBQUE7QUFBQSxRQUFDO0FBQUE7QUFBQSxVQUNDLE1BQUs7QUFBQSxVQUNMLFdBQVU7QUFBQSxVQUVWO0FBQUEsbUNBQUMsU0FBSSxXQUFVLGtFQUNiO0FBQUEsY0FBQztBQUFBO0FBQUEsZ0JBQ0MsS0FBS2pDO0FBQUFBLGdCQUNMLEtBQUk7QUFBQSxnQkFDSixXQUFVO0FBQUE7QUFBQSxjQUhaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQUdtRCxLQUpyRDtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQU1BO0FBQUEsWUFDQSx1QkFBQyxTQUFJLFdBQVUsUUFDYjtBQUFBLHFDQUFDLE9BQUUsV0FBVSwrQ0FBNkMsZ0NBQTFEO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBRUE7QUFBQSxjQUNBLHVCQUFDLE9BQUUsV0FBVSxzREFBb0QsbUNBQWpFO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBRUE7QUFBQSxpQkFORjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQU9BO0FBQUE7QUFBQTtBQUFBLFFBbEJGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQW1CQTtBQUFBLE1BRUEsdUJBQUMsU0FBSSxXQUFVLDJCQUNiO0FBQUE7QUFBQSxVQUFDO0FBQUE7QUFBQSxZQUNDLE1BQUs7QUFBQSxZQUNMLFdBQVU7QUFBQSxZQUFnSztBQUFBO0FBQUEsVUFGNUs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBS0E7QUFBQSxRQUNBO0FBQUEsVUFBQztBQUFBO0FBQUEsWUFDQyxNQUFLO0FBQUEsWUFDTCxTQUFTdUQ7QUFBQUEsWUFDVCxXQUFXLG9OQUNUZixZQUFZLG1CQUFtQixFQUFFO0FBQUEsWUFHbkM7QUFBQSxxQ0FBQyxnQkFBYSxXQUFVLGFBQXhCO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBQWlDO0FBQUEsY0FDakMsdUJBQUMsVUFBSyx1QkFBTjtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUFhO0FBQUEsY0FDYjtBQUFBLGdCQUFDO0FBQUE7QUFBQSxrQkFDQyxXQUFXLGtEQUNUQSxZQUNJLGdDQUNBLHdCQUF3QjtBQUFBLGtCQUc3QnFEO0FBQUFBO0FBQUFBLGdCQVBIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxjQVFBO0FBQUE7QUFBQTtBQUFBLFVBakJGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQWtCQTtBQUFBLFdBekJGO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUEwQkE7QUFBQSxTQWhERjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBaURBLEtBbERGO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FtREE7QUFBQSxJQUVBLHVCQUFDLFVBQ0VyRTtBQUFBQSxtQkFDQyx1QkFBQyxhQUFRLFdBQVUsK0NBQ2pCLGlDQUFDLFNBQUksV0FBVSx5SEFDYjtBQUFBLCtCQUFDLE9BQUUsV0FBVSxtRUFBaUUsb0NBQTlFO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFFQTtBQUFBLFFBQ0EsdUJBQUMsT0FBRSxXQUFVLDBCQUF3Qiw0SkFBckM7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQUlBO0FBQUEsV0FSRjtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBU0EsS0FWRjtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBV0E7QUFBQSxNQUdGLHVCQUFDLGFBQVEsV0FBVSxrR0FDakI7QUFBQSwrQkFBQyxTQUNDO0FBQUEsaUNBQUMsVUFBSyxXQUFVLCtKQUNkO0FBQUEsbUNBQUMsWUFBUyxXQUFVLGFBQXBCO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBQTZCO0FBQUE7QUFBQSxlQUQvQjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUdBO0FBQUEsVUFFQSx1QkFBQyxRQUFHLFdBQVUsK0ZBQTZGLG1HQUEzRztBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUdBO0FBQUEsVUFFQSx1QkFBQyxPQUFFLFdBQVUsbURBQWlELHFLQUE5RDtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUlBO0FBQUEsVUFFQSx1QkFBQyxTQUFJLFdBQVUsd0NBQ2I7QUFBQTtBQUFBLGNBQUM7QUFBQTtBQUFBLGdCQUNDLE1BQUs7QUFBQSxnQkFDTCxXQUFVO0FBQUEsZ0JBQTBJO0FBQUE7QUFBQSxrQkFHcEosdUJBQUMsY0FBVyxXQUFVLGFBQXRCO0FBQUE7QUFBQTtBQUFBO0FBQUEseUJBQStCO0FBQUE7QUFBQTtBQUFBLGNBTGpDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQU1BO0FBQUEsWUFDQTtBQUFBLGNBQUM7QUFBQTtBQUFBLGdCQUNDLE1BQUs7QUFBQSxnQkFDTCxTQUFTK0I7QUFBQUEsZ0JBQ1QsV0FBVTtBQUFBLGdCQUFrTDtBQUFBO0FBQUEsa0JBRzVMLHVCQUFDLGVBQVksV0FBVSxhQUF2QjtBQUFBO0FBQUE7QUFBQTtBQUFBLHlCQUFnQztBQUFBO0FBQUE7QUFBQSxjQU5sQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFPQTtBQUFBLGVBZkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFnQkE7QUFBQSxVQUVBLHVCQUFDLFNBQUksV0FBVSwrRUFDYjtBQUFBLG1DQUFDLFNBQUksV0FBVSwySUFDYjtBQUFBO0FBQUEsZ0JBQUM7QUFBQTtBQUFBLGtCQUNDLEtBQUt2RDtBQUFBQSxrQkFDTCxLQUFJO0FBQUEsa0JBQ0osV0FBVTtBQUFBO0FBQUEsZ0JBSFo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBR2lEO0FBQUEsY0FFakQsdUJBQUMsVUFBSywyREFBTjtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUFpRDtBQUFBLGlCQU5uRDtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQU9BO0FBQUEsWUFDQSx1QkFBQyxPQUFFO0FBQUE7QUFBQSxjQUFzQjhGO0FBQUFBLGNBQW1CO0FBQUEsaUJBQTVDO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBQStEO0FBQUEsZUFUakU7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFVQTtBQUFBLFVBRUEsdUJBQUMsU0FBSSxXQUFVLG1DQUNaN0Ysc0JBQVlzQixZQUFZckIsT0FBTyxFQUFFK0U7QUFBQUEsWUFBSSxDQUFDeUIsU0FDckM7QUFBQSxjQUFDO0FBQUE7QUFBQSxnQkFFQyxXQUFVO0FBQUEsZ0JBRVY7QUFBQSx5Q0FBQyxPQUFFLFdBQVUsMEJBQTBCQSxlQUFLdkcsU0FBNUM7QUFBQTtBQUFBO0FBQUE7QUFBQSx5QkFBa0Q7QUFBQSxrQkFDbEQsdUJBQUMsT0FBRSxXQUFVLDhDQUNWdUcsZUFBS3RHLFNBRFI7QUFBQTtBQUFBO0FBQUE7QUFBQSx5QkFFQTtBQUFBLGtCQUNBLHVCQUFDLE9BQUUsV0FBVSwrQkFBK0JzRyxlQUFLcEcsVUFBakQ7QUFBQTtBQUFBO0FBQUE7QUFBQSx5QkFBd0Q7QUFBQTtBQUFBO0FBQUEsY0FQbkRvRyxLQUFLdkc7QUFBQUEsY0FEWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBU0E7QUFBQSxVQUNELEtBWkg7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFhQTtBQUFBLGFBNURGO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUE2REE7QUFBQSxRQUVBLHVCQUFDLFNBQUksV0FBVSxZQUNiO0FBQUEsaUNBQUMsU0FBSSxXQUFVLDZFQUFmO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBQXdGO0FBQUEsVUFDeEYsdUJBQUMsU0FBSSxXQUFVLGtGQUFmO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBQTZGO0FBQUEsVUFFN0YsdUJBQUMsU0FBSSxXQUFVLHdJQUNiO0FBQUEsbUNBQUMsU0FBSSxXQUFVLDJLQUFmO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBQXNMO0FBQUEsWUFFdEwsdUJBQUMsU0FBSSxXQUFVLFlBQ2I7QUFBQSxxQ0FBQyxTQUFJLFdBQVUsc0VBQ2IsaUNBQUMsU0FBSSxXQUFVLG1EQUNiO0FBQUEsdUNBQUMsU0FBSSxXQUFVLDZFQUNiO0FBQUEsa0JBQUM7QUFBQTtBQUFBLG9CQUNDLEtBQUtIO0FBQUFBLG9CQUNMLEtBQUk7QUFBQSxvQkFDSixXQUFVO0FBQUE7QUFBQSxrQkFIWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0JBR2tFLEtBSnBFO0FBQUE7QUFBQTtBQUFBO0FBQUEsdUJBTUE7QUFBQSxnQkFDQSx1QkFBQyxTQUNDO0FBQUEseUNBQUMsT0FBRSxXQUFVLHNEQUFvRCxrQ0FBakU7QUFBQTtBQUFBO0FBQUE7QUFBQSx5QkFFQTtBQUFBLGtCQUNBLHVCQUFDLFFBQUcsV0FBVSwrQkFBNkIsZ0RBQTNDO0FBQUE7QUFBQTtBQUFBO0FBQUEseUJBRUE7QUFBQSxrQkFDQSx1QkFBQyxPQUFFLFdBQVUsaURBQStDLDhHQUE1RDtBQUFBO0FBQUE7QUFBQTtBQUFBLHlCQUdBO0FBQUEscUJBVkY7QUFBQTtBQUFBO0FBQUE7QUFBQSx1QkFXQTtBQUFBLG1CQW5CRjtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQW9CQSxLQXJCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQXNCQTtBQUFBLGNBRUEsdUJBQUMsU0FBSSxXQUFVLG1CQUNaWSx1QkFBYXFFLElBQUksQ0FBQ3lCLFNBQVM7QUFDMUIsc0JBQU1DLE9BQU9ELEtBQUs3RjtBQUVsQix1QkFDRTtBQUFBLGtCQUFDO0FBQUE7QUFBQSxvQkFFQyxXQUFVO0FBQUEsb0JBRVY7QUFBQSw2Q0FBQyxTQUFJLFdBQVUsZ0NBQ2IsaUNBQUMsUUFBSyxXQUFVLDRCQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBLDZCQUF3QyxLQUQxQztBQUFBO0FBQUE7QUFBQTtBQUFBLDZCQUVBO0FBQUEsc0JBQ0EsdUJBQUMsU0FDQztBQUFBLCtDQUFDLE9BQUUsV0FBVSw0QkFBNEI2RixlQUFLdkcsU0FBOUM7QUFBQTtBQUFBO0FBQUE7QUFBQSwrQkFBb0Q7QUFBQSx3QkFDcEQsdUJBQUMsT0FBRSxXQUFVLHdDQUNWdUcsZUFBS3BHLFVBRFI7QUFBQTtBQUFBO0FBQUE7QUFBQSwrQkFFQTtBQUFBLDJCQUpGO0FBQUE7QUFBQTtBQUFBO0FBQUEsNkJBS0E7QUFBQTtBQUFBO0FBQUEsa0JBWEtvRyxLQUFLdkc7QUFBQUEsa0JBRFo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxnQkFhQTtBQUFBLGNBRUosQ0FBQyxLQXBCSDtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQXFCQTtBQUFBLGNBRUN5RixnQkFDQyx1QkFBQyxTQUFJLFdBQVUsbURBQ2I7QUFBQSx1Q0FBQyxPQUFFLFdBQVUsc0RBQW9ELHFDQUFqRTtBQUFBO0FBQUE7QUFBQTtBQUFBLHVCQUVBO0FBQUEsZ0JBQ0EsdUJBQUMsU0FBSSxXQUFVLGdDQUNiO0FBQUEseUNBQUMsU0FBSSxXQUFVLHlEQUNiLGlDQUFDLGtCQUFlLFNBQVNBLGdCQUF6QjtBQUFBO0FBQUE7QUFBQTtBQUFBLHlCQUFzQyxLQUR4QztBQUFBO0FBQUE7QUFBQTtBQUFBLHlCQUVBO0FBQUEsa0JBQ0EsdUJBQUMsU0FBSSxXQUFVLGtCQUNiO0FBQUEsMkNBQUMsUUFBRyxXQUFVLGlEQUNYQSx1QkFBYXhFLFFBRGhCO0FBQUE7QUFBQTtBQUFBO0FBQUEsMkJBRUE7QUFBQSxvQkFDQSx1QkFBQyxPQUFFLFdBQVUsK0JBQ1Z3RSx1QkFBYVYsWUFEaEI7QUFBQTtBQUFBO0FBQUE7QUFBQSwyQkFFQTtBQUFBLG9CQUNBLHVCQUFDLFNBQUksV0FBVSxnREFDYjtBQUFBLDZDQUFDLE9BQUUsV0FBVSx3Q0FDVnRGLHlCQUFlZ0csYUFBYWdCLEtBQUssS0FEcEM7QUFBQTtBQUFBO0FBQUE7QUFBQSw2QkFFQTtBQUFBLHNCQUNBO0FBQUEsd0JBQUM7QUFBQTtBQUFBLDBCQUNDLE1BQUs7QUFBQSwwQkFDTCxTQUFTLE1BQU1YLGdCQUFnQkwsWUFBWTtBQUFBLDBCQUMzQyxXQUFVO0FBQUEsMEJBRVY7QUFBQSxtREFBQyxRQUFLLFdBQVUsYUFBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQ0FBeUI7QUFBQTtBQUFBO0FBQUE7QUFBQSx3QkFMM0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQU9BO0FBQUEseUJBWEY7QUFBQTtBQUFBO0FBQUE7QUFBQSwyQkFZQTtBQUFBLHVCQW5CRjtBQUFBO0FBQUE7QUFBQTtBQUFBLHlCQW9CQTtBQUFBLHFCQXhCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLHVCQXlCQTtBQUFBLG1CQTdCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQThCQTtBQUFBLGlCQS9FSjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQWlGQTtBQUFBLGVBcEZGO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBcUZBO0FBQUEsYUF6RkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQTBGQTtBQUFBLFdBMUpGO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUEySkE7QUFBQSxNQUVBLHVCQUFDLGFBQVEsV0FBVSwrQ0FDakI7QUFBQSwrQkFBQyxTQUFJLFdBQVUsMENBQ2IsaUNBQUMsU0FDQztBQUFBLGlDQUFDLE9BQUUsV0FBVSxzREFBb0QsNkJBQWpFO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBRUE7QUFBQSxVQUNBLHVCQUFDLFFBQUcsV0FBVSx1REFBcUQseUVBQW5FO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBRUE7QUFBQSxhQU5GO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFPQSxLQVJGO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFTQTtBQUFBLFFBRUEsdUJBQUMsU0FBSSxXQUFVLDZCQUNaRixtQkFBU1Q7QUFBQUEsVUFBSSxDQUFDbEUsWUFDYjtBQUFBLFlBQUM7QUFBQTtBQUFBLGNBRUMsV0FBVTtBQUFBLGNBRVY7QUFBQSx1Q0FBQyxTQUFJLFdBQVUsOENBQ2I7QUFBQSx5Q0FBQyxTQUFJLFdBQVUsK0RBQ2IsaUNBQUMsa0JBQWUsV0FBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQSx5QkFBaUMsS0FEbkM7QUFBQTtBQUFBO0FBQUE7QUFBQSx5QkFFQTtBQUFBLGtCQUNBLHVCQUFDLFNBQUksV0FBVSxnSUFDYjtBQUFBLDJDQUFDLFFBQUssV0FBVSw2Q0FBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQSwyQkFBeUQ7QUFBQTtBQUFBLHVCQUQzRDtBQUFBO0FBQUE7QUFBQTtBQUFBLHlCQUdBO0FBQUEscUJBUEY7QUFBQTtBQUFBO0FBQUE7QUFBQSx1QkFRQTtBQUFBLGdCQUNBLHVCQUFDLFNBQUksV0FBVSxPQUNiO0FBQUEseUNBQUMsT0FBRSxXQUFVLHNEQUNWQSxrQkFBUW1FLFlBRFg7QUFBQTtBQUFBO0FBQUE7QUFBQSx5QkFFQTtBQUFBLGtCQUNBLHVCQUFDLFFBQUcsV0FBVSw2Q0FDWG5FLGtCQUFRSyxRQURYO0FBQUE7QUFBQTtBQUFBO0FBQUEseUJBRUE7QUFBQSxrQkFDQSx1QkFBQyxPQUFFLFdBQVUsc0RBQ1ZMLGtCQUFRdUUsZUFBZSw4QkFEMUI7QUFBQTtBQUFBO0FBQUE7QUFBQSx5QkFFQTtBQUFBLGtCQUNBLHVCQUFDLFNBQUksV0FBVSw2Q0FDYjtBQUFBLDJDQUFDLFNBQ0M7QUFBQSw2Q0FBQyxPQUFFLFdBQVUscURBQW1ELHNCQUFoRTtBQUFBO0FBQUE7QUFBQTtBQUFBLDZCQUVBO0FBQUEsc0JBQ0EsdUJBQUMsT0FBRSxXQUFVLDhDQUNWMUYseUJBQWVtQixRQUFRNkYsS0FBSyxLQUQvQjtBQUFBO0FBQUE7QUFBQTtBQUFBLDZCQUVBO0FBQUEseUJBTkY7QUFBQTtBQUFBO0FBQUE7QUFBQSwyQkFPQTtBQUFBLG9CQUNBO0FBQUEsc0JBQUM7QUFBQTtBQUFBLHdCQUNDLE1BQUs7QUFBQSx3QkFDTCxTQUFTLE1BQU1YLGdCQUFnQmxGLE9BQU87QUFBQSx3QkFDdEMsV0FBVTtBQUFBLHdCQUVWO0FBQUEsaURBQUMsUUFBSyxXQUFVLGFBQWhCO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUNBQXlCO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBTDNCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxvQkFPQTtBQUFBLHVCQWhCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLHlCQWlCQTtBQUFBLHFCQTNCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLHVCQTRCQTtBQUFBO0FBQUE7QUFBQSxZQXhDS0EsUUFBUXNGO0FBQUFBLFlBRGY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQTBDQTtBQUFBLFFBQ0QsS0E3Q0g7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQThDQTtBQUFBLFdBMURGO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUEyREE7QUFBQSxNQUVBO0FBQUEsUUFBQztBQUFBO0FBQUEsVUFDQyxJQUFHO0FBQUEsVUFDSCxXQUFVO0FBQUEsVUFFVjtBQUFBLG1DQUFDLFNBQUksV0FBVSx3RUFDYjtBQUFBLHFDQUFDLFNBQ0M7QUFBQSx1Q0FBQyxPQUFFLFdBQVUsc0RBQW9ELHdCQUFqRTtBQUFBO0FBQUE7QUFBQTtBQUFBLHVCQUVBO0FBQUEsZ0JBQ0EsdUJBQUMsUUFBRyxXQUFVLHVEQUFxRCxzRUFBbkU7QUFBQTtBQUFBO0FBQUE7QUFBQSx1QkFFQTtBQUFBLG1CQU5GO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBT0E7QUFBQSxjQUVBLHVCQUFDLFNBQUksV0FBVSxtQkFDYixpQ0FBQyxXQUFNLFdBQVUsa0JBQ2Y7QUFBQSx1Q0FBQyxVQUFPLFdBQVUseUZBQWxCO0FBQUE7QUFBQTtBQUFBO0FBQUEsdUJBQXVHO0FBQUEsZ0JBQ3ZHO0FBQUEsa0JBQUM7QUFBQTtBQUFBLG9CQUNDLE9BQU8zRTtBQUFBQSxvQkFDUCxVQUFVLENBQUM4QyxVQUFVN0MsVUFBVTZDLE1BQU1xQyxPQUFPekcsS0FBSztBQUFBLG9CQUNqRCxhQUFZO0FBQUEsb0JBQ1osV0FBVTtBQUFBO0FBQUEsa0JBSlo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGdCQUk2SjtBQUFBLG1CQU4vSjtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQVFBLEtBVEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFVQTtBQUFBLGlCQXBCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQXFCQTtBQUFBLFlBRUEsdUJBQUMsU0FBSSxXQUFVLDZCQUNaMkUsNEJBQWtCRSxJQUFJLENBQUNDLGFBQWE7QUFDbkMsb0JBQU00QixTQUFTbEYsbUJBQW1Cc0Q7QUFFbEMscUJBQ0U7QUFBQSxnQkFBQztBQUFBO0FBQUEsa0JBRUMsTUFBSztBQUFBLGtCQUNMLFNBQVMsTUFBTXJELGtCQUFrQnFELFFBQVE7QUFBQSxrQkFDekMsV0FBVyx5REFDVDRCLFNBQ0ksNEJBQ0EsNkZBQTZGO0FBQUEsa0JBR2xHNUI7QUFBQUE7QUFBQUEsZ0JBVElBO0FBQUFBLGdCQURQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0FXQTtBQUFBLFlBRUosQ0FBQyxLQWxCSDtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQW1CQTtBQUFBLFlBRUEsdUJBQUMsU0FBSSxXQUFVLGtHQUNiO0FBQUEscUNBQUMsT0FDRUM7QUFBQUEsaUNBQWlCbEU7QUFBQUEsZ0JBQU87QUFBQSxnQkFBMEI7QUFBQSxnQkFDbERNLFlBQVlyQixRQUFRRztBQUFBQSxnQkFBYztBQUFBLG1CQUZyQztBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUdBO0FBQUEsY0FDQSx1QkFBQyxPQUFFO0FBQUE7QUFBQSxnQkFBK0J5RjtBQUFBQSxnQkFBbUI7QUFBQSxtQkFBckQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFBc0Q7QUFBQSxpQkFMeEQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFNQTtBQUFBLFlBRUEsdUJBQUMsU0FBSSxXQUFVLDRDQUNaWCwyQkFBaUJGLElBQUksQ0FBQ2xFLFlBQVk7QUFDakMsb0JBQU1nRyxZQUFZaEcsUUFBUW1GLGdCQUFnQjtBQUUxQyxxQkFDRTtBQUFBLGdCQUFDO0FBQUE7QUFBQSxrQkFFQyxXQUFVO0FBQUEsa0JBRVY7QUFBQSwyQ0FBQyxTQUFJLFdBQVUsOENBQ2I7QUFBQSw2Q0FBQyxTQUFJLFdBQVUsK0RBQ2IsaUNBQUMsa0JBQWUsV0FBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQSw2QkFBaUMsS0FEbkM7QUFBQTtBQUFBO0FBQUE7QUFBQSw2QkFFQTtBQUFBLHNCQUNBLHVCQUFDLFNBQUksV0FBVSw4Q0FDYjtBQUFBLCtDQUFDLFVBQUssV0FBVSwyRUFDYm5GLGtCQUFRbUUsWUFEWDtBQUFBO0FBQUE7QUFBQTtBQUFBLCtCQUVBO0FBQUEsd0JBQ0NuRSxRQUFRMkUsWUFDUCx1QkFBQyxVQUFLLFdBQVUsNEVBQTBFLHlCQUExRjtBQUFBO0FBQUE7QUFBQTtBQUFBLCtCQUVBO0FBQUEsMkJBUEo7QUFBQTtBQUFBO0FBQUE7QUFBQSw2QkFTQTtBQUFBLHNCQUNBLHVCQUFDLFNBQUksV0FBVSxnSEFBOEc7QUFBQTtBQUFBLHdCQUNuSDNFLFFBQVFtRjtBQUFBQSwyQkFEbEI7QUFBQTtBQUFBO0FBQUE7QUFBQSw2QkFFQTtBQUFBLHlCQWhCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLDJCQWlCQTtBQUFBLG9CQUVBLHVCQUFDLFNBQUksV0FBVSxPQUNiO0FBQUEsNkNBQUMsU0FBSSxXQUFVLDBDQUNiO0FBQUEsK0NBQUMsU0FDQztBQUFBLGlEQUFDLFFBQUcsV0FBVSx5Q0FDWG5GLGtCQUFRSyxRQURYO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUNBRUE7QUFBQSwwQkFDQSx1QkFBQyxPQUFFLFdBQVUsc0RBQ1ZMLGtCQUFRdUUsZUFBZSw4QkFEMUI7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQ0FFQTtBQUFBLDZCQU5GO0FBQUE7QUFBQTtBQUFBO0FBQUEsK0JBT0E7QUFBQSx3QkFDQTtBQUFBLDBCQUFDO0FBQUE7QUFBQSw0QkFDQyxXQUFXLGdEQUNUeUIsWUFDSSxvQ0FDQSwyQkFBMkI7QUFBQSw0QkFHaENBLHNCQUFZLGVBQWU7QUFBQTtBQUFBLDBCQVA5QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsd0JBUUE7QUFBQSwyQkFqQkY7QUFBQTtBQUFBO0FBQUE7QUFBQSw2QkFrQkE7QUFBQSxzQkFFQSx1QkFBQyxTQUFJLFdBQVUsNkNBQ2I7QUFBQSwrQ0FBQyxTQUNDO0FBQUEsaURBQUMsT0FBRSxXQUFVLHFEQUFtRCxzQkFBaEU7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQ0FFQTtBQUFBLDBCQUNBLHVCQUFDLE9BQUUsV0FBVSw4Q0FDVm5ILHlCQUFlbUIsUUFBUTZGLEtBQUssS0FEL0I7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQ0FFQTtBQUFBLDZCQU5GO0FBQUE7QUFBQTtBQUFBO0FBQUEsK0JBT0E7QUFBQSx3QkFFQSx1QkFBQyxTQUFJLFdBQVUsY0FDYjtBQUFBO0FBQUEsNEJBQUM7QUFBQTtBQUFBLDhCQUNDLE1BQUs7QUFBQSw4QkFDTCxTQUFTLE1BQU03RSxtQkFBbUJoQixPQUFPO0FBQUEsOEJBQ3pDLFdBQVU7QUFBQSw4QkFBMEk7QUFBQTtBQUFBLDRCQUh0SjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsMEJBTUE7QUFBQSwwQkFDQTtBQUFBLDRCQUFDO0FBQUE7QUFBQSw4QkFDQyxNQUFLO0FBQUEsOEJBQ0wsU0FBUyxNQUFNa0YsZ0JBQWdCbEYsT0FBTztBQUFBLDhCQUN0QyxVQUFVLENBQUNnRztBQUFBQSw4QkFDWCxXQUFVO0FBQUEsOEJBQXNKO0FBQUE7QUFBQSw0QkFKbEs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDBCQU9BO0FBQUEsNkJBZkY7QUFBQTtBQUFBO0FBQUE7QUFBQSwrQkFnQkE7QUFBQSwyQkExQkY7QUFBQTtBQUFBO0FBQUE7QUFBQSw2QkEyQkE7QUFBQSx5QkFoREY7QUFBQTtBQUFBO0FBQUE7QUFBQSwyQkFpREE7QUFBQTtBQUFBO0FBQUEsZ0JBdkVLaEcsUUFBUXNGO0FBQUFBLGdCQURmO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0F5RUE7QUFBQSxZQUVKLENBQUMsS0FoRkg7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFpRkE7QUFBQSxZQUVDbEIsaUJBQWlCbEUsV0FBVyxLQUMzQix1QkFBQyxTQUFJLFdBQVUsMkZBQ2I7QUFBQSxxQ0FBQyxPQUFFLFdBQVUsd0NBQXNDLGlEQUFuRDtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUVBO0FBQUEsY0FDQSx1QkFBQyxPQUFFLFdBQVUsdUJBQXFCLCtEQUFsQztBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUVBO0FBQUEsaUJBTkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFPQTtBQUFBO0FBQUE7QUFBQSxRQW5KSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFxSkE7QUFBQSxTQS9YRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBZ1lBO0FBQUEsSUFFQ2EsbUJBQ0MsdUJBQUMsU0FBSSxXQUFVLDRGQUNiLGlDQUFDLFNBQUksV0FBVSwwSEFDYjtBQUFBO0FBQUEsUUFBQztBQUFBO0FBQUEsVUFDQyxNQUFLO0FBQUEsVUFDTCxTQUFTLE1BQU1DLG1CQUFtQixJQUFJO0FBQUEsVUFDdEMsV0FBVTtBQUFBLFVBRVYsaUNBQUMsS0FBRSxXQUFVLGFBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFBc0I7QUFBQTtBQUFBLFFBTHhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQU1BO0FBQUEsTUFFQSx1QkFBQyxTQUFJLFdBQVUsMkNBQ2I7QUFBQSwrQkFBQyxTQUFJLFdBQVUsK0JBQ1pqQix5QkFBZWdCLGVBQWUsRUFBRWIsU0FBUyxJQUN4Q0gsZUFBZWdCLGVBQWUsRUFBRW1EO0FBQUFBLFVBQUksQ0FBQy9ELE9BQU84RixVQUMxQztBQUFBLFlBQUM7QUFBQTtBQUFBLGNBRUMsS0FBSzlGO0FBQUFBLGNBQ0wsS0FBSyxHQUFHWSxnQkFBZ0JWLElBQUksSUFBSTRGLFFBQVEsQ0FBQztBQUFBLGNBQ3pDLFdBQVU7QUFBQTtBQUFBLFlBSEwsR0FBR2xGLGdCQUFnQnVFLEVBQUUsSUFBSVcsS0FBSztBQUFBLFlBRHJDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFJcUQ7QUFBQSxRQUV0RCxJQUVELHVCQUFDLFNBQUksV0FBVSx3TUFDYixpQ0FBQyxXQUFRLFdBQVUsZ0NBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFBK0MsS0FEakQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQUVBLEtBYko7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQWVBO0FBQUEsUUFFQSx1QkFBQyxTQUFJLFdBQVUsZUFDYjtBQUFBLGlDQUFDLE9BQUUsV0FBVSxzREFDVmxGLDBCQUFnQm9ELFlBRG5CO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBRUE7QUFBQSxVQUNBLHVCQUFDLFFBQUcsV0FBVSx5REFDWHBELDBCQUFnQlYsUUFEbkI7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFFQTtBQUFBLFVBQ0EsdUJBQUMsT0FBRSxXQUFVLDJDQUNWVSwwQkFBZ0J3RCxlQUFlLDhCQURsQztBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUVBO0FBQUEsVUFFQSx1QkFBQyxTQUFJLFdBQVUsa0NBQ2I7QUFBQSxtQ0FBQyxTQUFJLFdBQVUsK0JBQ2I7QUFBQSxxQ0FBQyxPQUFFLFdBQVUscURBQW1ELHNCQUFoRTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUVBO0FBQUEsY0FDQSx1QkFBQyxPQUFFLFdBQVUsOENBQ1YxRix5QkFBZWtDLGdCQUFnQjhFLEtBQUssS0FEdkM7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFFQTtBQUFBLGlCQU5GO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBT0E7QUFBQSxZQUNBLHVCQUFDLFNBQUksV0FBVSwrQkFDYjtBQUFBLHFDQUFDLE9BQUUsV0FBVSxxREFBbUQscUJBQWhFO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBRUE7QUFBQSxjQUNBLHVCQUFDLE9BQUUsV0FBVSw4Q0FDVjlFLDBCQUFnQm9FLGlCQURuQjtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUVBO0FBQUEsaUJBTkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFPQTtBQUFBLFlBQ0EsdUJBQUMsU0FBSSxXQUFVLCtCQUNiO0FBQUEscUNBQUMsT0FBRSxXQUFVLHFEQUFtRCxzQkFBaEU7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFFQTtBQUFBLGNBQ0EsdUJBQUMsT0FBRSxXQUFVLDhDQUNWcEUsMEJBQWdCb0UsZ0JBQWdCLElBQUksZUFBZSxhQUR0RDtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUVBO0FBQUEsaUJBTkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFPQTtBQUFBLGVBeEJGO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBeUJBO0FBQUEsVUFFQSx1QkFBQyxTQUFJLFdBQVUsd0NBQ2I7QUFBQTtBQUFBLGNBQUM7QUFBQTtBQUFBLGdCQUNDLE1BQUs7QUFBQSxnQkFDTCxTQUFTLE1BQU1ELGdCQUFnQm5FLGVBQWU7QUFBQSxnQkFDOUMsV0FBVTtBQUFBLGdCQUVWO0FBQUEseUNBQUMsZ0JBQWEsV0FBVSxhQUF4QjtBQUFBO0FBQUE7QUFBQTtBQUFBLHlCQUFpQztBQUFBO0FBQUE7QUFBQTtBQUFBLGNBTG5DO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQU9BO0FBQUEsWUFDQTtBQUFBLGNBQUM7QUFBQTtBQUFBLGdCQUNDLE1BQUs7QUFBQSxnQkFDTCxTQUFTLE1BQU1DLG1CQUFtQixJQUFJO0FBQUEsZ0JBQ3RDLFdBQVU7QUFBQSxnQkFBNEs7QUFBQTtBQUFBLGNBSHhMO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQU1BO0FBQUEsZUFmRjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQWdCQTtBQUFBLFVBRUEsdUJBQUMsU0FBSSxXQUFVLGdFQUNiLGlDQUFDLFNBQUksV0FBVSwwQkFDYjtBQUFBLG1DQUFDLGdCQUFhLFdBQVUsbUNBQXhCO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBQXVEO0FBQUEsWUFDdkQsdUJBQUMsU0FDQztBQUFBLHFDQUFDLE9BQUUsV0FBVSxnQ0FBOEIsMkRBQTNDO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBRUE7QUFBQSxjQUNBLHVCQUFDLE9BQUUsV0FBVSx5Q0FBdUMsNEdBQXBEO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBR0E7QUFBQSxpQkFQRjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQVFBO0FBQUEsZUFWRjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQVdBLEtBWkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFhQTtBQUFBLGFBckVGO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFzRUE7QUFBQSxXQXhGRjtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBeUZBO0FBQUEsU0FsR0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQW1HQSxLQXBHRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBcUdBO0FBQUEsSUFHREssZ0JBQ0M7QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUNDLFdBQVcsd0dBQ1RFLGNBQWMsZ0JBQWdCLFdBQVc7QUFBQSxRQUUzQyxTQUFTcUI7QUFBQUEsUUFFVDtBQUFBLFVBQUM7QUFBQTtBQUFBLFlBQ0MsV0FBVyxzSEFDVHJCLGNBQWMsa0JBQWtCLGtCQUFrQjtBQUFBLFlBRXBELFNBQVMsQ0FBQ2tDLFVBQVVBLE1BQU15QyxnQkFBZ0I7QUFBQSxZQUUxQztBQUFBLHFDQUFDLFNBQUksV0FBVSx5RUFDYjtBQUFBLHVDQUFDLFNBQUksV0FBVSwyQkFDYjtBQUFBLHlDQUFDLFNBQUksV0FBVSxtREFDYjtBQUFBLG9CQUFDO0FBQUE7QUFBQSxzQkFDQyxLQUFLakg7QUFBQUEsc0JBQ0wsS0FBSTtBQUFBLHNCQUNKLFdBQVU7QUFBQTtBQUFBLG9CQUhaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxrQkFHbUQsS0FKckQ7QUFBQTtBQUFBO0FBQUE7QUFBQSx5QkFNQTtBQUFBLGtCQUNBLHVCQUFDLFNBQ0M7QUFBQSwyQ0FBQyxPQUFFLFdBQVUsc0RBQW9ELHNCQUFqRTtBQUFBO0FBQUE7QUFBQTtBQUFBLDJCQUVBO0FBQUEsb0JBQ0EsdUJBQUMsUUFBRyxXQUFVLDhDQUE0Qyw4QkFBMUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSwyQkFFQTtBQUFBLHVCQU5GO0FBQUE7QUFBQTtBQUFBO0FBQUEseUJBT0E7QUFBQSxxQkFmRjtBQUFBO0FBQUE7QUFBQTtBQUFBLHVCQWdCQTtBQUFBLGdCQUNBO0FBQUEsa0JBQUM7QUFBQTtBQUFBLG9CQUNDLE1BQUs7QUFBQSxvQkFDTCxTQUFTMkQ7QUFBQUEsb0JBQ1QsV0FBVTtBQUFBLG9CQUVWLGlDQUFDLEtBQUUsV0FBVSxhQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUEsMkJBQXNCO0FBQUE7QUFBQSxrQkFMeEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGdCQU1BO0FBQUEsbUJBeEJGO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBeUJBO0FBQUEsY0FFQSx1QkFBQyxTQUFJLFdBQVUsNENBQ1pkLGdCQUFNNUIsV0FBVyxJQUNoQix1QkFBQyxTQUFJLFdBQVUsa0ZBQ2I7QUFBQSx1Q0FBQyxPQUFFLFdBQVUsd0NBQXNDLCtDQUFuRDtBQUFBO0FBQUE7QUFBQTtBQUFBLHVCQUVBO0FBQUEsZ0JBQ0EsdUJBQUMsT0FBRSxXQUFVLCtCQUE2Qix5RkFBMUM7QUFBQTtBQUFBO0FBQUE7QUFBQSx1QkFHQTtBQUFBLG1CQVBGO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBUUEsSUFFQTRCLE1BQU1vQyxJQUFJLENBQUN5QixTQUFTO0FBQ2xCLHNCQUFNUSxjQUFjeEUsMEJBQTBCZ0UsS0FBSzNGLFFBQVFzRjtBQUUzRCx1QkFDRTtBQUFBLGtCQUFDO0FBQUE7QUFBQSxvQkFFQyxXQUFXLHFEQUNUYSxjQUNJLCtGQUNBLCtCQUErQjtBQUFBLG9CQUdyQyxpQ0FBQyxTQUFJLFdBQVUsMEJBQ2I7QUFBQSw2Q0FBQyxTQUFJLFdBQVUsc0RBQ2IsaUNBQUMsa0JBQWUsU0FBU1IsS0FBSzNGLFdBQTlCO0FBQUE7QUFBQTtBQUFBO0FBQUEsNkJBQXNDLEtBRHhDO0FBQUE7QUFBQTtBQUFBO0FBQUEsNkJBRUE7QUFBQSxzQkFDQSx1QkFBQyxTQUFJLFdBQVUsa0JBQ2I7QUFBQSwrQ0FBQyxTQUFJLFdBQVUsMENBQ2I7QUFBQSxpREFBQyxTQUNDO0FBQUEsbURBQUMsT0FBRSxXQUFVLHNEQUNWMkYsZUFBSzNGLFFBQVFtRSxZQURoQjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1DQUVBO0FBQUEsNEJBQ0EsdUJBQUMsUUFBRyxXQUFVLDZDQUNYd0IsZUFBSzNGLFFBQVFLLFFBRGhCO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUNBRUE7QUFBQSwrQkFORjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlDQU9BO0FBQUEsMEJBQ0E7QUFBQSw0QkFBQztBQUFBO0FBQUEsOEJBQ0MsTUFBSztBQUFBLDhCQUNMLFNBQVMsTUFBTThCLFdBQVd3RCxLQUFLM0YsUUFBUXNGLEVBQUU7QUFBQSw4QkFDekMsV0FBVTtBQUFBLDhCQUVWLGlDQUFDLEtBQUUsV0FBVSxhQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUEscUNBQXNCO0FBQUE7QUFBQSw0QkFMeEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDBCQU1BO0FBQUEsNkJBZkY7QUFBQTtBQUFBO0FBQUE7QUFBQSwrQkFnQkE7QUFBQSx3QkFFQSx1QkFBQyxTQUFJLFdBQVUsZ0RBQ2I7QUFBQSxpREFBQyxTQUFJLFdBQVUsMEVBQ2I7QUFBQTtBQUFBLDhCQUFDO0FBQUE7QUFBQSxnQ0FDQyxNQUFLO0FBQUEsZ0NBQ0wsU0FBUyxNQUNQQztBQUFBQSxrQ0FDRUksS0FBSzNGLFFBQVFzRjtBQUFBQSxrQ0FDYkssS0FBS0gsV0FBVztBQUFBLGdDQUNsQjtBQUFBLGdDQUVGLFdBQVU7QUFBQSxnQ0FFVixpQ0FBQyxTQUFNLFdBQVUsYUFBakI7QUFBQTtBQUFBO0FBQUE7QUFBQSx1Q0FBMEI7QUFBQTtBQUFBLDhCQVY1QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsNEJBV0E7QUFBQSw0QkFDQSx1QkFBQyxVQUFLLFdBQVUsNkRBQ2JHLGVBQUtILFlBRFI7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQ0FFQTtBQUFBLDRCQUNBO0FBQUEsOEJBQUM7QUFBQTtBQUFBLGdDQUNDLE1BQUs7QUFBQSxnQ0FDTCxTQUFTLE1BQ1BEO0FBQUFBLGtDQUNFSSxLQUFLM0YsUUFBUXNGO0FBQUFBLGtDQUNiSyxLQUFLSCxXQUFXO0FBQUEsZ0NBQ2xCO0FBQUEsZ0NBRUYsV0FBVTtBQUFBLGdDQUVWLGlDQUFDLFFBQUssV0FBVSxhQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBLHVDQUF5QjtBQUFBO0FBQUEsOEJBVjNCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw0QkFXQTtBQUFBLCtCQTNCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlDQTRCQTtBQUFBLDBCQUVBLHVCQUFDLFNBQUksV0FBVSxjQUNiO0FBQUEsbURBQUMsT0FBRSxXQUFVLHFEQUFtRCx3QkFBaEU7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQ0FFQTtBQUFBLDRCQUNBLHVCQUFDLE9BQUUsV0FBVSw2Q0FDVjNHLHlCQUFlOEcsS0FBSzNGLFFBQVE2RixRQUFRRixLQUFLSCxRQUFRLEtBRHBEO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUNBRUE7QUFBQSwrQkFORjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlDQU9BO0FBQUEsNkJBdENGO0FBQUE7QUFBQTtBQUFBO0FBQUEsK0JBdUNBO0FBQUEsMkJBMURGO0FBQUE7QUFBQTtBQUFBO0FBQUEsNkJBMkRBO0FBQUEseUJBL0RGO0FBQUE7QUFBQTtBQUFBO0FBQUEsMkJBZ0VBO0FBQUE7QUFBQSxrQkF2RUtHLEtBQUszRixRQUFRc0Y7QUFBQUEsa0JBRHBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0JBeUVBO0FBQUEsY0FFSixDQUFDLEtBM0ZMO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBNkZBO0FBQUEsY0FFQSx1QkFBQyxTQUFJLFdBQVUsdUNBQ2IsaUNBQUMsU0FBSSxXQUFVLHVGQUNiO0FBQUEsdUNBQUMsU0FBSSxXQUFVLHdDQUNiO0FBQUEseUNBQUMsU0FDQztBQUFBLDJDQUFDLE9BQUUsV0FBVSxzREFBb0QscUJBQWpFO0FBQUE7QUFBQTtBQUFBO0FBQUEsMkJBRUE7QUFBQSxvQkFDQSx1QkFBQyxPQUFFLFdBQVUsK0JBQ1Z6Ryx5QkFBZWtELEtBQUssS0FEdkI7QUFBQTtBQUFBO0FBQUE7QUFBQSwyQkFFQTtBQUFBLHVCQU5GO0FBQUE7QUFBQTtBQUFBO0FBQUEseUJBT0E7QUFBQSxrQkFDQSx1QkFBQyxTQUFJLFdBQVUsb0NBQ2I7QUFBQSwyQ0FBQyxPQUFHK0M7QUFBQUE7QUFBQUEsc0JBQVc7QUFBQSx5QkFBZjtBQUFBO0FBQUE7QUFBQTtBQUFBLDJCQUF3QjtBQUFBLG9CQUN4Qix1QkFBQyxPQUFFLFdBQVUsUUFBTywwQ0FBcEI7QUFBQTtBQUFBO0FBQUE7QUFBQSwyQkFBOEM7QUFBQSx1QkFGaEQ7QUFBQTtBQUFBO0FBQUE7QUFBQSx5QkFHQTtBQUFBLHFCQVpGO0FBQUE7QUFBQTtBQUFBO0FBQUEsdUJBYUE7QUFBQSxnQkFFQSx1QkFBQyxTQUFJLFdBQVUsbUJBQ2I7QUFBQTtBQUFBLG9CQUFDO0FBQUE7QUFBQSxzQkFDQyxNQUFLO0FBQUEsc0JBQ0wsU0FBU1c7QUFBQUEsc0JBQ1QsV0FBVTtBQUFBLHNCQUE4STtBQUFBO0FBQUEsd0JBR3hKLHVCQUFDLGNBQVcsV0FBVSxhQUF0QjtBQUFBO0FBQUE7QUFBQTtBQUFBLCtCQUErQjtBQUFBO0FBQUE7QUFBQSxvQkFOakM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGtCQU9BO0FBQUEsa0JBQ0E7QUFBQSxvQkFBQztBQUFBO0FBQUEsc0JBQ0MsTUFBSztBQUFBLHNCQUNMLFNBQVN4RDtBQUFBQSxzQkFDVCxXQUFVO0FBQUEsc0JBQTJIO0FBQUE7QUFBQSxvQkFIdkk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGtCQU1BO0FBQUEscUJBZkY7QUFBQTtBQUFBO0FBQUE7QUFBQSx1QkFnQkE7QUFBQSxtQkFoQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFpQ0EsS0FsQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFtQ0E7QUFBQTtBQUFBO0FBQUEsVUFuS0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBb0tBO0FBQUE7QUFBQSxNQTFLRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUEyS0E7QUFBQSxJQUdEaEIsU0FDQyx1QkFBQyxTQUFJLFdBQVUsNEZBQ2I7QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUVDLFdBQVcsMEdBQ1RBLE1BQU1vRSxTQUFTLFVBQ1gsNkNBQ0EsMENBQTBDO0FBQUEsUUFHaEQsaUNBQUMsU0FBSSxXQUFVLDBCQUNacEU7QUFBQUEsZ0JBQU1kLFFBQ0wsdUJBQUMsU0FBSSxXQUFVLDZEQUNiO0FBQUEsWUFBQztBQUFBO0FBQUEsY0FDQyxLQUFLYyxNQUFNZDtBQUFBQSxjQUNYLEtBQUtjLE1BQU1tRTtBQUFBQSxjQUNYLFdBQVU7QUFBQTtBQUFBLFlBSFo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBR3VELEtBSnpEO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBTUEsSUFFQTtBQUFBLFlBQUM7QUFBQTtBQUFBLGNBQ0MsV0FBVyw2REFDVG5FLE1BQU1vRSxTQUFTLFVBQ1gsOEJBQ0EsNkJBQTZCO0FBQUEsY0FHbENwRSxnQkFBTW9FLFNBQVMsVUFDZCx1QkFBQyxLQUFFLFdBQVUsYUFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUFzQixJQUV0Qix1QkFBQyxnQkFBYSxXQUFVLGFBQXhCO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBQWlDO0FBQUE7QUFBQSxZQVZyQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFZQTtBQUFBLFVBR0YsdUJBQUMsU0FBSSxXQUFVLGtCQUNiO0FBQUE7QUFBQSxjQUFDO0FBQUE7QUFBQSxnQkFDQyxXQUFXLHVDQUNUcEUsTUFBTW9FLFNBQVMsVUFBVSxrQkFBa0IsZ0JBQWdCO0FBQUEsZ0JBRzVEcEUsZ0JBQU1vRSxTQUFTLFVBQVUsVUFBVTtBQUFBO0FBQUEsY0FMdEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBTUE7QUFBQSxZQUNBLHVCQUFDLFFBQUcsV0FBVSw4QkFBOEJwRSxnQkFBTW1FLFNBQWxEO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBQXdEO0FBQUEsWUFDeEQ7QUFBQSxjQUFDO0FBQUE7QUFBQSxnQkFDQyxXQUFXLDBCQUNUbkUsTUFBTW9FLFNBQVMsVUFBVSxxQkFBcUIsZ0JBQWdCO0FBQUEsZ0JBRy9EcEUsZ0JBQU1zRDtBQUFBQTtBQUFBQSxjQUxUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQU1BO0FBQUEsWUFFQ3RELE1BQU1rQyxrQkFDTCx1QkFBQyxTQUFJLFdBQVUsNkJBQ2I7QUFBQTtBQUFBLGdCQUFDO0FBQUE7QUFBQSxrQkFDQyxNQUFLO0FBQUEsa0JBQ0wsU0FBU3VDO0FBQUFBLGtCQUNULFdBQVU7QUFBQSxrQkFBb0c7QUFBQTtBQUFBLGdCQUhoSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0FNQTtBQUFBLGNBQ0E7QUFBQSxnQkFBQztBQUFBO0FBQUEsa0JBQ0MsTUFBSztBQUFBLGtCQUNMLFNBQVMsTUFBTXhFLFNBQVMsSUFBSTtBQUFBLGtCQUM1QixXQUFVO0FBQUEsa0JBQTBJO0FBQUE7QUFBQSxnQkFIdEo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBTUE7QUFBQSxpQkFkRjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQWVBO0FBQUEsZUFqQ0o7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFtQ0E7QUFBQSxVQUVBO0FBQUEsWUFBQztBQUFBO0FBQUEsY0FDQyxNQUFLO0FBQUEsY0FDTCxTQUFTLE1BQU1BLFNBQVMsSUFBSTtBQUFBLGNBQzVCLFdBQVU7QUFBQSxjQUVWLGlDQUFDLEtBQUUsV0FBVSxhQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBQXNCO0FBQUE7QUFBQSxZQUx4QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFNQTtBQUFBLGFBcEVGO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFxRUE7QUFBQTtBQUFBLE1BNUVLQztBQUFBQSxNQURQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUE4RUEsS0EvRUY7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQWdGQTtBQUFBLElBR0YsdUJBQUMsV0FBTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQVI7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQWdFRTtBQUFBLE9BdDJCSjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBdTJCQTtBQUVKO0FBQUNULEdBempDdUJILGVBQWE7QUFBQSxVQXNCL0J2QixZQUFZO0FBQUE7QUFBQW9ILE1BdEJNN0Y7QUFBYSxJQUFBRCxJQUFBOEY7QUFBQUMsYUFBQS9GLElBQUE7QUFBQStGLGFBQUFELEtBQUEiLCJuYW1lcyI6WyJSZWFjdCIsInVzZUVmZmVjdCIsInVzZVJlZiIsInVzZVN0YXRlIiwiQXJyb3dSaWdodCIsIkNoZWNrQ2lyY2xlMiIsIk1pbnVzIiwiUGFja2FnZSIsIlBsdXMiLCJTZWFyY2giLCJTaG9wcGluZ0JhZyIsIlNob3BwaW5nQ2FydCIsIlNwYXJrbGVzIiwiU3RhciIsIlRydWNrIiwiWCIsImZvcm1hdENvbXBhY3ROdW1iZXIiLCJmb3JtYXREYXRlTGFiZWwiLCJmb3JtYXRQcmljZUFSUyIsImZvcm1hdFdoYXRzQXBwTWVzc2FnZSIsIm9wZW5XaGF0c0FwcCIsInVzZUNhcnRTdG9yZSIsImJyYW5kTG9nbyIsIm1ldHJpY0NhcmRzIiwic3VtbWFyeSIsImxhYmVsIiwidmFsdWUiLCJ0b3RhbFByb2R1Y3RzIiwiZGV0YWlsIiwidG90YWxDYXRlZ29yaWVzIiwidG90YWxTdG9jayIsImxvd1N0b2NrUHJvZHVjdHMiLCJpbnZlbnRvcnlWYWx1ZSIsImZlYXR1cmVkUHJvZHVjdHMiLCJzdG9yZVNpZ25hbHMiLCJpY29uIiwicHJvZHVjdEdhbGxlcnkiLCJwcm9kdWN0IiwiaW1hZ2VzIiwibGVuZ3RoIiwiaW1hZ2UiLCJQcm9kdWN0QXJ0d29yayIsIm5hbWUiLCJfYyIsIlN0b3JlZnJvbnRBcHAiLCJpbml0aWFsRGF0YSIsImxvYWRFcnJvciIsIl9zIiwic2VhcmNoIiwic2V0U2VhcmNoIiwiYWN0aXZlQ2F0ZWdvcnkiLCJzZXRBY3RpdmVDYXRlZ29yeSIsInNlbGVjdGVkUHJvZHVjdCIsInNldFNlbGVjdGVkUHJvZHVjdCIsInRvYXN0Iiwic2V0VG9hc3QiLCJ0b2FzdEtleSIsInNldFRvYXN0S2V5IiwiY2FydFJlbmRlcmVkIiwic2V0Q2FydFJlbmRlcmVkIiwiY2FydFZpc2libGUiLCJzZXRDYXJ0VmlzaWJsZSIsImNhcnRQdWxzZSIsInNldENhcnRQdWxzZSIsImhpZ2hsaWdodGVkQ2FydEl0ZW1JZCIsInNldEhpZ2hsaWdodGVkQ2FydEl0ZW1JZCIsImNsb3NlQ2FydFRpbWVyUmVmIiwiaXRlbXMiLCJ0b3RhbCIsImFkZEl0ZW0iLCJjbGVhckNhcnQiLCJnZXRUb3RhbEl0ZW1zIiwicmVtb3ZlSXRlbSIsInVwZGF0ZVF1YW50aXR5Iiwic2hvd1RvYXN0IiwibmV4dFRvYXN0IiwiY3VycmVudCIsIm9wZW5DYXJ0Iiwid2luZG93IiwiY2xlYXJUaW1lb3V0IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2xvc2VDYXJ0Iiwic2V0VGltZW91dCIsInB1bHNlQ2FydCIsImZsYXNoQ2FydEl0ZW0iLCJwcm9kdWN0SWQiLCJ1bmRlZmluZWQiLCJ0aW1lb3V0Iiwic2hvd0NhcnRBY3Rpb24iLCJkb2N1bWVudCIsImJvZHkiLCJzdHlsZSIsIm92ZXJmbG93IiwiaGFuZGxlS2V5RG93biIsImV2ZW50Iiwia2V5IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJub3JtYWxpemVkU2VhcmNoIiwidHJpbSIsInRvTG93ZXJDYXNlIiwidmlzaWJsZUNhdGVnb3JpZXMiLCJjYXRlZ29yaWVzIiwibWFwIiwiY2F0ZWdvcnkiLCJmaWx0ZXJlZFByb2R1Y3RzIiwicHJvZHVjdHMiLCJmaWx0ZXIiLCJkZXNjcmlwdGlvbiIsIm1hdGNoZXNTZWFyY2giLCJpbmNsdWRlcyIsIm1hdGNoZXNDYXRlZ29yeSIsImZlYXR1cmVkIiwic2xpY2UiLCJoZXJvRmVhdHVyZWQiLCJ0b3RhbEl0ZW1zIiwiY3VycmVudFVwZGF0ZUxhYmVsIiwiRGF0ZSIsInRvSVNPU3RyaW5nIiwiaGFuZGxlQWRkVG9DYXJ0Iiwic3RvY2tRdWFudGl0eSIsInRpdGxlIiwidG9uZSIsImlkIiwiaGFuZGxlUXVhbnRpdHlDaGFuZ2UiLCJxdWFudGl0eSIsImhhbmRsZUNoZWNrb3V0IiwiaGFuZGxlVG9hc3RDYXJ0QWN0aW9uIiwiaXRlbSIsIkljb24iLCJwcmljZSIsInRhcmdldCIsImFjdGl2ZSIsImF2YWlsYWJsZSIsImluZGV4Iiwic3RvcFByb3BhZ2F0aW9uIiwiaGlnaGxpZ2h0ZWQiLCJfYzIiLCIkUmVmcmVzaFJlZyQiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsiU3RvcmVmcm9udEFwcC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEFycm93UmlnaHQsXG4gIENoZWNrQ2lyY2xlMixcbiAgTWludXMsXG4gIFBhY2thZ2UsXG4gIFBsdXMsXG4gIFNlYXJjaCxcbiAgU2hvcHBpbmdCYWcsXG4gIFNob3BwaW5nQ2FydCxcbiAgU3BhcmtsZXMsXG4gIFN0YXIsXG4gIFRydWNrLFxuICBYXG59IGZyb20gJ2x1Y2lkZS1yZWFjdCc7XG5pbXBvcnQgdHlwZSB7IFByb2R1Y3QsIFN0b3JlZnJvbnRCb290c3RyYXAgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQge1xuICBmb3JtYXRDb21wYWN0TnVtYmVyLFxuICBmb3JtYXREYXRlTGFiZWwsXG4gIGZvcm1hdFByaWNlQVJTXG59IGZyb20gJy4uL2xpYi9mb3JtYXR0ZXJzJztcbmltcG9ydCB7IGZvcm1hdFdoYXRzQXBwTWVzc2FnZSwgb3BlbldoYXRzQXBwIH0gZnJvbSAnLi4vbGliL3doYXRzYXBwJztcbmltcG9ydCB7IHVzZUNhcnRTdG9yZSB9IGZyb20gJy4uL3N0b3Jlcy9jYXJ0U3RvcmUnO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBpbml0aWFsRGF0YTogU3RvcmVmcm9udEJvb3RzdHJhcDtcbiAgbG9hZEVycm9yPzogc3RyaW5nIHwgbnVsbDtcbn1cblxuaW50ZXJmYWNlIFRvYXN0U3RhdGUge1xuICB0aXRsZTogc3RyaW5nO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICBpbWFnZT86IHN0cmluZztcbiAgdG9uZTogJ2RlZmF1bHQnIHwgJ2Vycm9yJztcbiAgcHJvZHVjdElkPzogbnVtYmVyO1xuICBzaG93Q2FydEFjdGlvbj86IGJvb2xlYW47XG59XG5cbmNvbnN0IGJyYW5kTG9nbyA9ICcvcGFzb3NzYWx1ZGFibGVzc3RvY2stbG9nby5qcGVnJztcblxuY29uc3QgbWV0cmljQ2FyZHMgPSAoc3VtbWFyeTogU3RvcmVmcm9udEJvb3RzdHJhcFsnc3VtbWFyeSddKSA9PiBbXG4gIHtcbiAgICBsYWJlbDogJ1Byb2R1Y3RvcyBhY3Rpdm9zJyxcbiAgICB2YWx1ZTogZm9ybWF0Q29tcGFjdE51bWJlcihzdW1tYXJ5LnRvdGFsUHJvZHVjdHMpLFxuICAgIGRldGFpbDogYCR7c3VtbWFyeS50b3RhbENhdGVnb3JpZXN9IGNhdGVnb3JpYXNgXG4gIH0sXG4gIHtcbiAgICBsYWJlbDogJ1VuaWRhZGVzIGVuIHN0b2NrJyxcbiAgICB2YWx1ZTogZm9ybWF0Q29tcGFjdE51bWJlcihzdW1tYXJ5LnRvdGFsU3RvY2spLFxuICAgIGRldGFpbDogYCR7c3VtbWFyeS5sb3dTdG9ja1Byb2R1Y3RzfSBjb24gc3RvY2sgYmFqb2BcbiAgfSxcbiAge1xuICAgIGxhYmVsOiAnSW52ZW50YXJpbyB2YWxvcml6YWRvJyxcbiAgICB2YWx1ZTogZm9ybWF0UHJpY2VBUlMoc3VtbWFyeS5pbnZlbnRvcnlWYWx1ZSksXG4gICAgZGV0YWlsOiBgJHtzdW1tYXJ5LmZlYXR1cmVkUHJvZHVjdHN9IGRlc3RhY2Fkb3NgXG4gIH1cbl07XG5cbmNvbnN0IHN0b3JlU2lnbmFscyA9IFtcbiAge1xuICAgIGxhYmVsOiAnU3RvY2sgcmVhbCB5IHZpc2libGUnLFxuICAgIGRldGFpbDogJ0xhIHRpZW5kYSBubyBpbnZlbnRhIGRpc3BvbmliaWxpZGFkLiBMZWUgbGEgbWlzbWEgYmFzZSBkZWwgc3RvY2suJyxcbiAgICBpY29uOiBDaGVja0NpcmNsZTJcbiAgfSxcbiAge1xuICAgIGxhYmVsOiAnQ2Fycml0byBjb24gbW92aW1pZW50bycsXG4gICAgZGV0YWlsOiAnRWwgZHJhd2VyIGVudHJhIHN1YXZlLCBlbCBiYWRnZSByZWJvdGEgeSBsb3MgaXRlbXMgc2UgcmVtYXJjYW4gYWwgY2FtYmlhci4nLFxuICAgIGljb246IFNob3BwaW5nQ2FydFxuICB9LFxuICB7XG4gICAgbGFiZWw6ICdQZWRpZG8gbGlzdG8gcGFyYSBjZXJyYXInLFxuICAgIGRldGFpbDogJ0VsIGNsaWVudGUgZWxpZ2UsIHN1bWEgeSB0ZXJtaW5hIGVsIHBlZGlkbyBwb3IgV2hhdHNBcHAgc2luIHBhc29zIHJhcm9zLicsXG4gICAgaWNvbjogVHJ1Y2tcbiAgfVxuXTtcblxuZnVuY3Rpb24gcHJvZHVjdEdhbGxlcnkocHJvZHVjdDogUHJvZHVjdCkge1xuICBpZiAocHJvZHVjdC5pbWFnZXMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBwcm9kdWN0LmltYWdlcztcbiAgfVxuXG4gIHJldHVybiBwcm9kdWN0LmltYWdlID8gW3Byb2R1Y3QuaW1hZ2VdIDogW107XG59XG5cbmZ1bmN0aW9uIFByb2R1Y3RBcnR3b3JrKHsgcHJvZHVjdCB9OiB7IHByb2R1Y3Q6IFByb2R1Y3QgfSkge1xuICBpZiAocHJvZHVjdC5pbWFnZSkge1xuICAgIHJldHVybiAoXG4gICAgICA8aW1nXG4gICAgICAgIHNyYz17cHJvZHVjdC5pbWFnZX1cbiAgICAgICAgYWx0PXtwcm9kdWN0Lm5hbWV9XG4gICAgICAgIGNsYXNzTmFtZT1cImgtZnVsbCB3LWZ1bGwgb2JqZWN0LWNvdmVyXCJcbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtZnVsbCB3LWZ1bGwgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGJnLVtyYWRpYWwtZ3JhZGllbnQoY2lyY2xlX2F0X3RvcCxfcmdiYSgxNDEsMTk4LDYzLDAuMjQpLF90cmFuc3BhcmVudF81MiUpLGxpbmVhci1ncmFkaWVudCgxMzVkZWcsXyMxNzNiMmRfMCUsXyMxZjI5MzdfNTIlLF8jMzM1ZTIyXzEwMCUpXVwiPlxuICAgICAgPFBhY2thZ2UgY2xhc3NOYW1lPVwiaC0xNCB3LTE0IHRleHQtZW1lcmFsZC0xMDBcIiAvPlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTdG9yZWZyb250QXBwKHsgaW5pdGlhbERhdGEsIGxvYWRFcnJvciA9IG51bGwgfTogUHJvcHMpIHtcbiAgY29uc3QgW3NlYXJjaCwgc2V0U2VhcmNoXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW2FjdGl2ZUNhdGVnb3J5LCBzZXRBY3RpdmVDYXRlZ29yeV0gPSB1c2VTdGF0ZSgnVG9kb3MnKTtcbiAgY29uc3QgW3NlbGVjdGVkUHJvZHVjdCwgc2V0U2VsZWN0ZWRQcm9kdWN0XSA9IHVzZVN0YXRlPFByb2R1Y3QgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW3RvYXN0LCBzZXRUb2FzdF0gPSB1c2VTdGF0ZTxUb2FzdFN0YXRlIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFt0b2FzdEtleSwgc2V0VG9hc3RLZXldID0gdXNlU3RhdGUoMCk7XG4gIGNvbnN0IFtjYXJ0UmVuZGVyZWQsIHNldENhcnRSZW5kZXJlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtjYXJ0VmlzaWJsZSwgc2V0Q2FydFZpc2libGVdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbY2FydFB1bHNlLCBzZXRDYXJ0UHVsc2VdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaGlnaGxpZ2h0ZWRDYXJ0SXRlbUlkLCBzZXRIaWdobGlnaHRlZENhcnRJdGVtSWRdID0gdXNlU3RhdGU8bnVtYmVyIHwgbnVsbD4oXG4gICAgbnVsbFxuICApO1xuICBjb25zdCBjbG9zZUNhcnRUaW1lclJlZiA9IHVzZVJlZjxudW1iZXIgfCBudWxsPihudWxsKTtcblxuICBjb25zdCB7XG4gICAgaXRlbXMsXG4gICAgdG90YWwsXG4gICAgYWRkSXRlbSxcbiAgICBjbGVhckNhcnQsXG4gICAgZ2V0VG90YWxJdGVtcyxcbiAgICByZW1vdmVJdGVtLFxuICAgIHVwZGF0ZVF1YW50aXR5XG4gIH0gPSB1c2VDYXJ0U3RvcmUoKTtcblxuICBjb25zdCBzaG93VG9hc3QgPSAobmV4dFRvYXN0OiBUb2FzdFN0YXRlKSA9PiB7XG4gICAgc2V0VG9hc3RLZXkoKGN1cnJlbnQpID0+IGN1cnJlbnQgKyAxKTtcbiAgICBzZXRUb2FzdChuZXh0VG9hc3QpO1xuICB9O1xuXG4gIGNvbnN0IG9wZW5DYXJ0ID0gKCkgPT4ge1xuICAgIGlmIChjbG9zZUNhcnRUaW1lclJlZi5jdXJyZW50KSB7XG4gICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KGNsb3NlQ2FydFRpbWVyUmVmLmN1cnJlbnQpO1xuICAgICAgY2xvc2VDYXJ0VGltZXJSZWYuY3VycmVudCA9IG51bGw7XG4gICAgfVxuXG4gICAgc2V0Q2FydFJlbmRlcmVkKHRydWUpO1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gc2V0Q2FydFZpc2libGUodHJ1ZSkpO1xuICB9O1xuXG4gIGNvbnN0IGNsb3NlQ2FydCA9ICgpID0+IHtcbiAgICBzZXRDYXJ0VmlzaWJsZShmYWxzZSk7XG5cbiAgICBpZiAoY2xvc2VDYXJ0VGltZXJSZWYuY3VycmVudCkge1xuICAgICAgd2luZG93LmNsZWFyVGltZW91dChjbG9zZUNhcnRUaW1lclJlZi5jdXJyZW50KTtcbiAgICB9XG5cbiAgICBjbG9zZUNhcnRUaW1lclJlZi5jdXJyZW50ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgc2V0Q2FydFJlbmRlcmVkKGZhbHNlKTtcbiAgICAgIGNsb3NlQ2FydFRpbWVyUmVmLmN1cnJlbnQgPSBudWxsO1xuICAgIH0sIDI4MCk7XG4gIH07XG5cbiAgY29uc3QgcHVsc2VDYXJ0ID0gKCkgPT4ge1xuICAgIHNldENhcnRQdWxzZShmYWxzZSk7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBzZXRDYXJ0UHVsc2UodHJ1ZSkpO1xuICB9O1xuXG4gIGNvbnN0IGZsYXNoQ2FydEl0ZW0gPSAocHJvZHVjdElkOiBudW1iZXIpID0+IHtcbiAgICBzZXRIaWdobGlnaHRlZENhcnRJdGVtSWQobnVsbCk7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBzZXRIaWdobGlnaHRlZENhcnRJdGVtSWQocHJvZHVjdElkKSk7XG4gIH07XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKGNsb3NlQ2FydFRpbWVyUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChjbG9zZUNhcnRUaW1lclJlZi5jdXJyZW50KTtcbiAgICAgIH1cbiAgICB9O1xuICB9LCBbXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXRvYXN0KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IHRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChcbiAgICAgICgpID0+IHNldFRvYXN0KG51bGwpLFxuICAgICAgdG9hc3Quc2hvd0NhcnRBY3Rpb24gPyAzNDAwIDogMjQwMFxuICAgICk7XG5cbiAgICByZXR1cm4gKCkgPT4gd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgfSwgW3RvYXN0XSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWNhcnRQdWxzZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCB0aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4gc2V0Q2FydFB1bHNlKGZhbHNlKSwgNDIwKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgfSwgW2NhcnRQdWxzZV0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFoaWdobGlnaHRlZENhcnRJdGVtSWQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgdGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHNldEhpZ2hsaWdodGVkQ2FydEl0ZW1JZChudWxsKSwgODUwKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgfSwgW2hpZ2hsaWdodGVkQ2FydEl0ZW1JZF0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IGNhcnRSZW5kZXJlZCA/ICdoaWRkZW4nIDogJyc7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICcnO1xuICAgIH07XG4gIH0sIFtjYXJ0UmVuZGVyZWRdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghY2FydFJlbmRlcmVkKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IGhhbmRsZUtleURvd24gPSAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgIGNsb3NlQ2FydCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleURvd24pO1xuICB9LCBbY2FydFJlbmRlcmVkXSk7XG5cbiAgY29uc3Qgbm9ybWFsaXplZFNlYXJjaCA9IHNlYXJjaC50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgdmlzaWJsZUNhdGVnb3JpZXMgPSBbXG4gICAgJ1RvZG9zJyxcbiAgICAuLi5pbml0aWFsRGF0YS5jYXRlZ29yaWVzLm1hcCgoY2F0ZWdvcnkpID0+IGNhdGVnb3J5Lm5hbWUpXG4gIF07XG5cbiAgY29uc3QgZmlsdGVyZWRQcm9kdWN0cyA9IGluaXRpYWxEYXRhLnByb2R1Y3RzLmZpbHRlcigocHJvZHVjdCkgPT4ge1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gcHJvZHVjdC5kZXNjcmlwdGlvbiB8fCAnJztcbiAgICBjb25zdCBjYXRlZ29yeSA9IHByb2R1Y3QuY2F0ZWdvcnkgfHwgJyc7XG5cbiAgICBjb25zdCBtYXRjaGVzU2VhcmNoID1cbiAgICAgICFub3JtYWxpemVkU2VhcmNoIHx8XG4gICAgICBwcm9kdWN0Lm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhub3JtYWxpemVkU2VhcmNoKSB8fFxuICAgICAgZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhub3JtYWxpemVkU2VhcmNoKSB8fFxuICAgICAgY2F0ZWdvcnkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhub3JtYWxpemVkU2VhcmNoKTtcblxuICAgIGNvbnN0IG1hdGNoZXNDYXRlZ29yeSA9XG4gICAgICBhY3RpdmVDYXRlZ29yeSA9PT0gJ1RvZG9zJyB8fCBwcm9kdWN0LmNhdGVnb3J5ID09PSBhY3RpdmVDYXRlZ29yeTtcblxuICAgIHJldHVybiBtYXRjaGVzU2VhcmNoICYmIG1hdGNoZXNDYXRlZ29yeTtcbiAgfSk7XG5cbiAgY29uc3QgZmVhdHVyZWQgPSBpbml0aWFsRGF0YS5mZWF0dXJlZFByb2R1Y3RzLmxlbmd0aFxuICAgID8gaW5pdGlhbERhdGEuZmVhdHVyZWRQcm9kdWN0c1xuICAgIDogaW5pdGlhbERhdGEucHJvZHVjdHMuc2xpY2UoMCwgNCk7XG4gIGNvbnN0IGhlcm9GZWF0dXJlZCA9IGZlYXR1cmVkWzBdID8/IG51bGw7XG4gIGNvbnN0IHRvdGFsSXRlbXMgPSBnZXRUb3RhbEl0ZW1zKCk7XG4gIGNvbnN0IGN1cnJlbnRVcGRhdGVMYWJlbCA9IGZvcm1hdERhdGVMYWJlbChuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkpO1xuXG4gIGNvbnN0IGhhbmRsZUFkZFRvQ2FydCA9IChwcm9kdWN0OiBQcm9kdWN0KSA9PiB7XG4gICAgaWYgKHByb2R1Y3Quc3RvY2tRdWFudGl0eSA8PSAwKSB7XG4gICAgICBzaG93VG9hc3Qoe1xuICAgICAgICB0aXRsZTogJ1NpbiBzdG9jayBkaXNwb25pYmxlJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdFc2UgcHJvZHVjdG8gbm8gdGllbmUgdW5pZGFkZXMgcGFyYSB2ZW5kZXIgYWhvcmEuJyxcbiAgICAgICAgdG9uZTogJ2Vycm9yJ1xuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYWRkSXRlbShwcm9kdWN0LCAxKTtcbiAgICBwdWxzZUNhcnQoKTtcbiAgICBmbGFzaENhcnRJdGVtKHByb2R1Y3QuaWQpO1xuXG4gICAgc2hvd1RvYXN0KHtcbiAgICAgIHRpdGxlOiAnU2UgYWdyZWdvIGFsIGNhcnJpdG8nLFxuICAgICAgZGVzY3JpcHRpb246IGAke3Byb2R1Y3QubmFtZX0geWEgcXVlZG8gbGlzdG8gcGFyYSBjZXJyYXIgcG9yIFdoYXRzQXBwIGN1YW5kbyBxdWllcmFzLmAsXG4gICAgICBpbWFnZTogcHJvZHVjdEdhbGxlcnkocHJvZHVjdClbMF0gPz8gYnJhbmRMb2dvLFxuICAgICAgdG9uZTogJ2RlZmF1bHQnLFxuICAgICAgcHJvZHVjdElkOiBwcm9kdWN0LmlkLFxuICAgICAgc2hvd0NhcnRBY3Rpb246IHRydWVcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVRdWFudGl0eUNoYW5nZSA9IChwcm9kdWN0SWQ6IG51bWJlciwgcXVhbnRpdHk6IG51bWJlcikgPT4ge1xuICAgIHVwZGF0ZVF1YW50aXR5KHByb2R1Y3RJZCwgcXVhbnRpdHkpO1xuXG4gICAgaWYgKHF1YW50aXR5ID4gMCkge1xuICAgICAgZmxhc2hDYXJ0SXRlbShwcm9kdWN0SWQpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVDaGVja291dCA9ICgpID0+IHtcbiAgICBpZiAoaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBzaG93VG9hc3Qoe1xuICAgICAgICB0aXRsZTogJ0VsIGNhcnJpdG8gZXN0YSB2YWNpbycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQWdyZWdhIHByb2R1Y3RvcyBhbnRlcyBkZSBtYW5kYXIgZWwgcGVkaWRvLicsXG4gICAgICAgIHRvbmU6ICdlcnJvcidcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9wZW5XaGF0c0FwcChmb3JtYXRXaGF0c0FwcE1lc3NhZ2UoaXRlbXMsIHRvdGFsKSk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlVG9hc3RDYXJ0QWN0aW9uID0gKCkgPT4ge1xuICAgIGlmICh0b2FzdD8ucHJvZHVjdElkKSB7XG4gICAgICBmbGFzaENhcnRJdGVtKHRvYXN0LnByb2R1Y3RJZCk7XG4gICAgfVxuXG4gICAgb3BlbkNhcnQoKTtcbiAgICBzZXRUb2FzdChudWxsKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgbWluLWgtc2NyZWVuIG92ZXJmbG93LXgtaGlkZGVuIGJnLVsjZjhmNGVhXSB0ZXh0LXNsYXRlLTk1MFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIC16LTEwIGJnLVtyYWRpYWwtZ3JhZGllbnQoY2lyY2xlX2F0X3RvcF9sZWZ0LF9yZ2JhKDE0MSwxOTgsNjMsMC4xNiksX3RyYW5zcGFyZW50XzI4JSkscmFkaWFsLWdyYWRpZW50KGNpcmNsZV9hdF84NSVfMTQlLF9yZ2JhKDE2LDE4NSwxMjksMC4xNCksX3RyYW5zcGFyZW50XzI2JSksbGluZWFyLWdyYWRpZW50KDE4MGRlZyxfI2Y4ZjRlYV8wJSxfI2ZiZmJmN181NSUsXyNlZWY1ZGNfMTAwJSldXCIgLz5cblxuICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJzdGlja3kgdG9wLTAgei0zMCBib3JkZXItYiBib3JkZXItWyNkOGRlYzVdIGJnLVsjZjhmNGVhXS85MCBiYWNrZHJvcC1ibHVyLXhsXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXgtYXV0byBmbGV4IG1heC13LTd4bCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGdhcC00IHB4LTQgcHktNCBzbTpweC02IGxnOnB4LThcIj5cbiAgICAgICAgICA8YVxuICAgICAgICAgICAgaHJlZj1cIi9cIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgcm91bmRlZC1mdWxsIGJvcmRlciBib3JkZXItd2hpdGUvNzUgYmctd2hpdGUvODAgcHgtMiBweS0yIHNoYWRvdy1bMF8xOHB4XzUwcHhfcmdiYSgxNSwyMyw0MiwwLjA4KV0gYmFja2Ryb3AtYmx1clwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvdmVyZmxvdy1oaWRkZW4gcm91bmRlZC1bMjBweF0gYmctWyM4ZGM2M2ZdIHAtMS41IHNoYWRvdy1pbm5lclwiPlxuICAgICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgICAgc3JjPXticmFuZExvZ299XG4gICAgICAgICAgICAgICAgYWx0PVwiTG9nbyBQYXNvcyBTYWx1ZGFibGVzIFN0b2NrXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJoLTEyIHctMTIgcm91bmRlZC1bMTZweF0gb2JqZWN0LWNvdmVyXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwci0zXCI+XG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImZvbnQtc2VtaWJvbGQgdHJhY2tpbmctdGlnaHQgdGV4dC1zbGF0ZS05NTBcIj5cbiAgICAgICAgICAgICAgICBQYXNvcyBTYWx1ZGFibGVzXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMjRlbV0gdGV4dC1bIzZmOGYyZl1cIj5cbiAgICAgICAgICAgICAgICB0aWVuZGEgKyBzdG9jayByZWFsXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvYT5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgIGhyZWY9XCIvYWRtaW5cIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJoaWRkZW4gcm91bmRlZC1mdWxsIGJvcmRlciBib3JkZXItWyNjYWQ0YjJdIHB4LTQgcHktMiB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtc2xhdGUtNzAwIHRyYW5zaXRpb24gaG92ZXI6Ym9yZGVyLVsjOGRjNjNmXSBob3Zlcjp0ZXh0LVsjMTczYjJkXSBtZDppbmxpbmUtZmxleFwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIERhc2hib2FyZFxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgb25DbGljaz17b3BlbkNhcnR9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YGlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiByb3VuZGVkLWZ1bGwgYmctWyMxNzNiMmRdIHB4LTQgcHktMi41IHRleHQtc20gZm9udC1zZW1pYm9sZCB0ZXh0LXdoaXRlIHNoYWRvdy1bMF8xOHB4XzQycHhfcmdiYSgyMyw1OSw0NSwwLjI0KV0gdHJhbnNpdGlvbiBkdXJhdGlvbi0zMDAgaG92ZXI6LXRyYW5zbGF0ZS15LTAuNSBob3ZlcjpiZy1bIzIxNTAzY10gJHtcbiAgICAgICAgICAgICAgICBjYXJ0UHVsc2UgPyAncHNzLWJhZGdlLWJ1bXAnIDogJydcbiAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxTaG9wcGluZ0NhcnQgY2xhc3NOYW1lPVwiaC00IHctNFwiIC8+XG4gICAgICAgICAgICAgIDxzcGFuPkNhcnJpdG88L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcm91bmRlZC1mdWxsIHB4LTIgcHktMC41IHRleHQteHMgZm9udC1zZW1pYm9sZCAke1xuICAgICAgICAgICAgICAgICAgY2FydFB1bHNlXG4gICAgICAgICAgICAgICAgICAgID8gJ2JnLVsjOGRjNjNmXSB0ZXh0LVsjMTczYjJkXSdcbiAgICAgICAgICAgICAgICAgICAgOiAnYmctd2hpdGUvMTIgdGV4dC13aGl0ZSdcbiAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHt0b3RhbEl0ZW1zfVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2hlYWRlcj5cblxuICAgICAgPG1haW4+XG4gICAgICAgIHtsb2FkRXJyb3IgJiYgKFxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cIm14LWF1dG8gbWF4LXctN3hsIHB4LTQgcHQtNiBzbTpweC02IGxnOnB4LThcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC1bMjhweF0gYm9yZGVyIGJvcmRlci1hbWJlci0yMDAgYmctYW1iZXItNTAgcHgtNSBweS00IHRleHQtYW1iZXItOTUwIHNoYWRvdy1bMF8xOHB4XzQwcHhfcmdiYSgxMjAsNTMsMTUsMC4wOCldXCI+XG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1zZW1pYm9sZCB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMmVtXSB0ZXh0LWFtYmVyLTcwMFwiPlxuICAgICAgICAgICAgICAgIERhdG9zIG5vIGRpc3BvbmlibGVzXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibXQtMiB0ZXh0LXNtIGxlYWRpbmctNlwiPlxuICAgICAgICAgICAgICAgIExhIHRpZW5kYSBjYXJnbywgcGVybyBubyBzZSBwdWRvIGxlZXIgbGEgYmFzZSBkZSBkYXRvcyBlbiBlc3RlXG4gICAgICAgICAgICAgICAgbW9tZW50by4gU2UgbXVlc3RyYSBsYSBpbnRlcmZheiBzaW4gcHJvZHVjdG9zIHBhcmEgZXZpdGFyIGxhXG4gICAgICAgICAgICAgICAgcGFudGFsbGEgYmxhbmNhLlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICl9XG5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwibXgtYXV0byBncmlkIG1heC13LTd4bCBnYXAtMTAgcHgtNCBweS0xMiBzbTpweC02IGxnOmdyaWQtY29scy1bMS4wOGZyXzAuOTJmcl0gbGc6cHgtOCBsZzpweS0yMFwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpbmxpbmUtZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgcm91bmRlZC1mdWxsIGJvcmRlciBib3JkZXItWyNiOGQ4N2JdIGJnLVsjZWRmN2Q3XSBweC00IHB5LTIgdGV4dC14cyBmb250LXNlbWlib2xkIHVwcGVyY2FzZSB0cmFja2luZy1bMC4yNGVtXSB0ZXh0LVsjMzY1MjIxXVwiPlxuICAgICAgICAgICAgICA8U3BhcmtsZXMgY2xhc3NOYW1lPVwiaC00IHctNFwiIC8+XG4gICAgICAgICAgICAgIGVjb21tZXJjZSBudWV2byBzb2JyZSBsYSBiYXNlIHJlYWxcbiAgICAgICAgICAgIDwvc3Bhbj5cblxuICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cIm10LTYgbWF4LXctNHhsIGZvbnQtc2VyaWYgdGV4dC01eGwgbGVhZGluZy1bMC45OF0gdHJhY2tpbmctdGlnaHQgdGV4dC1zbGF0ZS05NTAgbWQ6dGV4dC03eGxcIj5cbiAgICAgICAgICAgICAgUGFzb3MgU2FsdWRhYmxlcyBhaG9yYSB0aWVuZSB1bmEgdGllbmRhIG1hcyBuYXR1cmFsLCBtYXMgY2xhcmEgeVxuICAgICAgICAgICAgICBsaXN0YSBwYXJhIHZlbmRlci5cbiAgICAgICAgICAgIDwvaDE+XG5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm10LTYgbWF4LXctMnhsIHRleHQtbGcgbGVhZGluZy04IHRleHQtc2xhdGUtNzAwXCI+XG4gICAgICAgICAgICAgIEVsIGxvZ28gcmVhbCBkZWwgc3RvY2sgeWEgZm9ybWEgcGFydGUgZGUgbGEgbWFyY2EsIGVsIGNhdGFsb2dvXG4gICAgICAgICAgICAgIHJlc3BpcmEgbWVqb3IgeSBlbCBjbGllbnRlIHJlY2liZSBmZWVkYmFjayBpbm1lZGlhdG8gY3VhbmRvIHN1bWFcbiAgICAgICAgICAgICAgcHJvZHVjdG9zIGFsIGNhcnJpdG8uXG4gICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtOCBmbGV4IGZsZXgtY29sIGdhcC00IHNtOmZsZXgtcm93XCI+XG4gICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgaHJlZj1cIiNjYXRhbG9nb1wiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0yIHJvdW5kZWQtZnVsbCBiZy1bIzE3M2IyZF0gcHgtNiBweS0zIGZvbnQtc2VtaWJvbGQgdGV4dC13aGl0ZSB0cmFuc2l0aW9uIGhvdmVyOmJnLVsjMjE1MDNjXVwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICBFeHBsb3JhciBjYXRhbG9nb1xuICAgICAgICAgICAgICAgIDxBcnJvd1JpZ2h0IGNsYXNzTmFtZT1cImgtNCB3LTRcIiAvPlxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtvcGVuQ2FydH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpbmxpbmUtZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTIgcm91bmRlZC1mdWxsIGJvcmRlciBib3JkZXItWyNjYWQ0YjJdIHB4LTYgcHktMyBmb250LXNlbWlib2xkIHRleHQtc2xhdGUtNzAwIHRyYW5zaXRpb24gaG92ZXI6Ym9yZGVyLVsjOGRjNjNmXSBob3Zlcjp0ZXh0LVsjMTczYjJkXVwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICBWZXIgY2Fycml0b1xuICAgICAgICAgICAgICAgIDxTaG9wcGluZ0JhZyBjbGFzc05hbWU9XCJoLTQgdy00XCIgLz5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC04IGZsZXggZmxleC1jb2wgZ2FwLTMgdGV4dC1zbSB0ZXh0LXNsYXRlLTYwMCBzbTpmbGV4LXJvdyBzbTppdGVtcy1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmxpbmUtZmxleCB3LWZpdCBpdGVtcy1jZW50ZXIgZ2FwLTMgcm91bmRlZC1mdWxsIGJvcmRlciBib3JkZXItd2hpdGUvODAgYmctd2hpdGUvODAgcHgtMyBweS0yIHNoYWRvdy1bMF8xMnB4XzMwcHhfcmdiYSgxNSwyMyw0MiwwLjA2KV1cIj5cbiAgICAgICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgICAgICBzcmM9e2JyYW5kTG9nb31cbiAgICAgICAgICAgICAgICAgIGFsdD1cIkxvZ28gUGFzb3MgU2FsdWRhYmxlcyBTdG9ja1wiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJoLTEwIHctMTAgcm91bmRlZC1mdWxsIG9iamVjdC1jb3ZlclwiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8c3Bhbj5NYXJjYSBvcmlnaW5hbCBpbnRlZ3JhZGEgZW4gdG9kYSBsYSBwb3J0YWRhPC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPHA+Q2F0YWxvZ28gYWN0dWFsaXphZG8ge2N1cnJlbnRVcGRhdGVMYWJlbH0gY29uIHN0b2NrIHZpc2libGUuPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMTAgZ3JpZCBnYXAtNCBzbTpncmlkLWNvbHMtM1wiPlxuICAgICAgICAgICAgICB7bWV0cmljQ2FyZHMoaW5pdGlhbERhdGEuc3VtbWFyeSkubWFwKChpdGVtKSA9PiAoXG4gICAgICAgICAgICAgICAgPGFydGljbGVcbiAgICAgICAgICAgICAgICAgIGtleT17aXRlbS5sYWJlbH1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJvdW5kZWQtWzI4cHhdIGJvcmRlciBib3JkZXItd2hpdGUvNzUgYmctd2hpdGUvODIgcC01IHNoYWRvdy1bMF8yMHB4XzYwcHhfcmdiYSgxNSwyMyw0MiwwLjA3KV0gYmFja2Ryb3AtYmx1clwiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LXNsYXRlLTUwMFwiPntpdGVtLmxhYmVsfTwvcD5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm10LTIgdGV4dC0yeGwgZm9udC1zZW1pYm9sZCB0ZXh0LXNsYXRlLTk1MFwiPlxuICAgICAgICAgICAgICAgICAgICB7aXRlbS52YWx1ZX1cbiAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm10LTIgdGV4dC1zbSB0ZXh0LVsjNmY4ZjJmXVwiPntpdGVtLmRldGFpbH08L3A+XG4gICAgICAgICAgICAgICAgPC9hcnRpY2xlPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSAtbGVmdC02IHRvcC0xMCBoLTI4IHctMjggcm91bmRlZC1mdWxsIGJnLVsjOGRjNjNmXS8yNSBibHVyLTN4bFwiIC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIC1yaWdodC00IGJvdHRvbS04IGgtMzYgdy0zNiByb3VuZGVkLWZ1bGwgYmctZW1lcmFsZC0zMDAvMjUgYmx1ci0zeGxcIiAvPlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIG92ZXJmbG93LWhpZGRlbiByb3VuZGVkLVszNnB4XSBib3JkZXIgYm9yZGVyLVsjMzQ1MzQwXSBiZy1bIzE3M2IyZF0gcC02IHRleHQtd2hpdGUgc2hhZG93LVswXzM0cHhfMTAwcHhfcmdiYSgyMyw1OSw0NSwwLjMpXVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgYmctW3JhZGlhbC1ncmFkaWVudChjaXJjbGVfYXRfdG9wLF9yZ2JhKDI1NSwyNTUsMjU1LDAuMTYpLF90cmFuc3BhcmVudF8zNiUpLGxpbmVhci1ncmFkaWVudCgxNjBkZWcsX3JnYmEoMTQxLDE5OCw2MywwLjE4KV8wJSxfcmdiYSgyMyw1OSw0NSwwKV81NCUpXVwiIC8+XG5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC1bMzBweF0gYm9yZGVyIGJvcmRlci13aGl0ZS8xMiBiZy13aGl0ZS84IHAtNCBiYWNrZHJvcC1ibHVyXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ2FwLTQgc206ZmxleC1yb3cgc206aXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1maXQgcm91bmRlZC1bMjhweF0gYmctd2hpdGUgcC0yIHNoYWRvdy1bMF8yMHB4XzUwcHhfcmdiYSgxNSwyMyw0MiwwLjIpXVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYz17YnJhbmRMb2dvfVxuICAgICAgICAgICAgICAgICAgICAgICAgYWx0PVwiTG9nbyBQYXNvcyBTYWx1ZGFibGVzIFN0b2NrXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInBzcy1sb2dvLWZsb2F0IGgtMjQgdy0yNCByb3VuZGVkLVsyMnB4XSBvYmplY3QtY292ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLVswLjI0ZW1dIHRleHQtWyNkYWYzYWZdXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBpZGVudGlkYWQgb3JpZ2luYWxcbiAgICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cIm10LTIgdGV4dC0yeGwgZm9udC1zZW1pYm9sZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgTGEgdGllbmRhIHlhIG5vIHBhcmVjZSBnZW7DqXJpY2EuXG4gICAgICAgICAgICAgICAgICAgICAgPC9oMj5cbiAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJtdC0zIG1heC13LW1kIHRleHQtc20gbGVhZGluZy02IHRleHQtd2hpdGUvNzZcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIEVsIHZlcmRlIHkgZWwgbG9nbyBkZWwgc3RvY2sgYWhvcmEgY29udml2ZW4gY29uIHVuYVxuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJmYXogbnVldmEsIG1hcyBodW1hbmEgeSBtZW5vcyByaWdpZGEuXG4gICAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC01IGdyaWQgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICAgIHtzdG9yZVNpZ25hbHMubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IEljb24gPSBpdGVtLmljb247XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2l0ZW0ubGFiZWx9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLXN0YXJ0IGdhcC0zIHJvdW5kZWQtWzI0cHhdIGJvcmRlciBib3JkZXItd2hpdGUvMTAgYmctd2hpdGUvOCBwLTRcIlxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC1mdWxsIGJnLXdoaXRlLzEyIHAtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8SWNvbiBjbGFzc05hbWU9XCJoLTUgdy01IHRleHQtWyNkOWYzYWZdXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZm9udC1zZW1pYm9sZCB0ZXh0LXdoaXRlXCI+e2l0ZW0ubGFiZWx9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJtdC0xIHRleHQtc20gbGVhZGluZy02IHRleHQtd2hpdGUvNzBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aXRlbS5kZXRhaWx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICB7aGVyb0ZlYXR1cmVkICYmIChcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNSByb3VuZGVkLVszMHB4XSBiZy13aGl0ZSBwLTUgdGV4dC1zbGF0ZS05NTBcIj5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMjJlbV0gdGV4dC1bIzZmOGYyZl1cIj5cbiAgICAgICAgICAgICAgICAgICAgICBwYXJhIG1vdmVyIHZlbnRhcyBob3lcbiAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtMjAgdy0yMCBvdmVyZmxvdy1oaWRkZW4gcm91bmRlZC1bMjJweF0gYmctc2xhdGUtMTAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8UHJvZHVjdEFydHdvcmsgcHJvZHVjdD17aGVyb0ZlYXR1cmVkfSAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLXctMCBmbGV4LTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0cnVuY2F0ZSB0ZXh0LWxnIGZvbnQtc2VtaWJvbGQgdGV4dC1zbGF0ZS05NTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge2hlcm9GZWF0dXJlZC5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm10LTEgdGV4dC1zbSB0ZXh0LXNsYXRlLTUwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7aGVyb0ZlYXR1cmVkLmNhdGVnb3J5fVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0zIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtc2VtaWJvbGQgdGV4dC1zbGF0ZS05NTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0UHJpY2VBUlMoaGVyb0ZlYXR1cmVkLnByaWNlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlQWRkVG9DYXJ0KGhlcm9GZWF0dXJlZCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHJvdW5kZWQtZnVsbCBiZy1bIzE3M2IyZF0gcHgtNCBweS0yIHRleHQtc20gZm9udC1zZW1pYm9sZCB0ZXh0LXdoaXRlIHRyYW5zaXRpb24gaG92ZXI6YmctWyMyMTUwM2NdXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxQbHVzIGNsYXNzTmFtZT1cImgtNCB3LTRcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN1bWFyIGFob3JhXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cIm14LWF1dG8gbWF4LXctN3hsIHB4LTQgcHktNiBzbTpweC02IGxnOnB4LThcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTYgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNtIHVwcGVyY2FzZSB0cmFja2luZy1bMC4yNGVtXSB0ZXh0LVsjNmY4ZjJmXVwiPlxuICAgICAgICAgICAgICAgIFNlbGVjY2lvbmFkb3NcbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwibXQtMiBmb250LXNlcmlmIHRleHQtM3hsIHRleHQtc2xhdGUtOTUwIG1kOnRleHQtNHhsXCI+XG4gICAgICAgICAgICAgICAgUHJvZHVjdG9zIHF1ZSBlbXB1amFuIGxhIHRpZW5kYSBjb24gdW5hIGNvbXByYSBtYXMgZmx1aWRhXG4gICAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBnYXAtNSBsZzpncmlkLWNvbHMtNFwiPlxuICAgICAgICAgICAge2ZlYXR1cmVkLm1hcCgocHJvZHVjdCkgPT4gKFxuICAgICAgICAgICAgICA8YXJ0aWNsZVxuICAgICAgICAgICAgICAgIGtleT17cHJvZHVjdC5pZH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJncm91cCBvdmVyZmxvdy1oaWRkZW4gcm91bmRlZC1bMjhweF0gYm9yZGVyIGJvcmRlci1bI2RjZTJjZF0gYmctd2hpdGUgc2hhZG93LVswXzIwcHhfNjBweF9yZ2JhKDE1LDIzLDQyLDAuMDgpXSB0cmFuc2l0aW9uIGR1cmF0aW9uLTMwMCBob3ZlcjotdHJhbnNsYXRlLXktMS41IGhvdmVyOnNoYWRvdy1bMF8zMHB4XzgwcHhfcmdiYSgxNSwyMyw0MiwwLjEyKV1cIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBoLTU2IG92ZXJmbG93LWhpZGRlbiBiZy1zbGF0ZS0xMDBcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC1mdWxsIHctZnVsbCB0cmFuc2l0aW9uIGR1cmF0aW9uLTUwMCBncm91cC1ob3ZlcjpzY2FsZS0xMDVcIj5cbiAgICAgICAgICAgICAgICAgICAgPFByb2R1Y3RBcnR3b3JrIHByb2R1Y3Q9e3Byb2R1Y3R9IC8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgbGVmdC00IHRvcC00IGlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSByb3VuZGVkLWZ1bGwgYmctd2hpdGUvOTIgcHgtMyBweS0xIHRleHQteHMgZm9udC1zZW1pYm9sZCB0ZXh0LXNsYXRlLTkwMFwiPlxuICAgICAgICAgICAgICAgICAgICA8U3RhciBjbGFzc05hbWU9XCJoLTMuNSB3LTMuNSBmaWxsLWN1cnJlbnQgdGV4dC1hbWJlci01MDBcIiAvPlxuICAgICAgICAgICAgICAgICAgICBEZXN0YWNhZG9cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC01XCI+XG4gICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy1bMC4yMmVtXSB0ZXh0LVsjNmY4ZjJmXVwiPlxuICAgICAgICAgICAgICAgICAgICB7cHJvZHVjdC5jYXRlZ29yeX1cbiAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJtdC0yIHRleHQteGwgZm9udC1zZW1pYm9sZCB0ZXh0LXNsYXRlLTk1MFwiPlxuICAgICAgICAgICAgICAgICAgICB7cHJvZHVjdC5uYW1lfVxuICAgICAgICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm10LTMgbGluZS1jbGFtcC0zIHRleHQtc20gbGVhZGluZy02IHRleHQtc2xhdGUtNjAwXCI+XG4gICAgICAgICAgICAgICAgICAgIHtwcm9kdWN0LmRlc2NyaXB0aW9uIHx8ICdTaW4gZGVzY3JpcGNpb24gY2FyZ2FkYS4nfVxuICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC01IGZsZXggaXRlbXMtZW5kIGp1c3RpZnktYmV0d2VlbiBnYXAtNFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLVswLjJlbV0gdGV4dC1zbGF0ZS00MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIFByZWNpb1xuICAgICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJtdC0xIHRleHQtMnhsIGZvbnQtc2VtaWJvbGQgdGV4dC1zbGF0ZS05NTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtmb3JtYXRQcmljZUFSUyhwcm9kdWN0LnByaWNlKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlQWRkVG9DYXJ0KHByb2R1Y3QpfVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiByb3VuZGVkLWZ1bGwgYmctWyMxNzNiMmRdIHB4LTQgcHktMiB0ZXh0LXNtIGZvbnQtc2VtaWJvbGQgdGV4dC13aGl0ZSB0cmFuc2l0aW9uIGhvdmVyOmJnLVsjMjE1MDNjXVwiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8UGx1cyBjbGFzc05hbWU9XCJoLTQgdy00XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICBBZ3JlZ2FyXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPHNlY3Rpb25cbiAgICAgICAgICBpZD1cImNhdGFsb2dvXCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJteC1hdXRvIG1heC13LTd4bCBweC00IHB5LTEyIHNtOnB4LTYgbGc6cHgtOFwiXG4gICAgICAgID5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTggZmxleCBmbGV4LWNvbCBnYXAtNiBsZzpmbGV4LXJvdyBsZzppdGVtcy1lbmQgbGc6anVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNtIHVwcGVyY2FzZSB0cmFja2luZy1bMC4yNGVtXSB0ZXh0LVsjNmY4ZjJmXVwiPlxuICAgICAgICAgICAgICAgIENhdGFsb2dvXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cIm10LTIgZm9udC1zZXJpZiB0ZXh0LTN4bCB0ZXh0LXNsYXRlLTk1MCBtZDp0ZXh0LTV4bFwiPlxuICAgICAgICAgICAgICAgIEJ1c2NhciwgZmlsdHJhciB5IHN1bWFyIGFsIGNhcnJpdG8gc2luIHJvbXBlciBlbCByaXRtb1xuICAgICAgICAgICAgICA8L2gyPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIG1heC13LXhsXCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJyZWxhdGl2ZSBibG9ja1wiPlxuICAgICAgICAgICAgICAgIDxTZWFyY2ggY2xhc3NOYW1lPVwicG9pbnRlci1ldmVudHMtbm9uZSBhYnNvbHV0ZSBsZWZ0LTQgdG9wLTEvMiBoLTUgdy01IC10cmFuc2xhdGUteS0xLzIgdGV4dC1zbGF0ZS00MDBcIiAvPlxuICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgdmFsdWU9e3NlYXJjaH1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldFNlYXJjaChldmVudC50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJCdXNjYXIgcG9yIG5vbWJyZSwgZGVzY3JpcGNpb24gbyBjYXRlZ29yaWFcIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHJvdW5kZWQtZnVsbCBib3JkZXIgYm9yZGVyLVsjZDZkZWJmXSBiZy13aGl0ZSBweC0xMiBweS0zIHRleHQtc20gdGV4dC1zbGF0ZS05MDAgc2hhZG93LXNtIG91dGxpbmUtbm9uZSB0cmFuc2l0aW9uIGZvY3VzOmJvcmRlci1bIzhkYzYzZl1cIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItOCBmbGV4IGZsZXgtd3JhcCBnYXAtM1wiPlxuICAgICAgICAgICAge3Zpc2libGVDYXRlZ29yaWVzLm1hcCgoY2F0ZWdvcnkpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgYWN0aXZlID0gYWN0aXZlQ2F0ZWdvcnkgPT09IGNhdGVnb3J5O1xuXG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAga2V5PXtjYXRlZ29yeX1cbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlQ2F0ZWdvcnkoY2F0ZWdvcnkpfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcm91bmRlZC1mdWxsIHB4LTQgcHktMiB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRyYW5zaXRpb24gJHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlXG4gICAgICAgICAgICAgICAgICAgICAgPyAnYmctWyMxNzNiMmRdIHRleHQtd2hpdGUnXG4gICAgICAgICAgICAgICAgICAgICAgOiAnYm9yZGVyIGJvcmRlci1bI2Q2ZGViZl0gYmctd2hpdGUgdGV4dC1zbGF0ZS02MDAgaG92ZXI6Ym9yZGVyLVsjOGRjNjNmXSBob3Zlcjp0ZXh0LVsjMTczYjJkXSdcbiAgICAgICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtjYXRlZ29yeX1cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi02IGZsZXggZmxleC1jb2wgZ2FwLTIgdGV4dC1zbSB0ZXh0LXNsYXRlLTUwMCBzbTpmbGV4LXJvdyBzbTppdGVtcy1jZW50ZXIgc206anVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAge2ZpbHRlcmVkUHJvZHVjdHMubGVuZ3RofSBwcm9kdWN0b3MgdmlzaWJsZXMgc29icmV7JyAnfVxuICAgICAgICAgICAgICB7aW5pdGlhbERhdGEuc3VtbWFyeS50b3RhbFByb2R1Y3RzfS5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDxwPlVsdGltYSBhY3R1YWxpemFjaW9uIHZpc2libGU6IHtjdXJyZW50VXBkYXRlTGFiZWx9LjwvcD5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBnYXAtNSBtZDpncmlkLWNvbHMtMiB4bDpncmlkLWNvbHMtM1wiPlxuICAgICAgICAgICAge2ZpbHRlcmVkUHJvZHVjdHMubWFwKChwcm9kdWN0KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGF2YWlsYWJsZSA9IHByb2R1Y3Quc3RvY2tRdWFudGl0eSA+IDA7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8YXJ0aWNsZVxuICAgICAgICAgICAgICAgICAga2V5PXtwcm9kdWN0LmlkfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ3JvdXAgb3ZlcmZsb3ctaGlkZGVuIHJvdW5kZWQtWzMwcHhdIGJvcmRlciBib3JkZXItWyNkY2UyY2RdIGJnLXdoaXRlIHNoYWRvdy1bMF8xNnB4XzUwcHhfcmdiYSgxNSwyMyw0MiwwLjA4KV0gdHJhbnNpdGlvbiBkdXJhdGlvbi0zMDAgaG92ZXI6LXRyYW5zbGF0ZS15LTFcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgaC02NCBvdmVyZmxvdy1oaWRkZW4gYmctc2xhdGUtMTAwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC1mdWxsIHctZnVsbCB0cmFuc2l0aW9uIGR1cmF0aW9uLTUwMCBncm91cC1ob3ZlcjpzY2FsZS0xMDVcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8UHJvZHVjdEFydHdvcmsgcHJvZHVjdD17cHJvZHVjdH0gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgbGVmdC00IHRvcC00IGZsZXggZmxleC13cmFwIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicm91bmRlZC1mdWxsIGJnLXdoaXRlLzkyIHB4LTMgcHktMSB0ZXh0LXhzIGZvbnQtc2VtaWJvbGQgdGV4dC1zbGF0ZS05MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtwcm9kdWN0LmNhdGVnb3J5fVxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICB7cHJvZHVjdC5mZWF0dXJlZCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJyb3VuZGVkLWZ1bGwgYmctYW1iZXItMTAwIHB4LTMgcHktMSB0ZXh0LXhzIGZvbnQtc2VtaWJvbGQgdGV4dC1hbWJlci04MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgRGVzdGFjYWRvXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgYm90dG9tLTQgbGVmdC00IHJvdW5kZWQtZnVsbCBiZy1bIzE3M2IyZF0vOTAgcHgtMyBweS0xIHRleHQteHMgZm9udC1tZWRpdW0gdGV4dC13aGl0ZSBiYWNrZHJvcC1ibHVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgU3RvY2s6IHtwcm9kdWN0LnN0b2NrUXVhbnRpdHl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC02XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1zdGFydCBqdXN0aWZ5LWJldHdlZW4gZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtc2VtaWJvbGQgdGV4dC1zbGF0ZS05NTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3Byb2R1Y3QubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJtdC0zIGxpbmUtY2xhbXAtMyB0ZXh0LXNtIGxlYWRpbmctNiB0ZXh0LXNsYXRlLTYwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7cHJvZHVjdC5kZXNjcmlwdGlvbiB8fCAnU2luIGRlc2NyaXBjaW9uIGNhcmdhZGEuJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Byb3VuZGVkLWZ1bGwgcHgtMyBweS0xIHRleHQteHMgZm9udC1zZW1pYm9sZCAke1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhdmFpbGFibGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1lbWVyYWxkLTEwMCB0ZXh0LWVtZXJhbGQtODAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXJvc2UtMTAwIHRleHQtcm9zZS04MDAnXG4gICAgICAgICAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICB7YXZhaWxhYmxlID8gJ0Rpc3BvbmlibGUnIDogJ1NpbiBzdG9jayd9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNiBmbGV4IGl0ZW1zLWVuZCBqdXN0aWZ5LWJldHdlZW4gZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMmVtXSB0ZXh0LXNsYXRlLTQwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICBQcmVjaW9cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm10LTEgdGV4dC0zeGwgZm9udC1zZW1pYm9sZCB0ZXh0LXNsYXRlLTk1MFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0UHJpY2VBUlMocHJvZHVjdC5wcmljZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNlbGVjdGVkUHJvZHVjdChwcm9kdWN0KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC1mdWxsIGJvcmRlciBib3JkZXItWyNkNmRlYmZdIHB4LTQgcHktMiB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtc2xhdGUtNzAwIHRyYW5zaXRpb24gaG92ZXI6Ym9yZGVyLVsjOGRjNjNmXSBob3Zlcjp0ZXh0LVsjMTczYjJkXVwiXG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFZlclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVBZGRUb0NhcnQocHJvZHVjdCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXshYXZhaWxhYmxlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyb3VuZGVkLWZ1bGwgYmctWyMxNzNiMmRdIHB4LTQgcHktMiB0ZXh0LXNtIGZvbnQtc2VtaWJvbGQgdGV4dC13aGl0ZSB0cmFuc2l0aW9uIGhvdmVyOmJnLVsjMjE1MDNjXSBkaXNhYmxlZDpjdXJzb3Itbm90LWFsbG93ZWQgZGlzYWJsZWQ6Ymctc2xhdGUtMzAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgQWdyZWdhclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9hcnRpY2xlPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7ZmlsdGVyZWRQcm9kdWN0cy5sZW5ndGggPT09IDAgJiYgKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLVszMHB4XSBib3JkZXIgYm9yZGVyLWRhc2hlZCBib3JkZXItWyNjZmQ4YjZdIGJnLXdoaXRlLzcwIHB4LTggcHktMTYgdGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LXNlbWlib2xkIHRleHQtc2xhdGUtOTAwXCI+XG4gICAgICAgICAgICAgICAgTm8gaGF5IHByb2R1Y3RvcyBwYXJhIGVzZSBmaWx0cm8uXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibXQtMiB0ZXh0LXNsYXRlLTUwMFwiPlxuICAgICAgICAgICAgICAgIFByb2JhIG90cmEgY2F0ZWdvcmlhIG8gdW5hIGJ1c3F1ZWRhIG1hcyBhbXBsaWEuXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvbWFpbj5cblxuICAgICAge3NlbGVjdGVkUHJvZHVjdCAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZml4ZWQgaW5zZXQtMCB6LTQwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGJnLXNsYXRlLTk1MC82NSBwLTQgYmFja2Ryb3AtYmx1ci1zbVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgbWF4LWgtWzkwdmhdIHctZnVsbCBtYXgtdy01eGwgb3ZlcmZsb3ctYXV0byByb3VuZGVkLVszMnB4XSBiZy13aGl0ZSBzaGFkb3ctWzBfNDBweF8xMjBweF9yZ2JhKDE1LDIzLDQyLDAuMjgpXVwiPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2VsZWN0ZWRQcm9kdWN0KG51bGwpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC01IHRvcC01IHotMTAgcm91bmRlZC1mdWxsIGJnLVsjMTczYjJkXSBwLTIgdGV4dC13aGl0ZVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxYIGNsYXNzTmFtZT1cImgtNCB3LTRcIiAvPlxuICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBnYXAtMCBsZzpncmlkLWNvbHMtWzEuMDVmcl8wLjk1ZnJdXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBnYXAtMyBiZy1zbGF0ZS0xMDAgcC02XCI+XG4gICAgICAgICAgICAgICAge3Byb2R1Y3RHYWxsZXJ5KHNlbGVjdGVkUHJvZHVjdCkubGVuZ3RoID4gMCA/IChcbiAgICAgICAgICAgICAgICAgIHByb2R1Y3RHYWxsZXJ5KHNlbGVjdGVkUHJvZHVjdCkubWFwKChpbWFnZSwgaW5kZXgpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgICAgIGtleT17YCR7c2VsZWN0ZWRQcm9kdWN0LmlkfS0ke2luZGV4fWB9XG4gICAgICAgICAgICAgICAgICAgICAgc3JjPXtpbWFnZX1cbiAgICAgICAgICAgICAgICAgICAgICBhbHQ9e2Ake3NlbGVjdGVkUHJvZHVjdC5uYW1lfSAke2luZGV4ICsgMX1gfVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImgtNzIgdy1mdWxsIHJvdW5kZWQtWzI0cHhdIG9iamVjdC1jb3ZlclwiXG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC1bNDYwcHhdIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLVsyNHB4XSBiZy1bcmFkaWFsLWdyYWRpZW50KGNpcmNsZV9hdF90b3AsX3JnYmEoMTQxLDE5OCw2MywwLjI0KSxfdHJhbnNwYXJlbnRfNTglKSxsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLF8jMTczYjJkXzAlLF8jMTExODI3XzUyJSxfIzMzNWUyMl8xMDAlKV1cIj5cbiAgICAgICAgICAgICAgICAgICAgPFBhY2thZ2UgY2xhc3NOYW1lPVwiaC0xNiB3LTE2IHRleHQtZW1lcmFsZC0xMDBcIiAvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTggbGc6cC0xMFwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLVswLjI0ZW1dIHRleHQtWyM2ZjhmMmZdXCI+XG4gICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRQcm9kdWN0LmNhdGVnb3J5fVxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwibXQtMyBmb250LXNlcmlmIHRleHQtNHhsIGxlYWRpbmctdGlnaHQgdGV4dC1zbGF0ZS05NTBcIj5cbiAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZFByb2R1Y3QubmFtZX1cbiAgICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm10LTUgdGV4dC1iYXNlIGxlYWRpbmctOCB0ZXh0LXNsYXRlLTYwMFwiPlxuICAgICAgICAgICAgICAgICAge3NlbGVjdGVkUHJvZHVjdC5kZXNjcmlwdGlvbiB8fCAnU2luIGRlc2NyaXBjaW9uIGNhcmdhZGEuJ31cbiAgICAgICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTggZ3JpZCBnYXAtNCBzbTpncmlkLWNvbHMtM1wiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLTN4bCBiZy1zbGF0ZS01MCBwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMmVtXSB0ZXh0LXNsYXRlLTQwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgIFByZWNpb1xuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm10LTIgdGV4dC0yeGwgZm9udC1zZW1pYm9sZCB0ZXh0LXNsYXRlLTk1MFwiPlxuICAgICAgICAgICAgICAgICAgICAgIHtmb3JtYXRQcmljZUFSUyhzZWxlY3RlZFByb2R1Y3QucHJpY2UpfVxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC0zeGwgYmctc2xhdGUtNTAgcC00XCI+XG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLVswLjJlbV0gdGV4dC1zbGF0ZS00MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICBTdG9ja1xuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm10LTIgdGV4dC0yeGwgZm9udC1zZW1pYm9sZCB0ZXh0LXNsYXRlLTk1MFwiPlxuICAgICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZFByb2R1Y3Quc3RvY2tRdWFudGl0eX1cbiAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtM3hsIGJnLXNsYXRlLTUwIHAtNFwiPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy1bMC4yZW1dIHRleHQtc2xhdGUtNDAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgRXN0YWRvXG4gICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibXQtMiB0ZXh0LTJ4bCBmb250LXNlbWlib2xkIHRleHQtc2xhdGUtOTUwXCI+XG4gICAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkUHJvZHVjdC5zdG9ja1F1YW50aXR5ID4gMCA/ICdEaXNwb25pYmxlJyA6ICdBZ290YWRvJ31cbiAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTggZmxleCBmbGV4LWNvbCBnYXAtMyBzbTpmbGV4LXJvd1wiPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlQWRkVG9DYXJ0KHNlbGVjdGVkUHJvZHVjdCl9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMiByb3VuZGVkLWZ1bGwgYmctWyMxNzNiMmRdIHB4LTYgcHktMyBmb250LXNlbWlib2xkIHRleHQtd2hpdGUgdHJhbnNpdGlvbiBob3ZlcjpiZy1bIzIxNTAzY11cIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8U2hvcHBpbmdDYXJ0IGNsYXNzTmFtZT1cImgtNCB3LTRcIiAvPlxuICAgICAgICAgICAgICAgICAgICBBZ3JlZ2FyIGFsIGNhcnJpdG9cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2VsZWN0ZWRQcm9kdWN0KG51bGwpfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpbmxpbmUtZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1mdWxsIGJvcmRlciBib3JkZXItWyNkNmRlYmZdIHB4LTYgcHktMyBmb250LXNlbWlib2xkIHRleHQtc2xhdGUtNzAwIHRyYW5zaXRpb24gaG92ZXI6Ym9yZGVyLVsjOGRjNjNmXSBob3Zlcjp0ZXh0LVsjMTczYjJkXVwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIFNlZ3VpciB2aWVuZG9cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC04IHJvdW5kZWQtWzI4cHhdIGJvcmRlciBib3JkZXItWyNkOWVkYjFdIGJnLVsjZWRmN2Q3XSBwLTVcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1zdGFydCBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICA8Q2hlY2tDaXJjbGUyIGNsYXNzTmFtZT1cIm10LTAuNSBoLTUgdy01IHRleHQtWyMzNjUyMjFdXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJmb250LXNlbWlib2xkIHRleHQtWyMyZjRhMWZdXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBFc3RhIGZpY2hhIHNhbGUgZGUgbGEgREIgZGVsIHN0b2NrIG1hbmFnZXIuXG4gICAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm10LTEgdGV4dC1zbSBsZWFkaW5nLTYgdGV4dC1bIzNmNjEyYV1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIExhIGRpc3BvbmliaWxpZGFkIG5vIGVzdGEgZGlidWphZGEgYSBtYW5vLiBTYWxlIGRlbCBzdG9ja1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVhbCBxdWUgdXNhIFBhc29zU2FsdWRhYmxlc1N0b2NrLlxuICAgICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICB7Y2FydFJlbmRlcmVkICYmIChcbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17YGZpeGVkIGluc2V0LTAgei01MCBmbGV4IGp1c3RpZnktZW5kIGJnLXNsYXRlLTk1MC81MiBiYWNrZHJvcC1ibHVyLXNtIHRyYW5zaXRpb24tb3BhY2l0eSBkdXJhdGlvbi0zMDAgJHtcbiAgICAgICAgICAgIGNhcnRWaXNpYmxlID8gJ29wYWNpdHktMTAwJyA6ICdvcGFjaXR5LTAnXG4gICAgICAgICAgfWB9XG4gICAgICAgICAgb25DbGljaz17Y2xvc2VDYXJ0fVxuICAgICAgICA+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgZmxleCBoLWZ1bGwgdy1mdWxsIG1heC13LXhsIGZsZXgtY29sIGJnLVsjZmZmZGY4XSBzaGFkb3ctWzBfMjRweF84MHB4X3JnYmEoMTUsMjMsNDIsMC4yNCldIHRyYW5zaXRpb24gZHVyYXRpb24tMzAwICR7XG4gICAgICAgICAgICAgIGNhcnRWaXNpYmxlID8gJ3RyYW5zbGF0ZS14LTAnIDogJ3RyYW5zbGF0ZS14LWZ1bGwnXG4gICAgICAgICAgICB9YH1cbiAgICAgICAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4gZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gYm9yZGVyLWIgYm9yZGVyLVsjZTRlYWQyXSBweC02IHB5LTVcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3ZlcmZsb3ctaGlkZGVuIHJvdW5kZWQtWzE4cHhdIGJnLVsjOGRjNjNmXSBwLTFcIj5cbiAgICAgICAgICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgICAgICAgICAgc3JjPXticmFuZExvZ299XG4gICAgICAgICAgICAgICAgICAgIGFsdD1cIkxvZ28gUGFzb3MgU2FsdWRhYmxlcyBTdG9ja1wiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImgtMTEgdy0xMSByb3VuZGVkLVsxNHB4XSBvYmplY3QtY292ZXJcIlxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMjJlbV0gdGV4dC1bIzZmOGYyZl1cIj5cbiAgICAgICAgICAgICAgICAgICAgUGVkaWRvXG4gICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwibXQtMSB0ZXh0LTJ4bCBmb250LXNlbWlib2xkIHRleHQtc2xhdGUtOTUwXCI+XG4gICAgICAgICAgICAgICAgICAgIENhcnJpdG8gYWN0dWFsXG4gICAgICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2Nsb3NlQ2FydH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyb3VuZGVkLWZ1bGwgYmctWyMxNzNiMmRdIHAtMiB0ZXh0LXdoaXRlXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxYIGNsYXNzTmFtZT1cImgtNCB3LTRcIiAvPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBzcGFjZS15LTQgb3ZlcmZsb3ctYXV0byBweC02IHB5LTZcIj5cbiAgICAgICAgICAgICAge2l0ZW1zLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtWzI4cHhdIGJvcmRlciBib3JkZXItZGFzaGVkIGJvcmRlci1bI2NkZDhiN10gYmctd2hpdGUgcC0xMCB0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LXNlbWlib2xkIHRleHQtc2xhdGUtOTAwXCI+XG4gICAgICAgICAgICAgICAgICAgIFRvZGF2aWEgbm8gYWdyZWdhc3RlIHByb2R1Y3Rvcy5cbiAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm10LTIgdGV4dC1zbSB0ZXh0LXNsYXRlLTUwMFwiPlxuICAgICAgICAgICAgICAgICAgICBFbCBwb3B1cCB0ZSB2YSBhIGF2aXNhciBhcGVuYXMgc3VtZXMgdW5vLiBEZXNwdWVzIGxvIGNlcnJhcyBwb3JcbiAgICAgICAgICAgICAgICAgICAgV2hhdHNBcHAuXG4gICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgaXRlbXMubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBoaWdobGlnaHRlZCA9IGhpZ2hsaWdodGVkQ2FydEl0ZW1JZCA9PT0gaXRlbS5wcm9kdWN0LmlkO1xuXG4gICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICA8YXJ0aWNsZVxuICAgICAgICAgICAgICAgICAgICAgIGtleT17aXRlbS5wcm9kdWN0LmlkfVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHJvdW5kZWQtWzI4cHhdIGJvcmRlciBwLTQgdHJhbnNpdGlvbiBkdXJhdGlvbi0zMDAgJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgID8gJ3Bzcy1jYXJ0LWl0ZW0tcG9wIGJvcmRlci1bI2NmZTc5OV0gYmctWyNmM2ZiZTNdIHNoYWRvdy1bMF8yMHB4XzQwcHhfcmdiYSgxNDEsMTk4LDYzLDAuMTgpXSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYm9yZGVyLVsjZTRlYWQyXSBiZy1bI2ZiZmFmNV0nXG4gICAgICAgICAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtc3RhcnQgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC0yNCB3LTI0IG92ZXJmbG93LWhpZGRlbiByb3VuZGVkLTJ4bCBiZy1zbGF0ZS0xMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPFByb2R1Y3RBcnR3b3JrIHByb2R1Y3Q9e2l0ZW0ucHJvZHVjdH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4tdy0wIGZsZXgtMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtc3RhcnQganVzdGlmeS1iZXR3ZWVuIGdhcC00XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc20gdXBwZXJjYXNlIHRyYWNraW5nLVswLjIyZW1dIHRleHQtWyM2ZjhmMmZdXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLnByb2R1Y3QuY2F0ZWdvcnl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwibXQtMSB0ZXh0LWxnIGZvbnQtc2VtaWJvbGQgdGV4dC1zbGF0ZS05NTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2l0ZW0ucHJvZHVjdC5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9oND5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHJlbW92ZUl0ZW0oaXRlbS5wcm9kdWN0LmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJvdW5kZWQtZnVsbCBib3JkZXIgYm9yZGVyLVsjZDZkZWJmXSBwLTIgdGV4dC1zbGF0ZS01MDAgdHJhbnNpdGlvbiBob3Zlcjpib3JkZXItcm9zZS0zMDAgaG92ZXI6dGV4dC1yb3NlLTYwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFggY2xhc3NOYW1lPVwiaC00IHctNFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciByb3VuZGVkLWZ1bGwgYm9yZGVyIGJvcmRlci1bI2Q2ZGViZl0gYmctd2hpdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlUXVhbnRpdHlDaGFuZ2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnByb2R1Y3QuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnF1YW50aXR5IC0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJwLTMgdGV4dC1zbGF0ZS03MDAgdHJhbnNpdGlvbiBob3Zlcjp0ZXh0LVsjMTczYjJkXVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNaW51cyBjbGFzc05hbWU9XCJoLTQgdy00XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibWluLXctMTAgdGV4dC1jZW50ZXIgdGV4dC1zbSBmb250LXNlbWlib2xkIHRleHQtc2xhdGUtOTUwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLnF1YW50aXR5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVRdWFudGl0eUNoYW5nZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ucHJvZHVjdC5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ucXVhbnRpdHkgKyAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInAtMyB0ZXh0LXNsYXRlLTcwMCB0cmFuc2l0aW9uIGhvdmVyOnRleHQtWyMxNzNiMmRdXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFBsdXMgY2xhc3NOYW1lPVwiaC00IHctNFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMmVtXSB0ZXh0LXNsYXRlLTQwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdWJ0b3RhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibXQtMSB0ZXh0LWxnIGZvbnQtc2VtaWJvbGQgdGV4dC1zbGF0ZS05NTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2Zvcm1hdFByaWNlQVJTKGl0ZW0ucHJvZHVjdC5wcmljZSAqIGl0ZW0ucXVhbnRpdHkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2FydGljbGU+XG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItdCBib3JkZXItWyNlNGVhZDJdIHB4LTYgcHktNlwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtWzMycHhdIGJnLVsjMTczYjJkXSBwLTYgdGV4dC13aGl0ZSBzaGFkb3ctWzBfMjRweF82MHB4X3JnYmEoMjMsNTksNDUsMC4yMildXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWVuZCBqdXN0aWZ5LWJldHdlZW4gZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc20gdXBwZXJjYXNlIHRyYWNraW5nLVswLjIyZW1dIHRleHQtWyNkYWYzYWZdXCI+XG4gICAgICAgICAgICAgICAgICAgICAgVG90YWxcbiAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJtdC0yIHRleHQtNHhsIGZvbnQtc2VtaWJvbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0UHJpY2VBUlModG90YWwpfVxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1yaWdodCB0ZXh0LXNtIHRleHQtd2hpdGUvNzJcIj5cbiAgICAgICAgICAgICAgICAgICAgPHA+e3RvdGFsSXRlbXN9IHVuaWRhZGVzPC9wPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJtdC0xXCI+UGVkaWRvIGxpc3RvIHBhcmEgV2hhdHNBcHA8L3A+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNiBncmlkIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVDaGVja291dH1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0yIHJvdW5kZWQtZnVsbCBiZy1bIzhkYzYzZl0gcHgtNiBweS0zIGZvbnQtc2VtaWJvbGQgdGV4dC1bIzE3M2IyZF0gdHJhbnNpdGlvbiBob3ZlcjpiZy1bIzlmZDM0OF1cIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICBFbnZpYXIgcGVkaWRvXG4gICAgICAgICAgICAgICAgICAgIDxBcnJvd1JpZ2h0IGNsYXNzTmFtZT1cImgtNCB3LTRcIiAvPlxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtjbGVhckNhcnR9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJvdW5kZWQtZnVsbCBib3JkZXIgYm9yZGVyLXdoaXRlLzE2IHB4LTYgcHktMyBmb250LW1lZGl1bSB0ZXh0LXdoaXRlLzg0IHRyYW5zaXRpb24gaG92ZXI6Ym9yZGVyLXdoaXRlLzMwIGhvdmVyOnRleHQtd2hpdGVcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICBWYWNpYXIgY2Fycml0b1xuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAge3RvYXN0ICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCBib3R0b20tNCBsZWZ0LTQgcmlnaHQtNCB6LTUwIGZsZXgganVzdGlmeS1jZW50ZXIgc206bGVmdC1hdXRvIHNtOnJpZ2h0LTUgc206dy1hdXRvXCI+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAga2V5PXt0b2FzdEtleX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17YHBzcy10b2FzdC1wb3Agdy1mdWxsIG1heC13LW1kIHJvdW5kZWQtWzI4cHhdIGJvcmRlciBweC01IHB5LTQgc2hhZG93LVswXzMwcHhfODBweF9yZ2JhKDE1LDIzLDQyLDAuMTYpXSAke1xuICAgICAgICAgICAgICB0b2FzdC50b25lID09PSAnZXJyb3InXG4gICAgICAgICAgICAgICAgPyAnYm9yZGVyLXJvc2UtMjAwIGJnLXJvc2UtNTAgdGV4dC1yb3NlLTk1MCdcbiAgICAgICAgICAgICAgICA6ICdib3JkZXItWyNkY2UzY2FdIGJnLXdoaXRlIHRleHQtc2xhdGUtOTUwJ1xuICAgICAgICAgICAgfWB9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLXN0YXJ0IGdhcC00XCI+XG4gICAgICAgICAgICAgIHt0b2FzdC5pbWFnZSA/IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtMTYgdy0xNiBvdmVyZmxvdy1oaWRkZW4gcm91bmRlZC1bMjBweF0gYmctWyM4ZGM2M2ZdIHAtMVwiPlxuICAgICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgICBzcmM9e3RvYXN0LmltYWdlfVxuICAgICAgICAgICAgICAgICAgICBhbHQ9e3RvYXN0LnRpdGxlfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJoLWZ1bGwgdy1mdWxsIHJvdW5kZWQtWzE2cHhdIG9iamVjdC1jb3ZlclwiXG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGZsZXggaC0xNCB3LTE0IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLVsxOHB4XSAke1xuICAgICAgICAgICAgICAgICAgICB0b2FzdC50b25lID09PSAnZXJyb3InXG4gICAgICAgICAgICAgICAgICAgICAgPyAnYmctcm9zZS0xMDAgdGV4dC1yb3NlLTcwMCdcbiAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1bI2VkZjdkN10gdGV4dC1bIzE3M2IyZF0nXG4gICAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7dG9hc3QudG9uZSA9PT0gJ2Vycm9yJyA/IChcbiAgICAgICAgICAgICAgICAgICAgPFggY2xhc3NOYW1lPVwiaC01IHctNVwiIC8+XG4gICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICA8U2hvcHBpbmdDYXJ0IGNsYXNzTmFtZT1cImgtNSB3LTVcIiAvPlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi13LTAgZmxleC0xXCI+XG4gICAgICAgICAgICAgICAgPHBcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLVswLjIyZW1dICR7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0LnRvbmUgPT09ICdlcnJvcicgPyAndGV4dC1yb3NlLTcwMCcgOiAndGV4dC1bIzZmOGYyZl0nXG4gICAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7dG9hc3QudG9uZSA9PT0gJ2Vycm9yJyA/ICdBdmlzbycgOiAnQ2Fycml0byBhY3R1YWxpemFkbyd9XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJtdC0xIHRleHQtbGcgZm9udC1zZW1pYm9sZFwiPnt0b2FzdC50aXRsZX08L2g0PlxuICAgICAgICAgICAgICAgIDxwXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BtdC0yIHRleHQtc20gbGVhZGluZy02ICR7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0LnRvbmUgPT09ICdlcnJvcicgPyAndGV4dC1yb3NlLTkwMC84MCcgOiAndGV4dC1zbGF0ZS02MDAnXG4gICAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7dG9hc3QuZGVzY3JpcHRpb259XG4gICAgICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICAgICAge3RvYXN0LnNob3dDYXJ0QWN0aW9uICYmIChcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNCBmbGV4IGZsZXgtd3JhcCBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlVG9hc3RDYXJ0QWN0aW9ufVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJvdW5kZWQtZnVsbCBiZy1bIzE3M2IyZF0gcHgtNCBweS0yIHRleHQtc20gZm9udC1zZW1pYm9sZCB0ZXh0LXdoaXRlIHRyYW5zaXRpb24gaG92ZXI6YmctWyMyMTUwM2NdXCJcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIFZlciBjYXJyaXRvXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0VG9hc3QobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC1mdWxsIGJvcmRlciBib3JkZXItWyNkNmRlYmZdIHB4LTQgcHktMiB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtc2xhdGUtNzAwIHRyYW5zaXRpb24gaG92ZXI6Ym9yZGVyLVsjOGRjNjNmXSBob3Zlcjp0ZXh0LVsjMTczYjJkXVwiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICBTZWd1aXIgdmllbmRvXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFRvYXN0KG51bGwpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJvdW5kZWQtZnVsbCBib3JkZXIgYm9yZGVyLWJsYWNrLzUgcC0yIHRleHQtc2xhdGUtNDAwIHRyYW5zaXRpb24gaG92ZXI6dGV4dC1zbGF0ZS03MDBcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPFggY2xhc3NOYW1lPVwiaC00IHctNFwiIC8+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAgPHN0eWxlPntgXG4gICAgICAgIEBrZXlmcmFtZXMgcHNzLWxvZ28tZmxvYXQge1xuICAgICAgICAgIDAlLFxuICAgICAgICAgIDEwMCUge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICAgICAgICAgIH1cbiAgICAgICAgICA1MCUge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC03cHgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIEBrZXlmcmFtZXMgcHNzLWJhZGdlLWJ1bXAge1xuICAgICAgICAgIDAlIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIDQ1JSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMDgpIHRyYW5zbGF0ZVkoLTJweCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIDEwMCUge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBAa2V5ZnJhbWVzIHBzcy1jYXJ0LWl0ZW0tcG9wIHtcbiAgICAgICAgICAwJSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMjBweCkgc2NhbGUoMC45OCk7XG4gICAgICAgICAgICBvcGFjaXR5OiAwLjU1O1xuICAgICAgICAgIH1cbiAgICAgICAgICA2MCUge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC00cHgpIHNjYWxlKDEuMDEpO1xuICAgICAgICAgICAgb3BhY2l0eTogMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgMTAwJSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCkgc2NhbGUoMSk7XG4gICAgICAgICAgICBvcGFjaXR5OiAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIEBrZXlmcmFtZXMgcHNzLXRvYXN0LXBvcCB7XG4gICAgICAgICAgMCUge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDE4cHgpIHNjYWxlKDAuOTQpO1xuICAgICAgICAgICAgb3BhY2l0eTogMDtcbiAgICAgICAgICB9XG4gICAgICAgICAgMTAwJSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCkgc2NhbGUoMSk7XG4gICAgICAgICAgICBvcGFjaXR5OiAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC5wc3MtbG9nby1mbG9hdCB7XG4gICAgICAgICAgYW5pbWF0aW9uOiBwc3MtbG9nby1mbG9hdCA2cyBlYXNlLWluLW91dCBpbmZpbml0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC5wc3MtYmFkZ2UtYnVtcCB7XG4gICAgICAgICAgYW5pbWF0aW9uOiBwc3MtYmFkZ2UtYnVtcCA0MjBtcyBlYXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLnBzcy1jYXJ0LWl0ZW0tcG9wIHtcbiAgICAgICAgICBhbmltYXRpb246IHBzcy1jYXJ0LWl0ZW0tcG9wIDQyMG1zIGVhc2U7XG4gICAgICAgIH1cblxuICAgICAgICAucHNzLXRvYXN0LXBvcCB7XG4gICAgICAgICAgYW5pbWF0aW9uOiBwc3MtdG9hc3QtcG9wIDI4MG1zIGN1YmljLWJlemllcigwLjE4LCAwLjg5LCAwLjMyLCAxLjI4KTtcbiAgICAgICAgfVxuICAgICAgYH08L3N0eWxlPlxuICAgIDwvZGl2PlxuICApO1xufVxuIl0sImZpbGUiOiJEOi9kZXYvUGFzb3NTYWx1ZGFibGVzL3NyYy9jb21wb25lbnRzL1N0b3JlZnJvbnRBcHAudHN4In0=
