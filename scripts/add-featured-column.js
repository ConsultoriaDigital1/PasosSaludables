import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function addFeaturedColumn() {
  try {
    console.log('🔍 Verificando si la columna featured ya existe...');
    
    // Verificar si la columna ya existe
    const existingColumn = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'featured'
    `;
    
    if (existingColumn.length > 0) {
      console.log('✅ La columna featured ya existe');
      return;
    }
    
    console.log('➕ Agregando columna featured a la tabla products...');
    
    // Agregar la columna featured
    await sql`
      ALTER TABLE products 
      ADD COLUMN featured BOOLEAN DEFAULT false
    `;
    
    console.log('✅ Columna featured agregada exitosamente');
    
    // Verificar que se agregó correctamente
    const verification = await sql`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'featured'
    `;
    
    if (verification.length > 0) {
      console.log('✅ Verificación exitosa:');
      console.table(verification);
    }
    
    console.log('\n📝 Nota: Todos los productos existentes tienen featured = false por defecto');
    console.log('🎯 Puedes marcar productos como destacados desde el panel de administración');
    
  } catch (error) {
    console.error('❌ Error al agregar la columna featured:', error);
    console.error('Detalles:', error.message);
    process.exit(1);
  }
}

addFeaturedColumn();