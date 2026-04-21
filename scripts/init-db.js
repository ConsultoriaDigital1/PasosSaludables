import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function initDatabase() {
  try {
    console.log('Inicializando base de datos...');

    // Create categories table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        image TEXT,
        images TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create vehicles table
    await sql`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        brand VARCHAR(255) NOT NULL,
        model VARCHAR(255) NOT NULL,
        year INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT NOT NULL,
        images TEXT[] DEFAULT '{}',
        mileage INTEGER,
        fuel_type VARCHAR(50) NOT NULL,
        transmission VARCHAR(50) NOT NULL,
        color VARCHAR(100) NOT NULL,
        condition VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'disponible',
        features TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Tablas creadas exitosamente');

    // Insert default categories
    const categories = [
      'Electrónicos',
      'Ropa',
      'Hogar',
      'Deportes',
      'Libros',
      'Juguetes'
    ];

    for (const category of categories) {
      try {
        await sql`
          INSERT INTO categories (name)
          VALUES (${category})
          ON CONFLICT (name) DO NOTHING
        `;
      } catch (error) {
        console.log(`Categoría ${category} ya existe o error:`, error);
      }
    }

    console.log('Categorías insertadas');

    // Insert sample products
    const sampleProducts = [
      {
        name: 'Smartphone Samsung Galaxy',
        description: 'Teléfono inteligente con pantalla AMOLED de 6.1 pulgadas',
        price: 299.99,
        category: 'Electrónicos',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400']
      },
      {
        name: 'Laptop HP Pavilion',
        description: 'Laptop para trabajo y entretenimiento con procesador Intel i5',
        price: 599.99,
        category: 'Electrónicos',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400']
      },
      {
        name: 'Camiseta Nike',
        description: 'Camiseta deportiva de alta calidad',
        price: 29.99,
        category: 'Ropa',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400']
      }
    ];

    for (const product of sampleProducts) {
      try {
        await sql`
          INSERT INTO products (name, description, price, category, image, images)
          VALUES (${product.name}, ${product.description}, ${product.price}, ${product.category}, ${product.image}, ${product.images})
        `;
      } catch (error) {
        console.log(`Producto ${product.name} ya existe o error:`, error);
      }
    }

    console.log('Productos de ejemplo insertados');
    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error inicializando base de datos:', error);
    throw error;
  }
}

initDatabase().catch(console.error);