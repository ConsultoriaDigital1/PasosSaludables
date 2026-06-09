// Script para diagnosticar problemas de conexión
const diagnose = async () => {
  console.log('🔍 Iniciando diagnóstico...\n');
  
  try {
    // 1. Verificar que el servidor esté corriendo
    console.log('1️⃣ Verificando servidor...');
    const serverResponse = await fetch('http://localhost:4321/');
    console.log(`   ✅ Servidor respondiendo: ${serverResponse.status}\n`);
    
    // 2. Probar conexión a la API de productos
    console.log('2️⃣ Probando API de productos...');
    const productsResponse = await fetch('http://localhost:4321/api/products');
    console.log(`   📡 Status: ${productsResponse.status}`);
    
    if (productsResponse.ok) {
      const products = await productsResponse.json();
      console.log(`   ✅ Productos obtenidos: ${Array.isArray(products) ? products.length : 'Error en formato'}`);
      if (Array.isArray(products) && products.length > 0) {
        console.log(`   📋 Primer producto: ${products[0].name}`);
      }
    } else {
      const error = await productsResponse.text();
      console.log(`   ❌ Error: ${error}`);
    }
    console.log('');
    
    // 3. Probar inicialización de BD
    console.log('3️⃣ Probando inicialización de BD...');
    const initResponse = await fetch('http://localhost:4321/api/init-db', {
      method: 'POST'
    });
    console.log(`   📡 Status: ${initResponse.status}`);
    
    if (initResponse.ok) {
      const result = await initResponse.json();
      console.log(`   ✅ Inicialización: ${result.success ? 'Exitosa' : 'Falló'}`);
      if (!result.success) {
        console.log(`   ❌ Error: ${result.error}`);
      }
    } else {
      const error = await initResponse.text();
      console.log(`   ❌ Error: ${error}`);
    }
    console.log('');
    
    // 4. Verificar productos después de inicialización
    console.log('4️⃣ Verificando productos después de inicialización...');
    const finalResponse = await fetch('http://localhost:4321/api/products');
    if (finalResponse.ok) {
      const finalProducts = await finalResponse.json();
      console.log(`   ✅ Productos finales: ${Array.isArray(finalProducts) ? finalProducts.length : 'Error en formato'}`);
    }
    
  } catch (error) {
    console.error('❌ Error en diagnóstico:', error.message);
    console.log('\n💡 Asegúrate de que el servidor esté ejecutándose con: pnpm run dev');
  }
};

diagnose();