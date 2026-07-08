import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Boxes,
  ImagePlus,
  LayoutGrid,
  Loader2,
  LogOut,
  Menu,
  Package,
  Pencil,
  Plus,
  Search,
  Star,
  Store,
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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import AnalyticsPanel from './Admin/AnalyticsPanel';

type TabId =
  | 'overview'
  | 'inventory'
  | 'featured'
  | 'categories'
  | 'movements'
  | 'treasury'
  | 'analytics';

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
    throw new Error(data?.error || data?.message || 'La solicitud falló');
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [transactions, setTransactions] = useState<TreasuryTransaction[]>([]);
  const [inventorySearch, setInventorySearch] = useState('');
  const [featuredSearch, setFeaturedSearch] = useState('');
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
  const [imageUploading, setImageUploading] = useState(false);
  const [draggingMain, setDraggingMain] = useState(false);
  const fileInputMainRef = useRef<HTMLInputElement>(null);

  async function compressImage(file: File): Promise<File> {
    // No tocar GIFs (perderían la animación).
    if (file.type === 'image/gif') return file;
    const MAX_DIMENSION = 1600;
    const QUALITY = 0.82;
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('No se pudo leer la imagen'));
        image.src = dataUrl;
      });
      let width = img.naturalWidth;
      let height = img.naturalHeight;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return file;
      ctx.drawImage(img, 0, 0, width, height);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/webp', QUALITY)
      );
      // Si la compresión no ayuda (o no produce nada), subir el original.
      if (!blob || blob.size >= file.size) return file;
      const newName = file.name.replace(/\.[^.]+$/, '') + '.webp';
      return new File([blob], newName, { type: 'image/webp' });
    } catch {
      return file; // Ante cualquier fallo, subir el original sin comprimir.
    }
  }

  async function uploadWithRetry(file: File, attempts = 3): Promise<string> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || 'No se pudo subir la imagen');
        }
        return data.url as string;
      } catch (err) {
        lastError = err;
        // Reintentar solo ante fallos transitorios (red/servidor), no ante rechazos definitivos.
        const message = err instanceof Error ? err.message.toLowerCase() : '';
        const isPermanent =
          message.includes('tipo de archivo') ||
          message.includes('no permitido') ||
          message.includes('too large') ||
          message.includes('demasiado grande');
        if (isPermanent || attempt === attempts) break;
        await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
      }
    }
    throw lastError;
  }

  async function handleImageUpload(files: FileList | File[], field: 'image' | 'images') {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;
    const MAX_SIZE = 50 * 1024 * 1024;
    const tooBig = fileArray.find((f) => f.size > MAX_SIZE);
    if (tooBig) {
      setNotice(`"${tooBig.name}" es demasiado grande (máx 50 MB)`);
      return;
    }
    setImageUploading(true);
    const failed: string[] = [];
    try {
      const toUpload = field === 'image' ? [fileArray[0]] : fileArray;
      for (const file of toUpload) {
        try {
          const compressed = await compressImage(file);
          const url = await uploadWithRetry(compressed);
          setProductForm((current) => {
            if (field === 'image') {
              return { ...current, image: url };
            }
            const existing = current.images.trim();
            return { ...current, images: existing ? `${existing}, ${url}` : url };
          });
        } catch (err) {
          const reason = err instanceof Error ? err.message : 'error desconocido';
          failed.push(`${file.name} (${reason})`);
        }
      }
    } finally {
      setImageUploading(false);
      if (failed.length > 0) {
        setNotice(`No se pudieron subir: ${failed.join('; ')}`);
      }
    }
  }

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
      setNotice('Sesión iniciada.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Credenciales inválidas');
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
    setNotice('Sesión cerrada.');
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

  async function toggleFeatured(product: Product) {
    try {
      await getJson(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          stockQuantity: product.stockQuantity,
          image: product.image,
          images: product.images,
          featured: !product.featured
        })
      });
      setNotice(
        product.featured ? 'Producto quitado de destacados.' : 'Producto agregado a destacados.'
      );
      await loadAll();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'No se pudo actualizar el destacado');
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
        setNotice('Categoría actualizada.');
      } else {
        await getJson('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(categoryForm)
        });
        setNotice('Categoría creada.');
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
      setNotice('Transacción registrada.');
      await loadAll();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'No se pudo registrar la transacción');
    }
  }

  async function deleteTransaction(transaction: TreasuryTransaction) {
    if (!window.confirm(`Eliminar la transacción #${transaction.id}?`)) {
      return;
    }

    try {
      await getJson(`/api/treasury/transactions/${transaction.id}`, {
        method: 'DELETE'
      });
      setNotice('Transacción eliminada.');
      await loadAll();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'No se pudo eliminar la transacción');
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
      setNotice('Categoría eliminada.');
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

  const featuredProducts = products.filter((product) => product.featured);

  const featuredCandidates = products.filter((product) => {
    const query = featuredSearch.trim().toLowerCase();

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
      label: 'Resumen',
      icon: <LayoutGrid className="h-4 w-4" />
    },
    {
      id: 'inventory',
      label: 'Inventario',
      icon: <Boxes className="h-4 w-4" />
    },
    {
      id: 'featured',
      label: 'Destacados',
      icon: <Star className="h-4 w-4" />
    },
    {
      id: 'categories',
      label: 'Categorías',
      icon: <Tags className="h-4 w-4" />
    },
    {
      id: 'movements',
      label: 'Movimientos',
      icon: <Package className="h-4 w-4" />
    },
    {
      id: 'treasury',
      label: 'Tesorería',
      icon: <Wallet className="h-4 w-4" />
    },
    {
      id: 'analytics',
      label: 'Analíticas',
      icon: <BarChart3 className="h-4 w-4" />
    }
  ];

  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label ?? '';

  function renderSidebar(onNavigate?: () => void) {
    return (
      <>
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <img
            src="/pasossaludablesstock-logo.jpeg"
            alt="Pasos Saludables Stock"
            className="h-11 w-11 shrink-0 rounded-2xl object-cover ring-2 ring-[#8dc63f]/50"
          />
          <div>
            <p className="text-sm font-semibold text-white">Pasos Saludables</p>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#8dc63f]">
              Panel admin
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  onNavigate?.();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? 'bg-[#8dc63f] text-[#10301f] shadow-[0_10px_24px_rgba(141,198,63,0.35)]'
                    : 'text-white/65 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/65 transition hover:bg-white/10 hover:text-white"
          >
            <Store className="h-[18px] w-[18px]" /> Ver tienda
          </a>
          <button
            type="button"
            onClick={() => {
              handleLogout();
              onNavigate?.();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/65 transition hover:bg-white/10 hover:text-rose-200"
          >
            <LogOut className="h-[18px] w-[18px]" /> Cerrar sesión
          </button>
        </div>
      </>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f8eb]">
        <Loader2 className="h-8 w-8 animate-spin text-[#8dc63f]" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f3f8eb] px-4 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(141,198,63,0.12),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(23,59,45,0.08),_transparent_40%)]" />

        <div className="relative w-full max-w-sm">
          <div className="rounded-[28px] border border-[#dce8c8] bg-white/85 p-8 shadow-[0_20px_60px_rgba(23,59,45,0.12)] backdrop-blur">
            <div className="flex flex-col items-center text-center">
              <img
                src="/pasossaludablesstock-logo.jpeg"
                alt="Pasos Saludables"
                className="h-20 w-auto rounded-2xl object-contain"
              />
              <h1 className="mt-5 text-2xl font-semibold text-[#173b2d]">
                Panel de administración
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#4b5c4f]">
                Ingresá con tus credenciales para continuar.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-7 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-[#173b2d]">Usuario</span>
                <input
                  value={loginForm.username}
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      username: event.target.value
                    }))
                  }
                  className="rounded-2xl border border-[#dce8c8] bg-[#f3f8eb] px-4 py-3 text-[#14231a] outline-none transition placeholder:text-[#a0a89a] focus:border-[#8dc63f] focus:ring-2 focus:ring-[#8dc63f]/20"
                  placeholder="usuario"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-[#173b2d]">Contraseña</span>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      password: event.target.value
                    }))
                  }
                  className="rounded-2xl border border-[#dce8c8] bg-[#f3f8eb] px-4 py-3 text-[#14231a] outline-none transition placeholder:text-[#a0a89a] focus:border-[#8dc63f] focus:ring-2 focus:ring-[#8dc63f]/20"
                  placeholder="••••••••"
                />
              </label>

              <button
                type="submit"
                disabled={loginLoading}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#8dc63f] px-6 py-3 font-semibold text-[#173b2d] transition hover:bg-[#7db52e] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loginLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Entrar
              </button>
            </form>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2 text-center opacity-80">
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#94a494]">
              Desarrollado por
            </span>
            <img
              src="/consultoriadigital-logo.webp"
              alt="Consultoría Digital"
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>

        {notice && (
          <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#173b2d] px-5 py-3 text-sm font-medium text-white shadow-lg">
            {notice}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f1f4f5] text-[#14231a]">
      {/* Sidebar de escritorio (fija, a página completa) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-gradient-to-b from-[#10301f] to-[#173b2d] text-white lg:flex">
        {renderSidebar()}
      </aside>

      {/* Drawer móvil + backdrop */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? '' : 'pointer-events-none'
        }`}
      >
        <div
          onClick={() => setSidebarOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-72 max-w-[82%] flex-col bg-gradient-to-b from-[#10301f] to-[#173b2d] text-white shadow-2xl transition-transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
            className="absolute right-3 top-4 rounded-lg p-1.5 text-white/70 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
          {renderSidebar(() => setSidebarOpen(false))}
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-black/5 bg-white px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
              className="shrink-0 rounded-lg p-2 text-[#173b2d]/60 transition hover:bg-black/5 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="leading-tight">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6f8f2f]">
                Panel admin
              </p>
              <p className="text-sm font-semibold text-[#173b2d]">
                {activeTabLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://consultoriadigital.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-2xl bg-[#173b2d] px-4 py-1.5 shadow-lg ring-1 ring-[#8dc63f]/30 transition hover:ring-[#8dc63f]/60 md:inline-flex"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                Desarrollado por
              </span>
              <img
                src="/consultoriadigital-logo.webp"
                alt="Consultoría Digital"
                className="h-6 w-auto object-contain"
              />
            </a>
            <button
              type="button"
              className="relative rounded-lg p-2 text-[#173b2d]/60 transition hover:bg-black/5"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#8dc63f]" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8dc63f] text-sm font-bold text-[#10301f]">
                A
              </div>
              <div className="hidden text-sm leading-tight sm:block">
                <p className="font-semibold text-[#173b2d]">Admin</p>
                <p className="text-xs text-[#173b2d]/50">
                  Administrador · Pasos Saludables
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#6f8f2f]">
                Operación
              </p>
              <h1 className="mt-2 font-serif text-4xl tracking-tight text-[#173b2d] md:text-5xl">
                {activeTab === 'overview' && 'Lectura completa del negocio'}
                {activeTab === 'inventory' && 'Inventario y productos'}
                {activeTab === 'featured' && 'Carrusel de destacados'}
                {activeTab === 'categories' && 'Estructura de categorías'}
                {activeTab === 'movements' && 'Entradas y salidas de stock'}
                {activeTab === 'treasury' && 'Caja y transacciones'}
                {activeTab === 'analytics' && 'Analíticas de la web'}
              </h1>
            </div>

            <div className="flex flex-wrap gap-3">
              {activeTab === 'inventory' && (
                <button
                  type="button"
                  onClick={openCreateProduct}
                  className="inline-flex items-center gap-2 rounded-full bg-[#8dc63f] px-5 py-3 text-sm font-semibold text-[#173b2d] transition hover:bg-[#7db52e]"
                >
                  <Plus className="h-4 w-4" />
                  Nuevo producto
                </button>
              )}
              {activeTab === 'categories' && (
                <button
                  type="button"
                  onClick={openCreateCategory}
                  className="inline-flex items-center gap-2 rounded-full bg-[#8dc63f] px-5 py-3 text-sm font-semibold text-[#173b2d] transition hover:bg-[#7db52e]"
                >
                  <Plus className="h-4 w-4" />
                  Nueva categoria
                </button>
              )}
              {activeTab === 'movements' && (
                <button
                  type="button"
                  onClick={openCreateMovement}
                  className="inline-flex items-center gap-2 rounded-full bg-[#8dc63f] px-5 py-3 text-sm font-semibold text-[#173b2d] transition hover:bg-[#7db52e]"
                >
                  <Plus className="h-4 w-4" />
                  Nuevo movimiento
                </button>
              )}
              {activeTab === 'treasury' && (
                <button
                  type="button"
                  onClick={openCreateTransaction}
                  className="inline-flex items-center gap-2 rounded-full bg-[#8dc63f] px-5 py-3 text-sm font-semibold text-[#173b2d] transition hover:bg-[#7db52e]"
                >
                  <Plus className="h-4 w-4" />
                  Nueva transacción
                </button>
              )}
            </div>
          </div>

          {loading && !snapshot ? (
            <div className="flex h-72 items-center justify-center rounded-[28px] border border-[#dce8c8] bg-white">
              <Loader2 className="h-8 w-8 animate-spin text-[#8dc63f]" />
            </div>
          ) : null}

          {snapshot && activeTab === 'overview' && (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
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
                    detail: `${snapshot.summary.totalCategories} categorías`,
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
                    className="min-w-0 rounded-[26px] border border-[#dce8c8] bg-white p-5 shadow-[0_16px_40px_rgba(23,59,45,0.06)]"
                  >
                    <p className="text-sm text-[#6b7a6b]">{card.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-[#173b2d]">
                      {card.value}
                    </p>
                    <p className="mt-2 text-sm text-[#6f8f2f]">{card.detail}</p>
                  </article>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <section className="rounded-[28px] border border-[#dce8c8] bg-white p-6 shadow-[0_16px_40px_rgba(23,59,45,0.05)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                        Finanzas
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-[#173b2d]">
                        Flujo mensual
                      </h2>
                    </div>
                    <BarChart3 className="h-5 w-5 text-[#94a494]" />
                  </div>

                  <div className="mt-6 h-72 min-w-0">
                    {snapshot.monthlyFinance.length === 0 ? (
                      <div className="flex h-full items-center justify-center rounded-3xl bg-[#f3f8eb]">
                        <p className="text-sm text-[#6b7a6b]">
                          Sin movimientos financieros todavía.
                        </p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={snapshot.monthlyFinance} barGap={4}>
                          <CartesianGrid
                            strokeDasharray="4 4"
                            stroke="#e3ecd2"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="month"
                            tick={{ fontSize: 12, fill: '#6b7a6b' }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fontSize: 12, fill: '#6b7a6b' }}
                            axisLine={false}
                            tickLine={false}
                            width={52}
                            tickFormatter={(value) =>
                              formatCompactNumber(Number(value))
                            }
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: 16,
                              border: '1px solid #dce8c8',
                              boxShadow: '0 16px 40px rgba(23,59,45,0.14)',
                              fontSize: 13
                            }}
                            formatter={(value, name) => [
                              formatPriceARS(Number(value)),
                              name
                            ]}
                            cursor={{ fill: 'rgba(141,198,63,0.08)' }}
                          />
                          <Legend wrapperStyle={{ fontSize: 13 }} />
                          <Bar
                            dataKey="income"
                            name="Ingresos"
                            fill="#8dc63f"
                            radius={[6, 6, 0, 0]}
                          />
                          <Bar
                            dataKey="expense"
                            name="Egresos"
                            fill="#173b2d"
                            radius={[6, 6, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </section>

                <section className="grid gap-6">
                  <article className="rounded-[28px] border border-[#dce8c8] bg-white p-6 shadow-[0_16px_40px_rgba(23,59,45,0.05)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                          Tesorería
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-[#173b2d]">
                          Ingresos vs egresos
                        </h2>
                      </div>
                      <Wallet className="h-5 w-5 text-[#94a494]" />
                    </div>

                    <div className="mt-6 grid gap-4">
                      <div className="rounded-3xl bg-[#f0f8e4] p-4">
                        <div className="flex items-center gap-3">
                          <ArrowUpRight className="h-5 w-5 text-[#6f8f2f]" />
                          <div>
                            <p className="text-sm text-[#173b2d]">Ingresos</p>
                            <p className="mt-1 text-2xl font-semibold text-[#173b2d]">
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

                  <article className="rounded-[28px] border border-[#dce8c8] bg-white p-6 shadow-[0_16px_40px_rgba(23,59,45,0.05)]">
                    <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                      Egresos del mes
                    </p>
                    <div className="mt-5 grid gap-3">
                      {snapshot.expenseBreakdown.length === 0 ? (
                        <p className="text-sm text-[#6b7a6b]">
                          No hay egresos registrados este mes.
                        </p>
                      ) : (
                        snapshot.expenseBreakdown.map((item) => (
                          <div
                            key={item.category}
                            className="flex items-center justify-between rounded-2xl bg-[#eef4e0] px-4 py-3"
                          >
                            <span className="text-sm font-medium text-[#4b5c4f]">
                              {item.category}
                            </span>
                            <span className="text-sm font-semibold text-[#173b2d]">
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
                <article className="rounded-[28px] border border-[#dce8c8] bg-white p-6 shadow-[0_16px_40px_rgba(23,59,45,0.05)]">
                  <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                    Top stock
                  </p>
                  <div className="mt-5 grid gap-3">
                    {snapshot.topStock.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl bg-[#eef4e0] px-4 py-3"
                      >
                        <p className="font-medium text-[#14231a]">{item.name}</p>
                        <p className="mt-1 text-sm text-[#6b7a6b]">
                          {item.stockQuantity} unidades
                        </p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-[28px] border border-[#dce8c8] bg-white p-6 shadow-[0_16px_40px_rgba(23,59,45,0.05)]">
                  <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                    Stock bajo
                  </p>
                  <div className="mt-5 grid gap-3">
                    {snapshot.lowStock.length === 0 ? (
                      <p className="text-sm text-[#6b7a6b]">
                        No hay alertas de stock bajo.
                      </p>
                    ) : (
                      snapshot.lowStock.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl bg-amber-50 px-4 py-3"
                        >
                          <p className="font-medium text-[#14231a]">{item.name}</p>
                          <p className="mt-1 text-sm text-amber-900">
                            {item.stockQuantity} unidades
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </article>

                <article className="rounded-[28px] border border-[#dce8c8] bg-white p-6 shadow-[0_16px_40px_rgba(23,59,45,0.05)]">
                  <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                    Movimientos recientes
                  </p>
                  <div className="mt-5 grid gap-4">
                    {snapshot.recentMovements.map((movement) => (
                      <div key={movement.id} className="rounded-2xl bg-[#eef4e0] px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-[#14231a]">
                            {movement.productName}
                          </p>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              movement.movementType === 'OUT'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-[#e8f5d0] text-[#6f8f2f]'
                            }`}
                          >
                            {movement.movementType}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-[#4b5c4f]">{movement.reason}</p>
                        <p className="mt-2 text-xs text-[#94a494]">
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
              <div className="rounded-[28px] border border-[#dce8c8] bg-white p-5 shadow-[0_16px_40px_rgba(23,59,45,0.05)]">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a494]" />
                  <input
                    value={inventorySearch}
                    onChange={(event) => setInventorySearch(event.target.value)}
                    placeholder="Buscar producto por nombre, descripción o categoria"
                    className="w-full rounded-full border border-[#dce8c8] bg-[#f3f8eb] px-12 py-3 text-sm text-[#14231a] outline-none transition focus:border-[#8dc63f]"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="flex items-center gap-4 rounded-[20px] border border-[#dce8c8] bg-white p-4 shadow-[0_8px_24px_rgba(23,59,45,0.04)]"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-[#eef4e0]">
                      {productImage(product) ? (
                        <img
                          src={productImage(product)}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.22),_transparent_55%),linear-gradient(135deg,_#14231a_0%,_#111827_52%,_#052e16_100%)]">
                          <Package className="h-8 w-8 text-[#8dc63f]" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-lg font-semibold text-[#173b2d]">
                          {product.name}
                        </h3>
                        <span className="rounded-full bg-[#eef4e0] px-2.5 py-0.5 text-xs font-semibold text-[#4b5c4f]">
                          {product.category}
                        </span>
                        {product.featured && (
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                            Destacado
                          </span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-1 text-sm leading-5 text-[#4b5c4f]">
                        {product.description}
                      </p>
                    </div>

                    <div className="hidden flex-shrink-0 text-right sm:block">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#94a494]">
                        Precio
                      </p>
                      <p className="mt-1 text-lg font-semibold text-[#173b2d]">
                        {formatPriceARS(product.price)}
                      </p>
                    </div>

                    <div
                      className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        product.stockQuantity <= 5
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#e8f5d0] text-[#173b2d]'
                      }`}
                    >
                      Stock {product.stockQuantity}
                    </div>

                    <div className="flex flex-shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => openEditProduct(product)}
                        className="rounded-full border border-[#dce8c8] p-2.5 text-[#4b5c4f] transition hover:border-[#8dc63f] hover:text-[#6f8f2f]"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(product)}
                        className="rounded-full border border-[#dce8c8] p-2.5 text-[#4b5c4f] transition hover:border-rose-300 hover:text-rose-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="rounded-[28px] border border-dashed border-[#dce8c8] bg-white px-8 py-16 text-center">
                  <p className="text-lg font-semibold text-[#14231a]">
                    No hay productos para ese filtro.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'featured' && (
            <div className="grid gap-6">
              <div className="rounded-[28px] border border-[#dce8c8] bg-white p-6 shadow-[0_16px_40px_rgba(23,59,45,0.05)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                      Carrusel de la web
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#173b2d]">
                      Productos destacados
                    </h2>
                    <p className="mt-1 text-sm text-[#6b7a6b]">
                      Elegí qué productos aparecen en el carrusel de destacados de la tienda.
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
                    {featuredProducts.length} en el carrusel
                  </span>
                </div>

                <div className="mt-6 grid gap-3">
                  {featuredProducts.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#dce8c8] bg-[#f3f8eb] px-6 py-10 text-center">
                      <Star className="mx-auto h-8 w-8 text-[#94a494]" />
                      <p className="mt-3 text-sm font-medium text-[#4b5c4f]">
                        Todavía no hay productos destacados. Agregalos desde la lista de abajo.
                      </p>
                    </div>
                  ) : (
                    featuredProducts.map((product) => (
                      <article
                        key={product.id}
                        className="flex items-center gap-4 rounded-[20px] border border-amber-200 bg-amber-50/50 p-4"
                      >
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-[#eef4e0]">
                          {productImage(product) ? (
                            <img
                              src={productImage(product)}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="h-6 w-6 text-[#8dc63f]" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-semibold text-[#173b2d]">
                            {product.name}
                          </h3>
                          <p className="mt-0.5 text-sm text-[#6b7a6b]">
                            {product.category} · {formatPriceARS(product.price)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleFeatured(product)}
                          className="inline-flex flex-shrink-0 items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50"
                        >
                          <X className="h-4 w-4" />
                          Quitar
                        </button>
                      </article>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#dce8c8] bg-white p-6 shadow-[0_16px_40px_rgba(23,59,45,0.05)]">
                <h2 className="text-2xl font-semibold text-[#173b2d]">
                  Agregar productos al carrusel
                </h2>
                <p className="mt-1 text-sm text-[#6b7a6b]">
                  Buscá un producto y agregalo o quitalo del carrusel de destacados.
                </p>

                <label className="relative mt-5 block">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a494]" />
                  <input
                    value={featuredSearch}
                    onChange={(event) => setFeaturedSearch(event.target.value)}
                    placeholder="Buscar producto por nombre, descripción o categoria"
                    className="w-full rounded-full border border-[#dce8c8] bg-[#f3f8eb] px-12 py-3 text-sm text-[#14231a] outline-none transition focus:border-[#8dc63f]"
                  />
                </label>

                <div className="mt-6 flex flex-col gap-3">
                  {featuredCandidates.map((product) => (
                    <article
                      key={product.id}
                      className="flex items-center gap-4 rounded-[20px] border border-[#dce8c8] bg-white p-4"
                    >
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-[#eef4e0]">
                        {productImage(product) ? (
                          <img
                            src={productImage(product)}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package className="h-6 w-6 text-[#8dc63f]" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-semibold text-[#173b2d]">
                            {product.name}
                          </h3>
                          {product.featured && (
                            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                              En el carrusel
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-[#6b7a6b]">
                          {product.category} · {formatPriceARS(product.price)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleFeatured(product)}
                        className={`inline-flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                          product.featured
                            ? 'border border-rose-200 text-rose-700 hover:border-rose-300 hover:bg-rose-50'
                            : 'bg-[#8dc63f] text-[#173b2d] hover:bg-[#7db52e]'
                        }`}
                      >
                        {product.featured ? (
                          <>
                            <X className="h-4 w-4" />
                            Quitar
                          </>
                        ) : (
                          <>
                            <Star className="h-4 w-4" />
                            Destacar
                          </>
                        )}
                      </button>
                    </article>
                  ))}

                  {featuredCandidates.length === 0 && (
                    <div className="rounded-[20px] border border-dashed border-[#dce8c8] bg-[#f3f8eb] px-6 py-10 text-center">
                      <p className="text-sm font-medium text-[#4b5c4f]">
                        No hay productos para ese filtro.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <article className="rounded-[28px] border border-[#dce8c8] bg-white p-6 shadow-[0_16px_40px_rgba(23,59,45,0.05)]">
                <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                  Distribución
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#173b2d]">
                  Categorías con más peso
                </h2>
                <div className="mt-6 grid gap-3">
                  {snapshot?.categoryDistribution.map((item) => (
                    <div
                      key={item.category}
                      className="rounded-2xl bg-[#eef4e0] px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-[#14231a]">{item.category}</p>
                        <span className="text-sm font-semibold text-[#173b2d]">
                          {item.units} unidades
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[#6b7a6b]">
                        {item.products} productos
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[28px] border border-[#dce8c8] bg-white p-6 shadow-[0_16px_40px_rgba(23,59,45,0.05)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                      Gestion
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#173b2d]">
                      Categorías cargadas
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={openCreateCategory}
                    className="inline-flex items-center gap-2 rounded-full bg-[#173b2d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f2a1d]"
                  >
                    <Plus className="h-4 w-4" />
                    Crear
                  </button>
                </div>

                <div className="mt-6 grid gap-3">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-start justify-between gap-4 rounded-2xl bg-[#eef4e0] px-4 py-4"
                    >
                      <div>
                        <p className="font-semibold text-[#173b2d]">{category.name}</p>
                        <p className="mt-1 text-sm text-[#6b7a6b]">
                          {category.description || 'Sin descripción.'}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditCategory(category)}
                          className="rounded-full border border-[#dce8c8] p-3 text-[#4b5c4f] transition hover:border-[#8dc63f] hover:text-[#6f8f2f]"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCategory(category)}
                          className="rounded-full border border-[#dce8c8] p-3 text-[#4b5c4f] transition hover:border-rose-300 hover:text-rose-700"
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
              <article className="rounded-[28px] border border-[#dce8c8] bg-white p-6 shadow-[0_16px_40px_rgba(23,59,45,0.05)]">
                <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                  Tendencia
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#173b2d]">
                  Entradas y salidas de 14 dias
                </h2>
                <div className="mt-6 grid gap-3">
                  {snapshot?.movementTrend.map((point) => (
                    <div
                      key={point.day}
                      className="rounded-2xl bg-[#eef4e0] px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-[#14231a]">
                          {formatDateLabel(point.day)}
                        </p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-[#6f8f2f]">
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

              <article className="rounded-[28px] border border-[#dce8c8] bg-white p-6 shadow-[0_16px_40px_rgba(23,59,45,0.05)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                      Registro
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#173b2d]">
                      Últimos movimientos
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={openCreateMovement}
                    className="inline-flex items-center gap-2 rounded-full bg-[#173b2d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f2a1d]"
                  >
                    <Plus className="h-4 w-4" />
                    Cargar
                  </button>
                </div>

                <div className="mt-6 grid gap-3">
                  {movements.map((movement) => (
                    <div
                      key={movement.id}
                      className="rounded-2xl bg-[#eef4e0] px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-[#173b2d]">
                            {movement.productName}
                          </p>
                          <p className="mt-1 text-sm text-[#6b7a6b]">
                            {movement.reason}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            movement.movementType === 'OUT'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-[#e8f5d0] text-[#6f8f2f]'
                          }`}
                        >
                          {movement.movementType} · {movement.quantity}
                        </span>
                      </div>
                      {movement.note && (
                        <p className="mt-3 text-sm text-[#4b5c4f]">{movement.note}</p>
                      )}
                      <p className="mt-3 text-xs text-[#94a494]">
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
              <article className="rounded-[28px] border border-[#dce8c8] bg-white p-6 shadow-[0_16px_40px_rgba(23,59,45,0.05)]">
                <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                  Balance
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#173b2d]">
                  Caja del mes
                </h2>
                <div className="mt-6 grid gap-4">
                  <div className="rounded-3xl bg-[#f0f8e4] p-5">
                    <p className="text-sm text-[#173b2d]">Ingresos</p>
                    <p className="mt-2 text-3xl font-semibold text-[#173b2d]">
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
                  <div className="rounded-3xl bg-[#173b2d] p-5 text-white">
                    <p className="text-sm text-[#b8d986]">Balance</p>
                    <p className="mt-2 text-3xl font-semibold">
                      {snapshot
                        ? formatPriceARS(snapshot.summary.treasuryBalance)
                        : formatPriceARS(0)}
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-[28px] border border-[#dce8c8] bg-white p-6 shadow-[0_16px_40px_rgba(23,59,45,0.05)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                      Registro
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#173b2d]">
                      Últimas transacciones
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={openCreateTransaction}
                    className="inline-flex items-center gap-2 rounded-full bg-[#173b2d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f2a1d]"
                  >
                    <Plus className="h-4 w-4" />
                    Cargar
                  </button>
                </div>

                <div className="mt-6 grid gap-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="rounded-2xl bg-[#eef4e0] px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-[#173b2d]">
                            {transaction.category}
                          </p>
                          <p className="mt-1 text-sm text-[#6b7a6b]">
                            {transaction.transactionType}
                            {transaction.reference ? ` · ${transaction.reference}` : ''}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <p className="text-right text-sm font-semibold text-[#173b2d]">
                            {formatPriceARS(transaction.amount)}
                          </p>
                          <button
                            type="button"
                            onClick={() => deleteTransaction(transaction)}
                            className="rounded-full border border-[#dce8c8] p-3 text-[#4b5c4f] transition hover:border-rose-300 hover:text-rose-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {transaction.note && (
                        <p className="mt-3 text-sm text-[#4b5c4f]">{transaction.note}</p>
                      )}
                      <p className="mt-3 text-xs text-[#94a494]">
                        {formatDateTimeLabel(transaction.occurredAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          )}

          {activeTab === 'analytics' && <AnalyticsPanel />}
        </main>
      </div>

      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173b2d]/60 p-4 backdrop-blur-sm">
          <div className="flex w-full max-w-3xl flex-col rounded-[28px] bg-white shadow-[0_40px_120px_rgba(23,59,45,0.22)]" style={{maxHeight: 'calc(100vh - 2rem)'}}>
            <div className="flex items-start justify-between gap-4 px-8 pt-8 pb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                  Producto
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-[#173b2d]">
                  {editingProduct ? 'Editar producto' : 'Nuevo producto'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="rounded-full bg-[#173b2d] p-2 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={submitProduct} className="flex flex-col gap-5 overflow-y-auto px-8 pb-2">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm text-[#4b5c4f]">Nombre</span>
                  <input
                    value={productForm.name}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        name: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-[#dce8c8] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-[#4b5c4f]">Categoría</span>
                  <input
                    list="dashboard-categories"
                    value={productForm.category}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        category: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-[#dce8c8] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-[#4b5c4f]">Precio</span>
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
                    className="rounded-2xl border border-[#dce8c8] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-[#4b5c4f]">Stock</span>
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
                    className="rounded-2xl border border-[#dce8c8] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                    required
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm text-[#4b5c4f]">Descripción</span>
                <textarea
                  value={productForm.description}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      description: event.target.value
                    }))
                  }
                  className="min-h-32 rounded-2xl border border-[#dce8c8] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                />
              </label>

              {/* Imagen del producto */}
              <div className="grid gap-2">
                <span className="text-sm text-[#4b5c4f]">Imagen del producto</span>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDraggingMain(true); }}
                  onDragLeave={() => setDraggingMain(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDraggingMain(false);
                    if (e.dataTransfer.files.length) handleImageUpload(e.dataTransfer.files, 'image');
                  }}
                  onClick={() => fileInputMainRef.current?.click()}
                  className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition ${draggingMain ? 'border-[#8dc63f] bg-[#f0f7e6]' : 'border-[#dce8c8] hover:border-[#8dc63f] hover:bg-[#fafaf7]'}`}
                >
                  {productForm.image ? (
                    <div className="relative inline-block">
                      <img
                        src={productForm.image}
                        alt="Vista previa"
                        className="mx-auto h-28 w-28 rounded-xl object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setProductForm((c) => ({ ...c, image: '' })); }}
                        className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow-md transition hover:bg-red-50"
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#4b5c4f]">
                      {imageUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-[#8dc63f]" />
                      ) : (
                        <ImagePlus className="h-8 w-8 text-[#8dc63f]" />
                      )}
                      <p className="text-sm font-medium">
                        {imageUploading ? 'Subiendo...' : 'Arrastrar o hacer clic'}
                      </p>
                      <p className="text-xs text-[#94a3b8]">PNG, JPG, WEBP — máx 50 MB</p>
                    </div>
                  )}
                </div>
                <input
                  value={productForm.image}
                  onChange={(event) => setProductForm((c) => ({ ...c, image: event.target.value }))}
                  placeholder="O pegá una URL: https://..."
                  className="min-w-0 flex-1 rounded-2xl border border-[#dce8c8] px-4 py-3 text-sm outline-none transition focus:border-[#8dc63f]"
                />
                <input
                  ref={fileInputMainRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) handleImageUpload(e.target.files, 'image');
                    e.target.value = '';
                  }}
                />
              </div>

              <label className="inline-flex items-center gap-3 rounded-2xl bg-[#eef4e0] px-4 py-3 text-sm font-medium text-[#4b5c4f]">
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

              <div className="flex flex-col gap-3 pb-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="rounded-full border border-[#dce8c8] px-5 py-3 font-medium text-[#4b5c4f] transition hover:border-[#8dc63f]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#173b2d] px-6 py-3 font-semibold text-white transition hover:bg-[#0f2a1d]"
                >
                  Guardar producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173b2d]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[28px] bg-white p-8 shadow-[0_40px_120px_rgba(23,59,45,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                  Categoría
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-[#173b2d]">
                  {editingCategory ? 'Editar categoria' : 'Nueva categoria'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="rounded-full bg-[#173b2d] p-2 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={submitCategory} className="mt-8 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm text-[#4b5c4f]">Nombre</span>
                <input
                  value={categoryForm.name}
                  onChange={(event) =>
                    setCategoryForm((current) => ({
                      ...current,
                      name: event.target.value
                    }))
                  }
                  className="rounded-2xl border border-[#dce8c8] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-[#4b5c4f]">Descripción</span>
                <textarea
                  value={categoryForm.description}
                  onChange={(event) =>
                    setCategoryForm((current) => ({
                      ...current,
                      description: event.target.value
                    }))
                  }
                  className="min-h-28 rounded-2xl border border-[#dce8c8] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="rounded-full border border-[#dce8c8] px-5 py-3 font-medium text-[#4b5c4f] transition hover:border-[#8dc63f]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#173b2d] px-6 py-3 font-semibold text-white transition hover:bg-[#0f2a1d]"
                >
                  Guardar categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {movementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173b2d]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[28px] bg-white p-8 shadow-[0_40px_120px_rgba(23,59,45,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                  Stock
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-[#173b2d]">
                  Nuevo movimiento
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setMovementModalOpen(false)}
                className="rounded-full bg-[#173b2d] p-2 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={submitMovement} className="mt-8 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm text-[#4b5c4f]">Producto</span>
                <select
                  value={movementForm.productId}
                  onChange={(event) =>
                    setMovementForm((current) => ({
                      ...current,
                      productId: event.target.value
                    }))
                  }
                  className="rounded-2xl border border-[#dce8c8] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
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
                  <span className="text-sm text-[#4b5c4f]">Tipo</span>
                  <select
                    value={movementForm.movementType}
                    onChange={(event) =>
                      setMovementForm((current) => ({
                        ...current,
                        movementType: event.target.value as 'IN' | 'OUT'
                      }))
                    }
                    className="rounded-2xl border border-[#dce8c8] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                  >
                    <option value="IN">Ingreso</option>
                    <option value="OUT">Salida</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-[#4b5c4f]">Cantidad</span>
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
                    className="rounded-2xl border border-[#dce8c8] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                    required
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm text-[#4b5c4f]">Motivo</span>
                <input
                  value={movementForm.reason}
                  onChange={(event) =>
                    setMovementForm((current) => ({
                      ...current,
                      reason: event.target.value
                    }))
                  }
                  className="rounded-2xl border border-[#dce8c8] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-[#4b5c4f]">Nota</span>
                <textarea
                  value={movementForm.note}
                  onChange={(event) =>
                    setMovementForm((current) => ({
                      ...current,
                      note: event.target.value
                    }))
                  }
                  className="min-h-28 rounded-2xl border border-[#dce8c8] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setMovementModalOpen(false)}
                  className="rounded-full border border-[#dce8c8] px-5 py-3 font-medium text-[#4b5c4f] transition hover:border-[#8dc63f]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#173b2d] px-6 py-3 font-semibold text-white transition hover:bg-[#0f2a1d]"
                >
                  Registrar movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {transactionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173b2d]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[28px] bg-white p-8 shadow-[0_40px_120px_rgba(23,59,45,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                  Tesorería
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-[#173b2d]">
                  Nueva transacción
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setTransactionModalOpen(false)}
                className="rounded-full bg-[#173b2d] p-2 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={submitTransaction} className="mt-8 grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm text-[#4b5c4f]">Tipo</span>
                  <select
                    value={transactionForm.transactionType}
                    onChange={(event) =>
                      setTransactionForm((current) => ({
                        ...current,
                        transactionType: event.target.value as TransactionFormState['transactionType']
                      }))
                    }
                    className="rounded-2xl border border-[#dce8c8] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
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
                  <span className="text-sm text-[#4b5c4f]">Monto</span>
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
                    className="rounded-2xl border border-[#dce8c8] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm text-[#4b5c4f]">Categoría</span>
                  <input
                    value={transactionForm.category}
                    onChange={(event) =>
                      setTransactionForm((current) => ({
                        ...current,
                        category: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-[#dce8c8] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-[#4b5c4f]">Fecha y hora</span>
                  <input
                    type="datetime-local"
                    value={transactionForm.occurredAt}
                    onChange={(event) =>
                      setTransactionForm((current) => ({
                        ...current,
                        occurredAt: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-[#dce8c8] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm text-[#4b5c4f]">Metodo de pago</span>
                  <input
                    value={transactionForm.paymentMethod}
                    onChange={(event) =>
                      setTransactionForm((current) => ({
                        ...current,
                        paymentMethod: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-[#dce8c8] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-[#4b5c4f]">Referencia</span>
                  <input
                    value={transactionForm.reference}
                    onChange={(event) =>
                      setTransactionForm((current) => ({
                        ...current,
                        reference: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-[#dce8c8] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm text-[#4b5c4f]">Nota</span>
                <textarea
                  value={transactionForm.note}
                  onChange={(event) =>
                    setTransactionForm((current) => ({
                      ...current,
                      note: event.target.value
                    }))
                  }
                  className="min-h-28 rounded-2xl border border-[#dce8c8] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setTransactionModalOpen(false)}
                  className="rounded-full border border-[#dce8c8] px-5 py-3 font-medium text-[#4b5c4f] transition hover:border-[#8dc63f]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#173b2d] px-6 py-3 font-semibold text-white transition hover:bg-[#0f2a1d]"
                >
                  Registrar transacción
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
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#173b2d] px-5 py-3 text-sm font-medium text-white shadow-lg">
          {notice}
        </div>
      )}
    </div>
  );
}
