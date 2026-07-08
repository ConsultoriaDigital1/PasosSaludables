// Datos de muestra compartidos por las 4 maquetas de rediseño.
// Son estaticos a proposito: las maquetas no tocan la base de datos.

export interface ProductoDemo {
  nombre: string;
  precio: number;
  etiqueta?: string;
  tinte: string;
}

export const productosDemo: ProductoDemo[] = [
  {
    nombre: 'Yerba compuesta orgánica 500g',
    precio: 28500,
    etiqueta: 'Destacado',
    tinte: 'linear-gradient(135deg, #173b2d 0%, #2c6a45 100%)'
  },
  {
    nombre: 'Granola artesanal con miel 400g',
    precio: 32000,
    etiqueta: 'Nuevo',
    tinte: 'linear-gradient(135deg, #6f8f2f 0%, #a0cd60 100%)'
  },
  {
    nombre: 'Miel de monte pura 720ml',
    precio: 45000,
    etiqueta: 'Destacado',
    tinte: 'linear-gradient(135deg, #8a6d1f 0%, #d9b344 100%)'
  },
  {
    nombre: 'Harina integral de trigo 1kg',
    precio: 18500,
    tinte: 'linear-gradient(135deg, #4b5a3a 0%, #93a86e 100%)'
  },
  {
    nombre: 'Aceite de coco prensado en frío',
    precio: 52000,
    tinte: 'linear-gradient(135deg, #21503c 0%, #578124 100%)'
  },
  {
    nombre: 'Té de burrito y menta x20',
    precio: 15500,
    tinte: 'linear-gradient(135deg, #0f2a1d 0%, #71a52c 100%)'
  }
];

export const pasosDemo = [
  {
    numero: '01',
    titulo: 'Explorá el catálogo',
    detalle: 'Encontrá productos por nombre, descripción o categoría.'
  },
  {
    numero: '02',
    titulo: 'Armá tu pedido',
    detalle: 'Sumá al carrito solo lo que tiene stock y precio publicado.'
  },
  {
    numero: '03',
    titulo: 'Confirmá por WhatsApp',
    detalle: 'Cerrás el pedido directo con atención humana real.'
  }
];
