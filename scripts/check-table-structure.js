import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function checkTableStructure() {
  try {
    console.log('Verificando estructura de la tabla products...');
    
    // Verificar las columnas de la tabla products
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'products'
      ORDER BY ordinal_position
    `;
    
    console.log('\n📋 Estructura actual de la tabla products:');
    console.table(columns);
    
    // Verificar si existe la columna featured
    const featuredColumn = columns.find(col => col.column_name === 'featured');
    
    if (featuredColumn) {
      console.log('\n✅ La columna "featured" existe');
      console.log(`   Tipo: ${featuredColumn.data_type}`);
      console.log(`   Default: ${featuredColumn.column_default}`);
    } else {
      console.log('\n❌ La columna "featured" NO existe');
      console.log('   Ejecuta: node scripts/add-featured-column.js');
    }
    
    // Mostrar algunos productos de ejemplo
    console.log('\n📦 Productos de ejemplo:');
    const products = await sql`SELECT id, name, featured FROM products LIMIT 3`;
    console.table(products);
    
  } catch (error) {
    console.error('❌ Error al verificar la estructura:', error);
  }
}

checkTableStructure();