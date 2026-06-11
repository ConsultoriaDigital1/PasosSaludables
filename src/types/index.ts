export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  images: string[];
  featured: boolean;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface CheckoutDetails {
  customerName: string;
  address: string;
  ruc: string;
  paymentMethod: string;
  invoicePreference: string;
}

export interface DashboardSummary {
  totalProducts: number;
  totalCategories: number;
  totalStock: number;
  inventoryValue: number;
  lowStockProducts: number;
  featuredProducts: number;
  recentMovements: number;
  recentUnitsOut: number;
  totalIncome: number;
  totalExpense: number;
  treasuryBalance: number;
}

export interface MonthlyFinancePoint {
  month: string;
  income: number;
  expense: number;
}

export interface ExpenseBreakdownItem {
  category: string;
  total: number;
}

export interface CategoryDistributionPoint {
  category: string;
  products: number;
  units: number;
}

export interface StockLeader {
  id: number;
  name: string;
  stockQuantity: number;
}

export interface MovementTrendPoint {
  day: string;
  unitsOut: number;
  unitsIn: number;
}

export interface StockMovement {
  id: number;
  productId: number | null;
  productName: string;
  movementType: string;
  quantity: number;
  reason: string;
  note: string;
  createdAt: string;
}

export interface TreasuryTransaction {
  id: number;
  transactionType: string;
  category: string;
  amount: number;
  paymentMethod: string;
  reference: string;
  note: string;
  occurredAt: string;
  createdAt: string;
}

export interface StorefrontBootstrap {
  summary: Pick<
    DashboardSummary,
    | 'totalProducts'
    | 'totalCategories'
    | 'totalStock'
    | 'inventoryValue'
    | 'lowStockProducts'
    | 'featuredProducts'
  >;
  categories: Category[];
  products: Product[];
  featuredProducts: Product[];
}

export interface WebAnalyticsTotals {
  pageviews: number;
  visitors: number;
  sessions: number;
}

export interface WebAnalyticsDailyPoint {
  day: string;
  pageviews: number;
  visitors: number;
}

export interface WebAnalyticsHourlyPoint {
  hour: number;
  pageviews: number;
  visitors: number;
}

export interface WebAnalyticsShareItem {
  name: string;
  visitors: number;
  pageviews: number;
}

export interface WebAnalyticsPageItem {
  path: string;
  pageviews: number;
  visitors: number;
}

export interface WebAnalyticsReferrerItem {
  source: string;
  sessions: number;
}

export interface WebAnalyticsCartItem {
  name: string;
  adds: number;
  visitors: number;
}

export interface WebAnalyticsSnapshot {
  onlineNow: number;
  today: WebAnalyticsTotals;
  totals: WebAnalyticsTotals;
  avgPagesPerSession: number;
  avgSessionMinutes: number;
  dailySeries: WebAnalyticsDailyPoint[];
  hourly: WebAnalyticsHourlyPoint[];
  devices: WebAnalyticsShareItem[];
  browsers: WebAnalyticsShareItem[];
  operatingSystems: WebAnalyticsShareItem[];
  topPages: WebAnalyticsPageItem[];
  referrers: WebAnalyticsReferrerItem[];
  cartTopProducts: WebAnalyticsCartItem[];
  rangeDays: number;
}

export interface DashboardSnapshot {
  summary: DashboardSummary;
  monthlyFinance: MonthlyFinancePoint[];
  expenseBreakdown: ExpenseBreakdownItem[];
  categoryDistribution: CategoryDistributionPoint[];
  topStock: StockLeader[];
  lowStock: StockLeader[];
  movementTrend: MovementTrendPoint[];
  recentMovements: StockMovement[];
}
