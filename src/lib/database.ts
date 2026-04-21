import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import type {
  Category,
  DashboardSnapshot,
  Product,
  StockMovement,
  StorefrontBootstrap,
  TreasuryTransaction
} from '../types';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

export const sql = neon(databaseUrl);

let schemaReadyPromise: Promise<void> | null = null;

export async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      category VARCHAR(255) NOT NULL DEFAULT 'Sin categoria',
      image TEXT,
      images TEXT[],
      featured BOOLEAN DEFAULT false,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS stock_movements (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      movement_type VARCHAR(20) NOT NULL,
      quantity INTEGER NOT NULL,
      reason VARCHAR(255) NOT NULL,
      note TEXT,
      batch_code VARCHAR(64),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS treasury_transactions (
      id SERIAL PRIMARY KEY,
      transaction_type VARCHAR(30) NOT NULL,
      category VARCHAR(255) NOT NULL,
      amount DECIMAL(12,2) NOT NULL,
      payment_method VARCHAR(100),
      reference VARCHAR(255),
      note TEXT,
      occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false
  `;

  await sql`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 0
  `;

  await sql`
    ALTER TABLE stock_movements
    ADD COLUMN IF NOT EXISTS batch_code VARCHAR(64)
  `;
}

async function ensureSchemaReady() {
  if (!schemaReadyPromise) {
    schemaReadyPromise = ensureSchema();
  }

  await schemaReadyPromise;
}

function toProduct(row: any): Product {
  return {
    id: Number(row.id),
    name: row.name ?? '',
    description: row.description ?? '',
    price: Number(row.price ?? 0),
    category: row.category ?? 'Sin categoria',
    image: row.image ?? '',
    images: Array.isArray(row.images) ? row.images.filter(Boolean) : [],
    featured: Boolean(row.featured),
    stockQuantity: Number(row.stock_quantity ?? 0),
    createdAt: String(row.created_at ?? ''),
    updatedAt: String(row.updated_at ?? '')
  };
}

function toCategory(row: any): Category {
  return {
    id: Number(row.id),
    name: row.name ?? '',
    description: row.description ?? '',
    createdAt: String(row.created_at ?? ''),
    updatedAt: String(row.updated_at ?? '')
  };
}

function toMovement(row: any): StockMovement {
  return {
    id: Number(row.id),
    productId: row.product_id == null ? null : Number(row.product_id),
    productName: row.product_name ?? '',
    movementType: row.movement_type ?? '',
    quantity: Number(row.quantity ?? 0),
    reason: row.reason ?? '',
    note: row.note ?? '',
    createdAt: String(row.created_at ?? '')
  };
}

function toTransaction(row: any): TreasuryTransaction {
  return {
    id: Number(row.id),
    transactionType: row.transaction_type ?? '',
    category: row.category ?? '',
    amount: Number(row.amount ?? 0),
    paymentMethod: row.payment_method ?? '',
    reference: row.reference ?? '',
    note: row.note ?? '',
    occurredAt: String(row.occurred_at ?? ''),
    createdAt: String(row.created_at ?? '')
  };
}

function normalizeImages(input: unknown, image: string) {
  if (Array.isArray(input)) {
    return input
      .filter((item) => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof input === 'string') {
    return input
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return image ? [image] : [];
}

function normalizeProductInput(input: any) {
  const name = typeof input?.name === 'string' ? input.name.trim() : '';
  const description =
    typeof input?.description === 'string' ? input.description.trim() : '';
  const category =
    typeof input?.category === 'string' ? input.category.trim() : '';
  const image = typeof input?.image === 'string' ? input.image.trim() : '';
  const images = normalizeImages(input?.images, image);
  const price = Number(input?.price);
  const stockQuantity = Number(input?.stockQuantity ?? 0);
  const featured = Boolean(input?.featured);

  if (!name) {
    throw new Error('El nombre es obligatorio');
  }

  if (!category) {
    throw new Error('La categoria es obligatoria');
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error('El precio debe ser un numero valido');
  }

  if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
    throw new Error('El stock debe ser un entero valido');
  }

  return {
    name,
    description,
    category,
    image,
    images,
    price,
    stockQuantity,
    featured
  };
}

function normalizeCategoryInput(input: any) {
  const name = typeof input?.name === 'string' ? input.name.trim() : '';
  const description =
    typeof input?.description === 'string' ? input.description.trim() : '';

  if (!name) {
    throw new Error('El nombre de la categoria es obligatorio');
  }

  return {
    name,
    description
  };
}

function normalizeMovementInput(input: any) {
  const productId = Number(input?.productId);
  const movementType =
    typeof input?.movementType === 'string'
      ? input.movementType.trim().toUpperCase()
      : '';
  const quantity = Number(input?.quantity);
  const reason = typeof input?.reason === 'string' ? input.reason.trim() : '';
  const note = typeof input?.note === 'string' ? input.note.trim() : '';

  if (!Number.isInteger(productId) || productId <= 0) {
    throw new Error('Selecciona un producto valido');
  }

  if (!['IN', 'OUT'].includes(movementType)) {
    throw new Error('El movimiento debe ser IN u OUT');
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error('La cantidad debe ser un entero positivo');
  }

  return {
    productId,
    movementType,
    quantity,
    reason: reason || (movementType === 'IN' ? 'Ingreso de stock' : 'Salida de stock'),
    note
  };
}

function normalizeTransactionInput(input: any) {
  const transactionType =
    typeof input?.transactionType === 'string'
      ? input.transactionType.trim().toUpperCase()
      : '';
  const category = typeof input?.category === 'string' ? input.category.trim() : '';
  const amount = Number(input?.amount);
  const paymentMethod =
    typeof input?.paymentMethod === 'string' ? input.paymentMethod.trim() : '';
  const reference =
    typeof input?.reference === 'string' ? input.reference.trim() : '';
  const note = typeof input?.note === 'string' ? input.note.trim() : '';
  const occurredAt =
    typeof input?.occurredAt === 'string' && input.occurredAt.trim()
      ? input.occurredAt.trim()
      : new Date().toISOString();

  if (
    !['INCOME', 'EXPENSE', 'SALE', 'PURCHASE', 'WITHDRAWAL', 'CAPITAL', 'TAX'].includes(
      transactionType
    )
  ) {
    throw new Error('Tipo de transaccion invalido');
  }

  if (!category) {
    throw new Error('La categoria es obligatoria');
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('El monto debe ser positivo');
  }

  return {
    transactionType,
    category,
    amount,
    paymentMethod,
    reference,
    note,
    occurredAt
  };
}

async function getProducts(search = '', category = '') {
  await ensureSchemaReady();

  const normalizedSearch = search.trim();
  const normalizedCategory = category.trim();

  if (normalizedSearch) {
    const rows = await sql`
      SELECT
        id,
        name,
        description,
        price,
        category,
        image,
        images,
        featured,
        stock_quantity,
        created_at,
        updated_at
      FROM products
      WHERE name ILIKE ${`%${normalizedSearch}%`}
        OR description ILIKE ${`%${normalizedSearch}%`}
        OR category ILIKE ${`%${normalizedSearch}%`}
      ORDER BY featured DESC, updated_at DESC, created_at DESC
    `;

    return rows.map(toProduct);
  }

  if (normalizedCategory) {
    const rows = await sql`
      SELECT
        id,
        name,
        description,
        price,
        category,
        image,
        images,
        featured,
        stock_quantity,
        created_at,
        updated_at
      FROM products
      WHERE category = ${normalizedCategory}
      ORDER BY featured DESC, updated_at DESC, created_at DESC
    `;

    return rows.map(toProduct);
  }

  const rows = await sql`
    SELECT
      id,
      name,
      description,
      price,
      category,
      image,
      images,
      featured,
      stock_quantity,
      created_at,
      updated_at
    FROM products
    ORDER BY featured DESC, updated_at DESC, created_at DESC
  `;

  return rows.map(toProduct);
}

export const db = {
  products: {
    getAll: async (search = '', category = '') => getProducts(search, category),

    getFeatured: async (limit = 6) => {
      await ensureSchemaReady();

      const rows = await sql`
        SELECT
          id,
          name,
          description,
          price,
          category,
          image,
          images,
          featured,
          stock_quantity,
          created_at,
          updated_at
        FROM products
        WHERE featured = true
        ORDER BY updated_at DESC, created_at DESC
        LIMIT ${limit}
      `;

      return rows.map(toProduct);
    },

    getById: async (id: number) => {
      await ensureSchemaReady();

      const rows = await sql`
        SELECT
          id,
          name,
          description,
          price,
          category,
          image,
          images,
          featured,
          stock_quantity,
          created_at,
          updated_at
        FROM products
        WHERE id = ${id}
        LIMIT 1
      `;

      return rows[0] ? toProduct(rows[0]) : null;
    },

    create: async (input: any) => {
      await ensureSchemaReady();
      const payload = normalizeProductInput(input);

      const rows = await sql`
        INSERT INTO products (
          name,
          description,
          price,
          category,
          image,
          images,
          featured,
          stock_quantity
        )
        VALUES (
          ${payload.name},
          ${payload.description},
          ${payload.price},
          ${payload.category},
          ${payload.image},
          ${payload.images},
          ${payload.featured},
          ${payload.stockQuantity}
        )
        RETURNING
          id,
          name,
          description,
          price,
          category,
          image,
          images,
          featured,
          stock_quantity,
          created_at,
          updated_at
      `;

      return toProduct(rows[0]);
    },

    update: async (id: number, input: any) => {
      await ensureSchemaReady();
      const payload = normalizeProductInput(input);

      const rows = await sql`
        UPDATE products
        SET
          name = ${payload.name},
          description = ${payload.description},
          price = ${payload.price},
          category = ${payload.category},
          image = ${payload.image},
          images = ${payload.images},
          featured = ${payload.featured},
          stock_quantity = ${payload.stockQuantity},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING
          id,
          name,
          description,
          price,
          category,
          image,
          images,
          featured,
          stock_quantity,
          created_at,
          updated_at
      `;

      return rows[0] ? toProduct(rows[0]) : null;
    },

    delete: async (id: number) => {
      await ensureSchemaReady();

      const rows = await sql`
        DELETE FROM products
        WHERE id = ${id}
        RETURNING id
      `;

      return rows.length > 0;
    }
  },

  categories: {
    getAll: async () => {
      await ensureSchemaReady();

      const rows = await sql`
        SELECT id, name, description, created_at, updated_at
        FROM categories
        ORDER BY name ASC
      `;

      return rows.map(toCategory);
    },

    getById: async (id: number) => {
      await ensureSchemaReady();

      const rows = await sql`
        SELECT id, name, description, created_at, updated_at
        FROM categories
        WHERE id = ${id}
        LIMIT 1
      `;

      return rows[0] ? toCategory(rows[0]) : null;
    },

    create: async (input: any) => {
      await ensureSchemaReady();
      const payload = normalizeCategoryInput(input);

      const rows = await sql`
        INSERT INTO categories (name, description)
        VALUES (${payload.name}, ${payload.description})
        RETURNING id, name, description, created_at, updated_at
      `;

      return toCategory(rows[0]);
    },

    update: async (id: number, input: any) => {
      await ensureSchemaReady();
      const payload = normalizeCategoryInput(input);

      const rows = await sql`
        UPDATE categories
        SET
          name = ${payload.name},
          description = ${payload.description},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, name, description, created_at, updated_at
      `;

      return rows[0] ? toCategory(rows[0]) : null;
    },

    delete: async (id: number) => {
      await ensureSchemaReady();

      const rows = await sql`
        DELETE FROM categories
        WHERE id = ${id}
        RETURNING id
      `;

      return rows.length > 0;
    }
  },

  stockMovements: {
    getAll: async (limit = 40) => {
      await ensureSchemaReady();

      const rows = await sql`
        SELECT
          sm.id,
          sm.product_id,
          COALESCE(p.name, CONCAT('Producto #', sm.product_id::text)) AS product_name,
          sm.movement_type,
          sm.quantity,
          sm.reason,
          sm.note,
          sm.created_at
        FROM stock_movements sm
        LEFT JOIN products p ON p.id = sm.product_id
        ORDER BY sm.created_at DESC, sm.id DESC
        LIMIT ${Math.max(1, Math.min(limit, 200))}
      `;

      return rows.map(toMovement);
    },

    create: async (input: any) => {
      await ensureSchemaReady();
      const payload = normalizeMovementInput(input);

      const product = await db.products.getById(payload.productId);

      if (!product) {
        throw new Error('El producto no existe');
      }

      if (payload.movementType === 'OUT' && product.stockQuantity < payload.quantity) {
        throw new Error('Stock insuficiente para ese movimiento');
      }

      const direction = payload.movementType === 'IN' ? 1 : -1;

      const rows = await sql`
        WITH updated_product AS (
          UPDATE products
          SET
            stock_quantity = stock_quantity + (${direction} * ${payload.quantity}),
            updated_at = NOW()
          WHERE id = ${payload.productId}
          RETURNING id, name
        )
        INSERT INTO stock_movements (
          product_id,
          movement_type,
          quantity,
          reason,
          note
        )
        SELECT
          ${payload.productId},
          ${payload.movementType},
          ${payload.quantity},
          ${payload.reason},
          ${payload.note}
        FROM updated_product
        RETURNING
          id,
          product_id,
          ${product.name} AS product_name,
          movement_type,
          quantity,
          reason,
          note,
          created_at
      `;

      return toMovement(rows[0]);
    }
  },

  treasury: {
    getAll: async (limit = 60) => {
      await ensureSchemaReady();

      const rows = await sql`
        SELECT
          id,
          transaction_type,
          category,
          amount,
          payment_method,
          reference,
          note,
          occurred_at,
          created_at
        FROM treasury_transactions
        ORDER BY occurred_at DESC, id DESC
        LIMIT ${Math.max(1, Math.min(limit, 200))}
      `;

      return rows.map(toTransaction);
    },

    create: async (input: any) => {
      await ensureSchemaReady();
      const payload = normalizeTransactionInput(input);

      const rows = await sql`
        INSERT INTO treasury_transactions (
          transaction_type,
          category,
          amount,
          payment_method,
          reference,
          note,
          occurred_at
        )
        VALUES (
          ${payload.transactionType},
          ${payload.category},
          ${payload.amount},
          ${payload.paymentMethod},
          ${payload.reference},
          ${payload.note},
          ${payload.occurredAt}
        )
        RETURNING
          id,
          transaction_type,
          category,
          amount,
          payment_method,
          reference,
          note,
          occurred_at,
          created_at
      `;

      return toTransaction(rows[0]);
    },

    delete: async (id: number) => {
      await ensureSchemaReady();

      const rows = await sql`
        DELETE FROM treasury_transactions
        WHERE id = ${id}
        RETURNING id
      `;

      return rows.length > 0;
    }
  },

  storefront: {
    getBootstrap: async (): Promise<StorefrontBootstrap> => {
      await ensureSchemaReady();

      const [products, featuredProducts, categories, summaryRows] = await Promise.all([
        db.products.getAll(),
        db.products.getFeatured(4),
        db.categories.getAll(),
        sql`
          SELECT
            COUNT(*)::int AS total_products,
            COALESCE(SUM(stock_quantity), 0)::int AS total_stock,
            COALESCE(SUM(price * stock_quantity), 0)::numeric AS inventory_value,
            COALESCE(SUM(CASE WHEN stock_quantity <= 3 THEN 1 ELSE 0 END), 0)::int AS low_stock_products,
            COALESCE(SUM(CASE WHEN featured = true THEN 1 ELSE 0 END), 0)::int AS featured_products
          FROM products
        `
      ]);

      const summary = summaryRows[0];

      return {
        summary: {
          totalProducts: Number(summary.total_products ?? 0),
          totalCategories: categories.length,
          totalStock: Number(summary.total_stock ?? 0),
          inventoryValue: Number(summary.inventory_value ?? 0),
          lowStockProducts: Number(summary.low_stock_products ?? 0),
          featuredProducts: Number(summary.featured_products ?? 0)
        },
        categories,
        products,
        featuredProducts
      };
    }
  },

  dashboard: {
    getData: async (): Promise<DashboardSnapshot> => {
      await ensureSchemaReady();

      const [
        inventoryRows,
        categoriesRows,
        movementsRows,
        treasuryRows,
        chartRows,
        expenseRows,
        categoryRows,
        topRows,
        lowRows,
        trendRows,
        recentMovementRows
      ] = await Promise.all([
        sql`
          SELECT
            COUNT(*)::int AS total_products,
            COALESCE(SUM(stock_quantity), 0)::int AS total_stock,
            COALESCE(SUM(price * stock_quantity), 0)::numeric AS inventory_value,
            COALESCE(SUM(CASE WHEN stock_quantity <= 3 THEN 1 ELSE 0 END), 0)::int AS low_stock_products,
            COALESCE(SUM(CASE WHEN featured = true THEN 1 ELSE 0 END), 0)::int AS featured_products
          FROM products
        `,
        sql`
          SELECT COUNT(*)::int AS total_categories
          FROM categories
        `,
        sql`
          SELECT
            COUNT(*)::int AS recent_movements,
            COALESCE(SUM(CASE WHEN movement_type = 'OUT' THEN quantity ELSE 0 END), 0)::int AS recent_units_out
          FROM stock_movements
          WHERE created_at >= NOW() - INTERVAL '7 days'
        `,
        sql`
          SELECT
            COALESCE(SUM(CASE WHEN transaction_type IN ('INCOME', 'SALE', 'CAPITAL') THEN amount ELSE 0 END), 0)::numeric AS total_income,
            COALESCE(SUM(CASE WHEN transaction_type IN ('EXPENSE', 'PURCHASE', 'WITHDRAWAL', 'TAX') THEN amount ELSE 0 END), 0)::numeric AS total_expense
          FROM treasury_transactions
          WHERE occurred_at >= DATE_TRUNC('month', NOW())
        `,
        sql`
          SELECT
            TO_CHAR(occurred_at, 'YYYY-MM') AS month_key,
            COALESCE(SUM(CASE WHEN transaction_type IN ('INCOME', 'SALE', 'CAPITAL') THEN amount ELSE 0 END), 0)::numeric AS income_total,
            COALESCE(SUM(CASE WHEN transaction_type IN ('EXPENSE', 'PURCHASE', 'WITHDRAWAL', 'TAX') THEN amount ELSE 0 END), 0)::numeric AS expense_total
          FROM treasury_transactions
          WHERE occurred_at >= DATE_TRUNC('month', NOW()) - INTERVAL '5 months'
          GROUP BY month_key
          ORDER BY month_key ASC
        `,
        sql`
          SELECT
            category,
            COALESCE(SUM(amount), 0)::numeric AS total
          FROM treasury_transactions
          WHERE transaction_type IN ('EXPENSE', 'PURCHASE', 'WITHDRAWAL', 'TAX')
            AND occurred_at >= DATE_TRUNC('month', NOW())
          GROUP BY category
          ORDER BY total DESC
          LIMIT 5
        `,
        sql`
          SELECT
            category,
            COUNT(*)::int AS products,
            COALESCE(SUM(stock_quantity), 0)::int AS units
          FROM products
          GROUP BY category
          ORDER BY units DESC, products DESC
        `,
        sql`
          SELECT id, name, stock_quantity
          FROM products
          ORDER BY stock_quantity DESC, updated_at DESC
          LIMIT 6
        `,
        sql`
          SELECT id, name, stock_quantity
          FROM products
          WHERE stock_quantity <= 5
          ORDER BY stock_quantity ASC, updated_at DESC
          LIMIT 6
        `,
        sql`
          SELECT
            TO_CHAR(created_at, 'YYYY-MM-DD') AS day_key,
            COALESCE(SUM(CASE WHEN movement_type = 'OUT' THEN quantity ELSE 0 END), 0)::int AS units_out,
            COALESCE(SUM(CASE WHEN movement_type = 'IN' THEN quantity ELSE 0 END), 0)::int AS units_in
          FROM stock_movements
          WHERE created_at >= NOW() - INTERVAL '14 days'
          GROUP BY day_key
          ORDER BY day_key ASC
        `,
        sql`
          SELECT
            sm.id,
            sm.product_id,
            COALESCE(p.name, CONCAT('Producto #', sm.product_id::text)) AS product_name,
            sm.movement_type,
            sm.quantity,
            sm.reason,
            sm.note,
            sm.created_at
          FROM stock_movements sm
          LEFT JOIN products p ON p.id = sm.product_id
          ORDER BY sm.created_at DESC, sm.id DESC
          LIMIT 8
        `
      ]);

      const inventory = inventoryRows[0];
      const categories = categoriesRows[0];
      const movements = movementsRows[0];
      const treasury = treasuryRows[0];
      const income = Number(treasury.total_income ?? 0);
      const expense = Number(treasury.total_expense ?? 0);

      return {
        summary: {
          totalProducts: Number(inventory.total_products ?? 0),
          totalCategories: Number(categories.total_categories ?? 0),
          totalStock: Number(inventory.total_stock ?? 0),
          inventoryValue: Number(inventory.inventory_value ?? 0),
          lowStockProducts: Number(inventory.low_stock_products ?? 0),
          featuredProducts: Number(inventory.featured_products ?? 0),
          recentMovements: Number(movements.recent_movements ?? 0),
          recentUnitsOut: Number(movements.recent_units_out ?? 0),
          totalIncome: income,
          totalExpense: expense,
          treasuryBalance: income - expense
        },
        monthlyFinance: chartRows.map((row) => ({
          month: row.month_key,
          income: Number(row.income_total ?? 0),
          expense: Number(row.expense_total ?? 0)
        })),
        expenseBreakdown: expenseRows.map((row) => ({
          category: row.category,
          total: Number(row.total ?? 0)
        })),
        categoryDistribution: categoryRows.map((row) => ({
          category: row.category,
          products: Number(row.products ?? 0),
          units: Number(row.units ?? 0)
        })),
        topStock: topRows.map((row) => ({
          id: Number(row.id),
          name: row.name,
          stockQuantity: Number(row.stock_quantity ?? 0)
        })),
        lowStock: lowRows.map((row) => ({
          id: Number(row.id),
          name: row.name,
          stockQuantity: Number(row.stock_quantity ?? 0)
        })),
        movementTrend: trendRows.map((row) => ({
          day: row.day_key,
          unitsOut: Number(row.units_out ?? 0),
          unitsIn: Number(row.units_in ?? 0)
        })),
        recentMovements: recentMovementRows.map(toMovement)
      };
    }
  }
};
