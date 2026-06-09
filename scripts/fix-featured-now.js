import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function fixFeaturedColumn() {
  try {
    console.log('🔧 Ejecutando migración de emergencia para columna featured...');
    
    // Verificar si la tabla products existe
    const tableExists = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'products'
    `;
    
    if (tableExists.length === 0) {
      console.error('❌ La tabla products no existe');
      return;
    }
    
    console.log('✅ Tabla products encontrada');
    
    // Verificar si la columna featured ya existe
    const columnExists = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'featured'
    `;
    
    if (columnExists.length > 0) {
      console.log('✅ La columna featured ya existe');
    } else {
      console.log('➕ Agregando columna featured...');
      
      // Agregar la columna featured
      await sql`
        ALTER TABLE products 
        ADD COLUMN featured BOOLEAN DEFAULT false
      `;
      
      console.log('✅ Columna featured agregada exitosamente');
    }
    
    // Actualizar cualquier valor NULL a false
    await sql`
      UPDATE products 
      SET featured = COALESCE(featured, false)
    `;
    
    console.log('✅ Valores NULL actualizados a false');
    
    // Mostrar estructura de la tabla
    const columns = await sql`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'products'
      ORDER BY ordinal_position
    `;
    
    console.log('📋 Estructura de la tabla products:');
    console.table(columns);
    
    // Mostrar algunos productos para verificar
    const products = await sql`
      SELECT id, name, featured 
      FROM products 
      LIMIT 3
    `;
    
    console.log('📋 Productos de ejemplo:');
    console.table(products);
    
    console.log('🎉 Migración completada exitosamente');
    console.log('🔄 Reinicia el servidor con: pnpm run dev');
    
  } catch (error) {
    console.error('❌ Error en la migración:', error.message);
    console.error('Stack trace:', error.stack);
  }
  
  process.exit(0);
}

fixFeaturedColumn();