import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  ImagePlus,
  LayoutGrid,
  Loader2,
  LogOut,
  Package,
  Pencil,
  Plus,
  Search,
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
import AnalyticsPanel from './Admin/AnalyticsPanel';

type TabId = 'overview' | 'inventory' | 'categories' | 'movements' | 'treasury' | 'analytics';

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
    },
    {
      id: 'analytics',
      label: 'Analiticz',
      icon: <BarChart3 className="h-4 w-4" />
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
      <div className="flex min-h-screen items-center justify-center bg-[#f8f4ea]">
        <Loader2 className="h-8 w-8 animate-spin text-[#8dc63f]" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f4ea] px-4 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(141,198,63,0.12),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(23,59,45,0.08),_transparent_40%)]" />

        <div className="relative w-full max-w-sm">
          <div className="rounded-[32px] border border-[#dce2cd] bg-white/85 p-8 shadow-[0_20px_60px_rgba(23,59,45,0.12)] backdrop-blur">
            <div className="flex flex-col items-center text-center">
              <img
                src="/pasossaludablesstock-logo.jpeg"
                alt="Pasos Saludables"
                className="h-20 w-auto rounded-2xl object-contain"
              />
              <h1 className="mt-5 text-2xl font-semibold text-[#173b2d]">
                Panel de administración
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#475569]">
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
                  className="rounded-2xl border border-[#dce2cd] bg-[#f8f4ea] px-4 py-3 text-[#0f172a] outline-none transition placeholder:text-[#a0a89a] focus:border-[#8dc63f] focus:ring-2 focus:ring-[#8dc63f]/20"
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
                  className="rounded-2xl border border-[#dce2cd] bg-[#f8f4ea] px-4 py-3 text-[#0f172a] outline-none transition placeholder:text-[#a0a89a] focus:border-[#8dc63f] focus:ring-2 focus:ring-[#8dc63f]/20"
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
    <div className="min-h-screen bg-[#f8f4ea] text-[#0f172a]">
      <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col lg:flex-row">
        <aside className="border-b border-[#dce2cd] bg-white/90 px-4 py-5 backdrop-blur lg:min-h-screen lg:w-80 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
          <div className="flex items-center gap-3">
            <img
              src="/pasossaludablesstock-logo.jpeg"
              alt="Pasos Saludables Stock"
              className="h-11 w-auto rounded-xl object-contain"
            />
            <div>
              <p className="font-semibold text-[#173b2d]">Pasos Saludables</p>
              <p className="text-xs uppercase tracking-[0.28em] text-[#6f8f2f]">
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
                      ? 'bg-[#173b2d] text-white shadow-sm'
                      : 'text-[#475569] hover:bg-[#f0ede6] hover:text-[#173b2d]'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-8 rounded-[28px] bg-[#173b2d] p-5 text-white">
            <p className="text-sm uppercase tracking-[0.22em] text-[#8dc63f]">
              Origen de datos
            </p>
            <p className="mt-3 text-2xl font-semibold">
              Base PasosSaludablesStock
            </p>
            <p className="mt-3 text-sm leading-6 text-[#a8c49a]">
              Productos, categorias, movimientos y tesoreria salen de la misma
              base.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#dce2cd] px-4 py-2 text-sm font-medium text-[#475569] transition hover:border-rose-300 hover:text-rose-700"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesion
          </button>
        </aside>

        <section className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#6f8f2f]">
                Operacion
              </p>
              <h1 className="mt-2 font-serif text-4xl tracking-tight text-[#173b2d] md:text-5xl">
                {activeTab === 'overview' && 'Lectura completa del negocio'}
                {activeTab === 'inventory' && 'Inventario y productos'}
                {activeTab === 'categories' && 'Estructura de categorias'}
                {activeTab === 'movements' && 'Entradas y salidas de stock'}
                {activeTab === 'treasury' && 'Caja y transacciones'}
                {activeTab === 'analytics' && 'Analiticas de la web'}
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
                  Nueva transaccion
                </button>
              )}
            </div>
          </div>

          {loading && !snapshot ? (
            <div className="flex h-72 items-center justify-center rounded-[32px] border border-[#dce2cd] bg-white">
              <Loader2 className="h-8 w-8 animate-spin text-[#8dc63f]" />
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
                    className="rounded-[30px] border border-[#dce2cd] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
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
                <section className="rounded-[32px] border border-[#dce2cd] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
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
                              className="w-5 rounded-full bg-[#8dc63f]"
                              style={{ height: `${incomeHeight}px` }}
                              title={`Ingresos ${formatPriceARS(point.income)}`}
                            />
                            <div
                              className="w-5 rounded-full bg-[#dce2cd]"
                              style={{ height: `${expenseHeight}px` }}
                              title={`Egresos ${formatPriceARS(point.expense)}`}
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-[#0f172a]">
                              {point.month}
                            </p>
                            <p className="mt-1 text-xs text-[#6b7a6b]">
                              {formatPriceARS(point.income)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="grid gap-6">
                  <article className="rounded-[32px] border border-[#dce2cd] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                          Tesoreria
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

                  <article className="rounded-[32px] border border-[#dce2cd] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
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
                            className="flex items-center justify-between rounded-2xl bg-[#f0ede6] px-4 py-3"
                          >
                            <span className="text-sm font-medium text-[#475569]">
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
                <article className="rounded-[32px] border border-[#dce2cd] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                  <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                    Top stock
                  </p>
                  <div className="mt-5 grid gap-3">
                    {snapshot.topStock.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl bg-[#f0ede6] px-4 py-3"
                      >
                        <p className="font-medium text-[#0f172a]">{item.name}</p>
                        <p className="mt-1 text-sm text-[#6b7a6b]">
                          {item.stockQuantity} unidades
                        </p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-[32px] border border-[#dce2cd] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
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
                          <p className="font-medium text-[#0f172a]">{item.name}</p>
                          <p className="mt-1 text-sm text-amber-900">
                            {item.stockQuantity} unidades
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </article>

                <article className="rounded-[32px] border border-[#dce2cd] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                  <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                    Movimientos recientes
                  </p>
                  <div className="mt-5 grid gap-4">
                    {snapshot.recentMovements.map((movement) => (
                      <div key={movement.id} className="rounded-2xl bg-[#f0ede6] px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-[#0f172a]">
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
                        <p className="mt-2 text-sm text-[#475569]">{movement.reason}</p>
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
              <div className="rounded-[32px] border border-[#dce2cd] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a494]" />
                  <input
                    value={inventorySearch}
                    onChange={(event) => setInventorySearch(event.target.value)}
                    placeholder="Buscar producto por nombre, descripcion o categoria"
                    className="w-full rounded-full border border-[#dce2cd] bg-[#f8f4ea] px-12 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#8dc63f]"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="flex items-center gap-4 rounded-[20px] border border-[#dce2cd] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-[#f0ede6]">
                      {productImage(product) ? (
                        <img
                          src={productImage(product)}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.22),_transparent_55%),linear-gradient(135deg,_#0f172a_0%,_#111827_52%,_#052e16_100%)]">
                          <Package className="h-8 w-8 text-[#8dc63f]" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-lg font-semibold text-[#173b2d]">
                          {product.name}
                        </h3>
                        <span className="rounded-full bg-[#f0ede6] px-2.5 py-0.5 text-xs font-semibold text-[#475569]">
                          {product.category}
                        </span>
                        {product.featured && (
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                            Destacado
                          </span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-1 text-sm leading-5 text-[#475569]">
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
                        className="rounded-full border border-[#dce2cd] p-2.5 text-[#475569] transition hover:border-[#8dc63f] hover:text-[#6f8f2f]"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(product)}
                        className="rounded-full border border-[#dce2cd] p-2.5 text-[#475569] transition hover:border-rose-300 hover:text-rose-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="rounded-[32px] border border-dashed border-[#dce2cd] bg-white px-8 py-16 text-center">
                  <p className="text-lg font-semibold text-[#0f172a]">
                    No hay productos para ese filtro.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <article className="rounded-[32px] border border-[#dce2cd] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                  Distribucion
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#173b2d]">
                  Categorias con mas peso
                </h2>
                <div className="mt-6 grid gap-3">
                  {snapshot?.categoryDistribution.map((item) => (
                    <div
                      key={item.category}
                      className="rounded-2xl bg-[#f0ede6] px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-[#0f172a]">{item.category}</p>
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

              <article className="rounded-[32px] border border-[#dce2cd] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                      Gestion
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#173b2d]">
                      Categorias cargadas
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
                      className="flex items-start justify-between gap-4 rounded-2xl bg-[#f0ede6] px-4 py-4"
                    >
                      <div>
                        <p className="font-semibold text-[#173b2d]">{category.name}</p>
                        <p className="mt-1 text-sm text-[#6b7a6b]">
                          {category.description || 'Sin descripcion.'}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditCategory(category)}
                          className="rounded-full border border-[#dce2cd] p-3 text-[#475569] transition hover:border-[#8dc63f] hover:text-[#6f8f2f]"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCategory(category)}
                          className="rounded-full border border-[#dce2cd] p-3 text-[#475569] transition hover:border-rose-300 hover:text-rose-700"
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
              <article className="rounded-[32px] border border-[#dce2cd] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
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
                      className="rounded-2xl bg-[#f0ede6] px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-[#0f172a]">
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

              <article className="rounded-[32px] border border-[#dce2cd] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                      Registro
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#173b2d]">
                      Ultimos movimientos
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
                      className="rounded-2xl bg-[#f0ede6] px-4 py-4"
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
                        <p className="mt-3 text-sm text-[#475569]">{movement.note}</p>
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
              <article className="rounded-[32px] border border-[#dce2cd] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
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
                    <p className="text-sm text-[#a8c49a]">Balance</p>
                    <p className="mt-2 text-3xl font-semibold">
                      {snapshot
                        ? formatPriceARS(snapshot.summary.treasuryBalance)
                        : formatPriceARS(0)}
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-[32px] border border-[#dce2cd] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                      Registro
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#173b2d]">
                      Ultimas transacciones
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
                      className="rounded-2xl bg-[#f0ede6] px-4 py-4"
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
                            className="rounded-full border border-[#dce2cd] p-3 text-[#475569] transition hover:border-rose-300 hover:text-rose-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {transaction.note && (
                        <p className="mt-3 text-sm text-[#475569]">{transaction.note}</p>
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
        </section>
      </div>

      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173b2d]/60 p-4 backdrop-blur-sm">
          <div className="flex w-full max-w-3xl flex-col rounded-[32px] bg-white shadow-[0_40px_120px_rgba(15,23,42,0.22)]" style={{maxHeight: 'calc(100vh - 2rem)'}}>
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
                  <span className="text-sm text-[#475569]">Nombre</span>
                  <input
                    value={productForm.name}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        name: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-[#dce2cd] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-[#475569]">Categoria</span>
                  <input
                    list="dashboard-categories"
                    value={productForm.category}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        category: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-[#dce2cd] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-[#475569]">Precio</span>
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
                    className="rounded-2xl border border-[#dce2cd] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-[#475569]">Stock</span>
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
                    className="rounded-2xl border border-[#dce2cd] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                    required
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm text-[#475569]">Descripcion</span>
                <textarea
                  value={productForm.description}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      description: event.target.value
                    }))
                  }
                  className="min-h-32 rounded-2xl border border-[#dce2cd] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                />
              </label>

              {/* Imagen del producto */}
              <div className="grid gap-2">
                <span className="text-sm text-[#475569]">Imagen del producto</span>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDraggingMain(true); }}
                  onDragLeave={() => setDraggingMain(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDraggingMain(false);
                    if (e.dataTransfer.files.length) handleImageUpload(e.dataTransfer.files, 'image');
                  }}
                  onClick={() => fileInputMainRef.current?.click()}
                  className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition ${draggingMain ? 'border-[#8dc63f] bg-[#f0f7e6]' : 'border-[#dce2cd] hover:border-[#8dc63f] hover:bg-[#fafaf7]'}`}
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
                    <div className="flex flex-col items-center gap-2 text-[#475569]">
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
                  className="min-w-0 flex-1 rounded-2xl border border-[#dce2cd] px-4 py-3 text-sm outline-none transition focus:border-[#8dc63f]"
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

              <label className="inline-flex items-center gap-3 rounded-2xl bg-[#f0ede6] px-4 py-3 text-sm font-medium text-[#475569]">
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
                  className="rounded-full border border-[#dce2cd] px-5 py-3 font-medium text-[#475569] transition hover:border-[#8dc63f]"
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
          <div className="w-full max-w-xl rounded-[32px] bg-white p-8 shadow-[0_40px_120px_rgba(15,23,42,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                  Categoria
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
                <span className="text-sm text-[#475569]">Nombre</span>
                <input
                  value={categoryForm.name}
                  onChange={(event) =>
                    setCategoryForm((current) => ({
                      ...current,
                      name: event.target.value
                    }))
                  }
                  className="rounded-2xl border border-[#dce2cd] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-[#475569]">Descripcion</span>
                <textarea
                  value={categoryForm.description}
                  onChange={(event) =>
                    setCategoryForm((current) => ({
                      ...current,
                      description: event.target.value
                    }))
                  }
                  className="min-h-28 rounded-2xl border border-[#dce2cd] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="rounded-full border border-[#dce2cd] px-5 py-3 font-medium text-[#475569] transition hover:border-[#8dc63f]"
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
          <div className="w-full max-w-xl rounded-[32px] bg-white p-8 shadow-[0_40px_120px_rgba(15,23,42,0.22)]">
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
                <span className="text-sm text-[#475569]">Producto</span>
                <select
                  value={movementForm.productId}
                  onChange={(event) =>
                    setMovementForm((current) => ({
                      ...current,
                      productId: event.target.value
                    }))
                  }
                  className="rounded-2xl border border-[#dce2cd] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
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
                  <span className="text-sm text-[#475569]">Tipo</span>
                  <select
                    value={movementForm.movementType}
                    onChange={(event) =>
                      setMovementForm((current) => ({
                        ...current,
                        movementType: event.target.value as 'IN' | 'OUT'
                      }))
                    }
                    className="rounded-2xl border border-[#dce2cd] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                  >
                    <option value="IN">Ingreso</option>
                    <option value="OUT">Salida</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-[#475569]">Cantidad</span>
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
                    className="rounded-2xl border border-[#dce2cd] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                    required
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm text-[#475569]">Motivo</span>
                <input
                  value={movementForm.reason}
                  onChange={(event) =>
                    setMovementForm((current) => ({
                      ...current,
                      reason: event.target.value
                    }))
                  }
                  className="rounded-2xl border border-[#dce2cd] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-[#475569]">Nota</span>
                <textarea
                  value={movementForm.note}
                  onChange={(event) =>
                    setMovementForm((current) => ({
                      ...current,
                      note: event.target.value
                    }))
                  }
                  className="min-h-28 rounded-2xl border border-[#dce2cd] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setMovementModalOpen(false)}
                  className="rounded-full border border-[#dce2cd] px-5 py-3 font-medium text-[#475569] transition hover:border-[#8dc63f]"
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
          <div className="w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-[0_40px_120px_rgba(15,23,42,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">
                  Tesoreria
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-[#173b2d]">
                  Nueva transaccion
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
                  <span className="text-sm text-[#475569]">Tipo</span>
                  <select
                    value={transactionForm.transactionType}
                    onChange={(event) =>
                      setTransactionForm((current) => ({
                        ...current,
                        transactionType: event.target.value as TransactionFormState['transactionType']
                      }))
                    }
                    className="rounded-2xl border border-[#dce2cd] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
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
                  <span className="text-sm text-[#475569]">Monto</span>
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
                    className="rounded-2xl border border-[#dce2cd] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm text-[#475569]">Categoria</span>
                  <input
                    value={transactionForm.category}
                    onChange={(event) =>
                      setTransactionForm((current) => ({
                        ...current,
                        category: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-[#dce2cd] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-[#475569]">Fecha y hora</span>
                  <input
                    type="datetime-local"
                    value={transactionForm.occurredAt}
                    onChange={(event) =>
                      setTransactionForm((current) => ({
                        ...current,
                        occurredAt: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-[#dce2cd] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm text-[#475569]">Metodo de pago</span>
                  <input
                    value={transactionForm.paymentMethod}
                    onChange={(event) =>
                      setTransactionForm((current) => ({
                        ...current,
                        paymentMethod: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-[#dce2cd] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-[#475569]">Referencia</span>
                  <input
                    value={transactionForm.reference}
                    onChange={(event) =>
                      setTransactionForm((current) => ({
                        ...current,
                        reference: event.target.value
                      }))
                    }
                    className="rounded-2xl border border-[#dce2cd] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm text-[#475569]">Nota</span>
                <textarea
                  value={transactionForm.note}
                  onChange={(event) =>
                    setTransactionForm((current) => ({
                      ...current,
                      note: event.target.value
                    }))
                  }
                  className="min-h-28 rounded-2xl border border-[#dce2cd] px-4 py-3 outline-none transition focus:border-[#8dc63f]"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setTransactionModalOpen(false)}
                  className="rounded-full border border-[#dce2cd] px-5 py-3 font-medium text-[#475569] transition hover:border-[#8dc63f]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#173b2d] px-6 py-3 font-semibold text-white transition hover:bg-[#0f2a1d]"
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
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#173b2d] px-5 py-3 text-sm font-medium text-white shadow-lg">
          {notice}
        </div>
      )}
    </div>
  );
}
