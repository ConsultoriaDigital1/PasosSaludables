import React, { useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  LayoutGrid,
  Loader2,
  LogOut,
  Package,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Tags,
  Trash2,
  Wallet,
  X
} from 'lucide-react';
import type {
  Category,
  DashboardSnapshot,
  Product,
  StockMovement,
  TreasuryTransaction
} from '../types';
import {
  formatCompactNumber,
  formatDateLabel,
  formatDateTimeLabel,
  formatPriceARS
} from '../lib/formatters';

type TabId = 'overview' | 'inventory' | 'categories' | 'movements' | 'treasury';

interface ProductFormState {
  name: string;
  description: string;
  category: string;
  price: string;
  stockQuantity: string;
  image: string;
  images: string;
  featured: boolean;
}

interface CategoryFormState {
  name: string;
  description: string;
}

interface MovementFormState {
  productId: string;
  movementType: 'IN' | 'OUT';
  quantity: string;
  reason: string;
  note: string;
}

interface TransactionFormState {
  transactionType:
    | 'INCOME'
    | 'EXPENSE'
    | 'SALE'
    | 'PURCHASE'
    | 'WITHDRAWAL'
    | 'CAPITAL'
    | 'TAX';
  category: string;
  amount: string;
  paymentMethod: string;
  reference: string;
  note: string;
  occurredAt: string;
}

const emptyProductForm: ProductFormState = {
  name: '',
  description: '',
  category: '',
  price: '',
  stockQuantity: '0',
  image: '',
  images: '',
  featured: false
};

const emptyCategoryForm: CategoryFormState = {
  name: '',
  description: ''
};

const emptyMovementForm: MovementFormState = {
  productId: '',
  movementType: 'IN',
  quantity: '1',
  reason: '',
  note: ''
};

const emptyTransactionForm: TransactionFormState = {
  transactionType: 'EXPENSE',
  category: '',
  amount: '',
  paymentMethod: '',
  reference: '',
  note: '',
  occurredAt: ''
};

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || data?.message || 'La solicitud fallo');
  }

  return data as T;
}

function productImage(product: Product) {
  return product.image || product.images[0] || '';
}

function buildProductForm(product?: Product | null): ProductFormState {
  if (!product) {
    return emptyProductForm;
  }

  return {
    name: product.name,
    description: product.description,
    category: product.category,
    price: String(product.price),
    stockQuantity: String(product.stockQuantity),
    image: product.image,
    images: product.images.join(', '),
    featured: product.featured
  };
}

function buildCategoryForm(category?: Category | null): CategoryFormState {
  if (!category) {
    return emptyCategoryForm;
  }

  return {
    name: category.name,
    description: category.description
  };
}

export default function DashboardApp() {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [transactions, setTransactions] = useState<TreasuryTransaction[]>([]);
  const [inventorySearch, setInventorySearch] = useState('');
  const [notice, setNotice] = useState('');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [productForm, setProductForm] = useState<ProductFormState>(emptyProductForm);
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(emptyCategoryForm);
  const [movementForm, setMovementForm] = useState<MovementFormState>(emptyMovementForm);
  const [transactionForm, setTransactionForm] =
    useState<TransactionFormState>(emptyTransactionForm);

  useEffect(() => {
    const savedAuth = window.localStorage.getItem('pss-admin-auth');
    setAuthenticated(savedAuth === '1');
    setReady(true);
  }, []);

  useEffect(() => {
    if (!authenticated) {
      return;
    }

    void loadAll();
  }, [authenticated]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setNotice(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  async function loadAll() {
    setLoading(true);

    try {
      const [
        dashboardData,
        productsData,
        categoriesData,
        movementsData,
        transactionsData
      ] = await Promise.all([
        getJson<DashboardSnapshot>('/api/dashboard'),
        getJson<Product[]>('/api/products'),
        getJson<Category[]>('/api/categories'),
        getJson<StockMovement[]>('/api/stock-movements?limit=40'),
        getJson<TreasuryTransaction[]>('/api/treasury/transactions?limit=60')
      ]);

      setSnapshot(dashboardData);
      setProducts(productsData);
      setCategories(categoriesData);
      setMovements(movementsData);
      setTransactions(transactionsData);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'No se pudo cargar el dashboard');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginLoading(true);

    try {
      await getJson('/api/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginForm)
      });

      window.localStorage.setItem('pss-admin-auth', '1');
      setAuthenticated(true);
      setNotice('Sesion iniciada.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Credenciales invalidas');
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    window.localStorage.removeItem('pss-admin-auth');
    setAuthenticated(false);
    setSnapshot(null);
    setProducts([]);
    setCategories([]);
    setNotice('Sesion cerrada.');
  }

  function openCreateProduct() {
    setEditingProduct(null);
    setProductForm(emptyProductForm);
    setProductModalOpen(true);
  }

  function openEditProduct(product: Product) {
    setEditingProduct(product);
    setProductForm(buildProductForm(product));
    setProductModalOpen(true);
  }

  function openCreateCategory() {
    setEditingCategory(null);
    setCategoryForm(emptyCategoryForm);
    setCategoryModalOpen(true);
  }

  function openCreateMovement() {
    setMovementForm(emptyMovementForm);
    setMovementModalOpen(true);
  }

  function openCreateTransaction() {
    setTransactionForm({
      ...emptyTransactionForm,
      occurredAt: new Date().toISOString().slice(0, 16)
    });
    setTransactionModalOpen(true);
  }

  function openEditCategory(category: Category) {
    setEditingCategory(category);
    setCategoryForm(buildCategoryForm(category));
    setCategoryModalOpen(true);
  }

  async function submitProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      name: productForm.name,
      description: productForm.description,
      category: productForm.category,
      price: Number(productForm.price),
      stockQuantity: Number(productForm.stockQuantity),
      image: productForm.image,
      images: productForm.images
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      featured: productForm.featured
    };

    try {
      if (editingProduct) {
        await getJson(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        setNotice('Producto actualizado.');
      } else {
        await getJson('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        setNotice('Producto creado.');
      }

      setProductModalOpen(false);
      await loadAll();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'No se pudo guardar el producto');
    }
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Eliminar "${product.name}"?`)) {
      return;
    }

    try {
      await getJson(`/api/products/${product.id}`, {
        method: 'DELETE'
      });
      setNotice('Producto eliminado.');
      await loadAll();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'No se pudo eliminar el producto');
    }
  }

  async function submitCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (editingCategory) {
        await getJson(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(categoryForm)
        });
        setNotice('Categoria actualizada.');
      } else {
        await getJson('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(categoryForm)
        });
        setNotice('Categoria creada.');
      }

      setCategoryModalOpen(false);
      await loadAll();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'No se pudo guardar la categoria');
    }
  }

  async function submitMovement(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await getJson('/api/stock-movements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: Number(movementForm.productId),
          movementType: movementForm.movementType,
          quantity: Number(movementForm.quantity),
          reason: movementForm.reason,
          note: movementForm.note
        })
      });

      setMovementModalOpen(false);
      setNotice('Movimiento registrado.');
      await loadAll();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'No se pudo registrar el movimiento');
    }
  }

  async function submitTransaction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await getJson('/api/treasury/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transactionType: transactionForm.transactionType,
          category: transactionForm.category,
          amount: Number(transactionForm.amount),
          paymentMethod: transactionForm.paymentMethod,
          reference: transactionForm.reference,
          note: transactionForm.note,
          occurredAt: transactionForm.occurredAt
            ? new Date(transactionForm.occurredAt).toISOString()
            : new Date().toISOString()
        })
      });

      setTransactionModalOpen(false);
      setNotice('Transaccion registrada.');
      await loadAll();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'No se pudo registrar la transaccion');
    }
  }

  async function deleteTransaction(transaction: TreasuryTransaction) {
    if (!window.confirm(`Eliminar la transaccion #${transaction.id}?`)) {
      return;
    }

    try {
      await getJson(`/api/treasury/transactions/${transaction.id}`, {
        method: 'DELETE'
      });
      setNotice('Transaccion eliminada.');
      await loadAll();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'No se pudo eliminar la transaccion');
    }
  }

  async function deleteCategory(category: Category) {
    if (!window.confirm(`Eliminar la categoria "${category.name}"?`)) {
      return;
    }

    try {
      await getJson(`/api/categories/${category.id}`, {
        method: 'DELETE'
      });
      setNotice('Categoria eliminada.');
      await loadAll();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'No se pudo eliminar la categoria');
    }
  }

  const filteredProducts = products.filter((product) => {
    const query = inventorySearch.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutGrid className="h-4 w-4" />
    },
    {
      id: 'inventory',
      label: 'Inventario',
      icon: <Boxes className="h-4 w-4" />
    },
    {
      id: 'categories',
      label: 'Categorias',
      icon: <Tags className="h-4 w-4" />
    },
    {
      id: 'movements',
      label: 'Movimientos',
      icon: <Package className="h-4 w-4" />
    },
    {
      id: 'treasury',
      label: 'Tesoreria',
      icon: <Wallet className="h-4 w-4" />
    }
  ];

  const financeMax = snapshot
    ? Math.max(
        1,
        ...snapshot.monthlyFinance.map((point) =>
          Math.max(point.income, point.expense)
        )
      )
    : 1;

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08141f] text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#08141f] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_35%),linear-gradient(180deg,_#020617_0%,_#08141f_50%,_#0f172a_100%)]" />
        <div className="relative mx-auto grid min-h-screen max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
              <ShieldCheck className="h-4 w-4" />
              Acceso interno
            </span>
            <h1 className="mt-6 font-serif text-5xl leading-[0.98] tracking-tight md:text-7xl">
              Dashboard nuevo para operar sobre la DB del stock manager.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Inventario, bajo stock, movimientos y caja integrados en una sola
              vista. Sin la interfaz vieja del Express anterior.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm text-slate-400">DB activa</p>
                <p className="mt-3 text-2xl font-semibold">PasosSaludablesStock</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm text-slate-400">Stack</p>
                <p className="mt-3 text-2xl font-semibold">Astro + React</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm text-slate-400">Foco</p>
                <p className="mt-3 text-2xl font-semibold">Inventario real</p>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.3)] backdrop-blur">
              <p className="text-sm uppercase tracking-[0.22em] text-emerald-200">
                Ingreso
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Entrar al panel
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Usa las credenciales definidas en el `.env` del proyecto actual.
              </p>

              <form onSubmit={handleLogin} className="mt-8 grid gap-5">
                <label className="grid gap-2">
                  <span className="text-sm text-slate-300">Usuario</span>
                  <input
                    value={loginForm.username}
                    onChange={(event) =>
                      setLoginForm((current) => ({
                        ...current,
                        username: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                    placeholder="pasossaludables"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-slate-300">Password</span>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((current) => ({
                        ...current,
                        password: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                    placeholder="••••••••"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-3 font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loginLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Entrar
                </button>
              </form>
            </div>
          </div>
        </div>

        {notice && (
          <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 shadow-lg">
            {notice}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eff4ef] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-white/90 px-4 py-5 backdrop-blur lg:min-h-screen lg:w-80 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
          <div className="flex items-center gap-3">
            <img
              src="/logo-pasos-saludables.svg"
              alt="Pasos Saludables Stock"
              className="h-11 w-auto"
            />
            <div>
              <p className="font-semibold text-slate-950">Pasos Saludables</p>
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-700">
                Dashboard
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-2">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    active
                      ? 'bg-slate-950 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-8 rounded-[28px] bg-slate-950 p-5 text-white">
            <p className="text-sm uppercase tracking-[0.22em] text-emerald-200">
              Origen de datos
            </p>
            <p className="mt-3 text-2xl font-semibold">
              Base PasosSaludablesStock
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Productos, categorias, movimientos y tesoreria salen de la misma
              base.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-300 hover:text-rose-700"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesion
          </button>
        </aside>

        <section className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">
                Operacion
              </p>
              <h1 className="mt-2 font-serif text-4xl tracking-tight text-slate-950 md:text-5xl">
                {activeTab === 'overview' && 'Lectura completa del negocio'}
                {activeTab === 'inventory' && 'Inventario y productos'}
                {activeTab === 'categories' && 'Estructura de categorias'}
                {activeTab === 'movements' && 'Entradas y salidas de stock'}
                {activeTab === 'treasury' && 'Caja y transacciones'}
              </h1>
            </div>

            <div className="flex flex-wrap gap-3">
              {activeTab === 'inventory' && (
                <button
                  type="button"
                  onClick={openCreateProduct}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  <Plus className="h-4 w-4" />
                  Nuevo producto
                </button>
              )}
              {activeTab === 'categories' && (
                <button
                  type="button"
                  onClick={openCreateCategory}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  <Plus className="h-4 w-4" />
                  Nueva categoria
                </button>
              )}
              {activeTab === 'movements' && (
                <button
                  type="button"
                  onClick={openCreateMovement}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  <Plus className="h-4 w-4" />
                  Nuevo movimiento
                </button>
              )}
              {activeTab === 'treasury' && (
                <button
                  type="button"
                  onClick={openCreateTransaction}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  <Plus className="h-4 w-4" />
                  Nueva transaccion
                </button>
              )}
            </div>
          </div>

          {loading && !snapshot ? (
            <div className="flex h-72 items-center justify-center rounded-[32px] border border-slate-200 bg-white">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
            </div>
          ) : null}

          {snapshot && activeTab === 'overview' && (
            <div className="grid gap-6">
              <div className="grid gap-4 xl:grid-cols-5">
                {[
                  {
                    label: 'Inventario valorizado',
                    value: formatPriceARS(snapshot.summary.inventoryValue),
                    detail: `${snapshot.summary.totalStock} unidades`,
                    accent: 'emerald'
                  },
                  {
                    label: 'Caja del mes',
                    value: formatPriceARS(snapshot.summary.treasuryBalance),
                    detail: `${formatPriceARS(snapshot.summary.totalIncome)} ingresos`,
                    accent: 'cyan'
                  },
                  {
                    label: 'Productos',
                    value: formatCompactNumber(snapshot.summary.totalProducts),
                    detail: `${snapshot.summary.totalCategories} categorias`,
                    accent: 'slate'
                  },
                  {
                    label: 'Stock bajo',
                    value: formatCompactNumber(snapshot.summary.lowStockProducts),
                    detail: `${snapshot.summary.recentMovements} movimientos recientes`,
                    accent: 'amber'
                  },
                  {
                    label: 'Destacados',
                    value: formatCompactNumber(snapshot.summary.featuredProducts),
                    detail: `${snapshot.summary.recentUnitsOut} unidades salieron esta semana`,
                    accent: 'rose'
                  }
                ].map((card) => (
                  <article
                    key={card.label}
                    className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
                  >
                    <p className="text-sm text-slate-500">{card.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-950">
                      {card.value}
                    </p>
                    <p className="mt-2 text-sm text-emerald-700">{card.detail}</p>
                  </article>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.22em] text-emerald-700">
                        Finanzas
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                        Flujo mensual
                      </h2>
                    </div>
                    <BarChart3 className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-6">
                    {snapshot.monthlyFinance.map((point) => {
                      const incomeHeight = Math.max(
                        8,
                        (point.income / financeMax) * 180
                      );
                      const expenseHeight = Math.max(
                        8,
                        (point.expense / financeMax) * 180
                      );

                      return (
                        <div key={point.month} className="flex flex-col items-center gap-3">
                          <div className="flex h-48 items-end gap-2">
                            <div
                              className="w-5 rounded-full bg-emerald-400"
                              style={{ height: `${incomeHeight}px` }}
                              title={`Ingresos ${formatPriceARS(point.income)}`}
                            />
                            <div
                              className="w-5 rounded-full bg-slate-200"
                              style={{ height: `${expenseHeight}px` }}
                              title={`Egresos ${formatPriceARS(point.expense)}`}
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-slate-900">
                              {point.month}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatPriceARS(point.income)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="grid gap-6">
                  <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.22em] text-emerald-700">
                          Tesoreria
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                          Ingresos vs egresos
                        </h2>
                      </div>
                      <Wallet className="h-5 w-5 text-slate-400" />
                    </div>

                    <div className="mt-6 grid gap-4">
                      <div className="rounded-3xl bg-emerald-50 p-4">
                        <div className="flex items-center gap-3">
                          <ArrowUpRight className="h-5 w-5 text-emerald-700" />
                          <div>
                            <p className="text-sm text-emerald-800">Ingresos</p>
                            <p className="mt-1 text-2xl font-semibold text-emerald-950">
                              {formatPriceARS(snapshot.summary.totalIncome)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl bg-rose-50 p-4">
                        <div className="flex items-center gap-3">
                          <ArrowDownRight className="h-5 w-5 text-rose-700" />
                          <div>
                            <p className="text-sm text-rose-800">Egresos</p>
                            <p className="mt-1 text-2xl font-semibold text-rose-950">
                              {formatPriceARS(snapshot.summary.totalExpense)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>

                  <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                    <p className="text-sm uppercase tracking-[0.22em] text-emerald-700">
                      Egresos del mes
                    </p>
                    <div className="mt-5 grid gap-3">
                      {snapshot.expenseBreakdown.length === 0 ? (
                        <p className="text-sm text-slate-500">
                          No hay egresos registrados este mes.
                        </p>
                      ) : (
                        snapshot.expenseBreakdown.map((item) => (
                          <div
                            key={item.category}
                            className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                          >
                            <span className="text-sm font-medium text-slate-700">
                              {item.category}
                            </span>
                            <span className="text-sm font-semibold text-slate-950">
                              {formatPriceARS(item.total)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </article>
                </section>
              </div>

              <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr_1fr]">
                <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                  <p className="text-sm uppercase tracking-[0.22em] text-emerald-700">
                    Top stock
                  </p>
                  <div className="mt-5 grid gap-3">
                    {snapshot.topStock.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl bg-slate-50 px-4 py-3"
                      >
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.stockQuantity} unidades
                        </p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                  <p className="text-sm uppercase tracking-[0.22em] text-emerald-700">
                    Stock bajo
                  </p>
                  <div className="mt-5 grid gap-3">
                    {snapshot.lowStock.length === 0 ? (
                      <p className="text-sm text-slate-500">
                        No hay alertas de stock bajo.
                      </p>
                    ) : (
                      snapshot.lowStock.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl bg-amber-50 px-4 py-3"
                        >
                          <p className="font-medium text-slate-900">{item.name}</p>
                          <p className="mt-1 text-sm text-amber-900">
                            {item.stockQuantity} unidades
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </article>

                <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                  <p className="text-sm uppercase tracking-[0.22em] text-emerald-700">
                    Movimientos recientes
                  </p>
                  <div className="mt-5 grid gap-4">
                    {snapshot.recentMovements.map((movement) => (
                      <div key={movement.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-slate-900">
                            {movement.productName}
                          </p>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              movement.movementType === 'OUT'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {movement.movementType}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{movement.reason}</p>
                        <p className="mt-2 text-xs text-slate-400">
                          {formatDateTimeLabel(movement.createdAt)} · {movement.quantity} unidades
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="grid gap-6">
              <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={inventorySearch}
                    onChange={(event) => setInventorySearch(event.target.value)}
                    placeholder="Buscar producto por nombre, descripcion o categoria"
                    className="w-full rounded-full border border-slate-300 bg-slate-50 px-12 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500"
                  />
                </label>
              </div>

              <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]"
                  >
                    <div className="relative h-48 bg-slate-100">
                      {productImage(product) ? (
                        <img
                          src={productImage(product)}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.22),_transparent_55%),linear-gradient(135deg,_#0f172a_0%,_#111827_52%,_#052e16_100%)]">
                          <Package className="h-14 w-14 text-emerald-200" />
                        </div>
                      )}

                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
                          {product.category}
                        </span>
                        {product.featured && (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                            Destacado
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-950">
                            {product.name}
                          </h3>
                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                            {product.description}
                          </p>
                        </div>
                        <div
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            product.stockQuantity <= 5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          Stock {product.stockQuantity}
                        </div>
                      </div>

                      <div className="mt-5 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            Precio
                          </p>
                          <p className="mt-1 text-2xl font-semibold text-slate-950">
                            {formatPriceARS(product.price)}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEditProduct(product)}
                            className="rounded-full border border-slate-300 p-3 text-slate-600 transition hover:border-emerald-400 hover:text-emerald-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(product)}
                            className="rounded-full border border-slate-300 p-3 text-slate-600 transition hover:border-rose-300 hover:text-rose-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="rounded-[32px] border border-dashed border-slate-300 bg-white px-8 py-16 text-center">
                  <p className="text-lg font-semibold text-slate-900">
                    No hay productos para ese filtro.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <p className="text-sm uppercase tracking-[0.22em] text-emerald-700">
                  Distribucion
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  Categorias con mas peso
                </h2>
                <div className="mt-6 grid gap-3">
                  {snapshot?.categoryDistribution.map((item) => (
                    <div
                      key={item.category}
                      className="rounded-2xl bg-slate-50 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-slate-900">{item.category}</p>
                        <span className="text-sm font-semibold text-slate-950">
                          {item.units} unidades
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.products} productos
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-emerald-700">
                      Gestion
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                      Categorias cargadas
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={openCreateCategory}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    <Plus className="h-4 w-4" />
                    Crear
                  </button>
                </div>

                <div className="mt-6 grid gap-3">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-4"
                    >
                      <div>
                        <p className="font-semibold text-slate-950">{category.name}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {category.description || 'Sin descripcion.'}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditCategory(category)}
                          className="rounded-full border border-slate-300 p-3 text-slate-600 transition hover:border-emerald-400 hover:text-emerald-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCategory(category)}
                          className="rounded-full border border-slate-300 p-3 text-slate-600 transition hover:border-rose-300 hover:text-rose-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          )}

          {activeTab === 'movements' && (
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <p className="text-sm uppercase tracking-[0.22em] text-emerald-700">
                  Tendencia
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  Entradas y salidas de 14 dias
                </h2>
                <div className="mt-6 grid gap-3">
                  {snapshot?.movementTrend.map((point) => (
                    <div
                      key={point.day}
                      className="rounded-2xl bg-slate-50 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-slate-900">
                          {formatDateLabel(point.day)}
                        </p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-emerald-700">
                            IN {point.unitsIn}
                          </span>
                          <span className="text-rose-700">
                            OUT {point.unitsOut}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-emerald-700">
                      Registro
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                      Ultimos movimientos
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={openCreateMovement}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    <Plus className="h-4 w-4" />
                    Cargar
                  </button>
                </div>

                <div className="mt-6 grid gap-3">
                  {movements.map((movement) => (
                    <div
                      key={movement.id}
                      className="rounded-2xl bg-slate-50 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-950">
                            {movement.productName}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {movement.reason}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            movement.movementType === 'OUT'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {movement.movementType} · {movement.quantity}
                        </span>
                      </div>
                      {movement.note && (
                        <p className="mt-3 text-sm text-slate-600">{movement.note}</p>
                      )}
                      <p className="mt-3 text-xs text-slate-400">
                        {formatDateTimeLabel(movement.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          )}

          {activeTab === 'treasury' && (
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <p className="text-sm uppercase tracking-[0.22em] text-emerald-700">
                  Balance
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  Caja del mes
                </h2>
                <div className="mt-6 grid gap-4">
                  <div className="rounded-3xl bg-emerald-50 p-5">
                    <p className="text-sm text-emerald-800">Ingresos</p>
                    <p className="mt-2 text-3xl font-semibold text-emerald-950">
                      {snapshot
                        ? formatPriceARS(snapshot.summary.totalIncome)
                        : formatPriceARS(0)}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-rose-50 p-5">
                    <p className="text-sm text-rose-800">Egresos</p>
                    <p className="mt-2 text-3xl font-semibold text-rose-950">
                      {snapshot
                        ? formatPriceARS(snapshot.summary.totalExpense)
                        : formatPriceARS(0)}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-950 p-5 text-white">
                    <p className="text-sm text-slate-300">Balance</p>
                    <p className="mt-2 text-3xl font-semibold">
                      {snapshot
                        ? formatPriceARS(snapshot.summary.treasuryBalance)
                        : formatPriceARS(0)}
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-emerald-700">
                      Registro
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                      Ultimas transacciones
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={openCreateTransaction}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    <Plus className="h-4 w-4" />
                    Cargar
                  </button>
                </div>

                <div className="mt-6 grid gap-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="rounded-2xl bg-slate-50 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-950">
                            {transaction.category}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {transaction.transactionType}
                            {transaction.reference ? ` · ${transaction.reference}` : ''}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <p className="text-right text-sm font-semibold text-slate-950">
                            {formatPriceARS(transaction.amount)}
                          </p>
                          <button
                            type="button"
                            onClick={() => deleteTransaction(transaction)}
                            className="rounded-full border border-slate-300 p-3 text-slate-600 transition hover:border-rose-300 hover:text-rose-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {transaction.note && (
                        <p className="mt-3 text-sm text-slate-600">{transaction.note}</p>
                      )}
                      <p className="mt-3 text-xs text-slate-400">
                        {formatDateTimeLabel(transaction.occurredAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          )}
        </section>
      </div>

      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[32px] bg-white p-8 shadow-[0_40px_120px_rgba(15,23,42,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-emerald-700">
                  Producto
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                  {editingProduct ? 'Editar producto' : 'Nuevo producto'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="rounded-full bg-slate-950 p-2 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={submitProduct} className="mt-8 grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm text-slate-600">Nombre</span>
                  <input
                    value={productForm.name}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        name: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-slate-600">Categoria</span>
                  <input
                    list="dashboard-categories"
                    value={productForm.category}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        category: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-slate-600">Precio</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        price: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-slate-600">Stock</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={productForm.stockQuantity}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        stockQuantity: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                    required
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm text-slate-600">Descripcion</span>
                <textarea
                  value={productForm.description}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      description: event.target.value
                    }))
                  }
                  className="min-h-32 rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm text-slate-600">Imagen principal</span>
                  <input
                    value={productForm.image}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        image: event.target.value
                      }))
                    }
                    placeholder="https://..."
                    className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-slate-600">
                    Galeria separada por comas
                  </span>
                  <input
                    value={productForm.images}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        images: event.target.value
                      }))
                    }
                    placeholder="https://..., https://..."
                    className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  />
                </label>
              </div>

              <label className="inline-flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={productForm.featured}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      featured: event.target.checked
                    }))
                  }
                />
                Marcar como destacado
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="rounded-full border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:border-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
                >
                  Guardar producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[32px] bg-white p-8 shadow-[0_40px_120px_rgba(15,23,42,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-emerald-700">
                  Categoria
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                  {editingCategory ? 'Editar categoria' : 'Nueva categoria'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="rounded-full bg-slate-950 p-2 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={submitCategory} className="mt-8 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm text-slate-600">Nombre</span>
                <input
                  value={categoryForm.name}
                  onChange={(event) =>
                    setCategoryForm((current) => ({
                      ...current,
                      name: event.target.value
                    }))
                  }
                  className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-600">Descripcion</span>
                <textarea
                  value={categoryForm.description}
                  onChange={(event) =>
                    setCategoryForm((current) => ({
                      ...current,
                      description: event.target.value
                    }))
                  }
                  className="min-h-28 rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="rounded-full border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:border-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
                >
                  Guardar categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {movementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[32px] bg-white p-8 shadow-[0_40px_120px_rgba(15,23,42,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-emerald-700">
                  Stock
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                  Nuevo movimiento
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setMovementModalOpen(false)}
                className="rounded-full bg-slate-950 p-2 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={submitMovement} className="mt-8 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm text-slate-600">Producto</span>
                <select
                  value={movementForm.productId}
                  onChange={(event) =>
                    setMovementForm((current) => ({
                      ...current,
                      productId: event.target.value
                    }))
                  }
                  className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  required
                >
                  <option value="">Seleccionar</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm text-slate-600">Tipo</span>
                  <select
                    value={movementForm.movementType}
                    onChange={(event) =>
                      setMovementForm((current) => ({
                        ...current,
                        movementType: event.target.value as 'IN' | 'OUT'
                      }))
                    }
                    className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  >
                    <option value="IN">Ingreso</option>
                    <option value="OUT">Salida</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-slate-600">Cantidad</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={movementForm.quantity}
                    onChange={(event) =>
                      setMovementForm((current) => ({
                        ...current,
                        quantity: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                    required
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm text-slate-600">Motivo</span>
                <input
                  value={movementForm.reason}
                  onChange={(event) =>
                    setMovementForm((current) => ({
                      ...current,
                      reason: event.target.value
                    }))
                  }
                  className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-600">Nota</span>
                <textarea
                  value={movementForm.note}
                  onChange={(event) =>
                    setMovementForm((current) => ({
                      ...current,
                      note: event.target.value
                    }))
                  }
                  className="min-h-28 rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setMovementModalOpen(false)}
                  className="rounded-full border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:border-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
                >
                  Registrar movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {transactionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-[0_40px_120px_rgba(15,23,42,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-emerald-700">
                  Tesoreria
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                  Nueva transaccion
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setTransactionModalOpen(false)}
                className="rounded-full bg-slate-950 p-2 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={submitTransaction} className="mt-8 grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm text-slate-600">Tipo</span>
                  <select
                    value={transactionForm.transactionType}
                    onChange={(event) =>
                      setTransactionForm((current) => ({
                        ...current,
                        transactionType: event.target.value as TransactionFormState['transactionType']
                      }))
                    }
                    className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  >
                    <option value="INCOME">Ingreso</option>
                    <option value="EXPENSE">Gasto</option>
                    <option value="SALE">Venta</option>
                    <option value="PURCHASE">Compra</option>
                    <option value="WITHDRAWAL">Retiro</option>
                    <option value="CAPITAL">Capital</option>
                    <option value="TAX">Impuesto</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-slate-600">Monto</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={transactionForm.amount}
                    onChange={(event) =>
                      setTransactionForm((current) => ({
                        ...current,
                        amount: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm text-slate-600">Categoria</span>
                  <input
                    value={transactionForm.category}
                    onChange={(event) =>
                      setTransactionForm((current) => ({
                        ...current,
                        category: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-slate-600">Fecha y hora</span>
                  <input
                    type="datetime-local"
                    value={transactionForm.occurredAt}
                    onChange={(event) =>
                      setTransactionForm((current) => ({
                        ...current,
                        occurredAt: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm text-slate-600">Metodo de pago</span>
                  <input
                    value={transactionForm.paymentMethod}
                    onChange={(event) =>
                      setTransactionForm((current) => ({
                        ...current,
                        paymentMethod: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-slate-600">Referencia</span>
                  <input
                    value={transactionForm.reference}
                    onChange={(event) =>
                      setTransactionForm((current) => ({
                        ...current,
                        reference: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm text-slate-600">Nota</span>
                <textarea
                  value={transactionForm.note}
                  onChange={(event) =>
                    setTransactionForm((current) => ({
                      ...current,
                      note: event.target.value
                    }))
                  }
                  className="min-h-28 rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setTransactionModalOpen(false)}
                  className="rounded-full border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:border-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
                >
                  Registrar transaccion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <datalist id="dashboard-categories">
        {categories.map((category) => (
          <option key={category.id} value={category.name} />
        ))}
      </datalist>

      {notice && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-lg">
          {notice}
        </div>
      )}
    </div>
  );
}
