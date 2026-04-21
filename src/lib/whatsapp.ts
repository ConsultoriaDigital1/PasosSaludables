import { formatPriceARS } from './formatters';
import type { CartItem, Product } from '../types';

const WHATSAPP_PHONE_NUMBER = '+595992801111';

function normalizePhoneNumber(value: string) {
  return value.replace(/\D/g, '');
}

export const WHATSAPP_CONFIG = {
  phoneNumber: normalizePhoneNumber(WHATSAPP_PHONE_NUMBER)
};

export const formatWhatsAppMessage = (items: CartItem[], total: number) => {
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const lines = ['Hola Pasos Saludables, quiero confirmar este pedido:', '', '*Pedido web*'];

  items.forEach((item, index) => {
    lines.push(`${index + 1}. *${item.product.name}*`);

    if (item.product.category) {
      lines.push(`   Categoria: ${item.product.category}`);
    }

    lines.push(`   Cantidad: ${item.quantity}`);
    lines.push(`   Precio unitario: ${formatPriceARS(item.product.price)}`);
    lines.push(`   Subtotal: ${formatPriceARS(item.product.price * item.quantity)}`);
    lines.push('');
  });

  lines.push(`*Total estimado:* ${formatPriceARS(total)}`);
  lines.push(`*Unidades:* ${totalUnits}`);
  lines.push('');
  lines.push(
    'Quedo atento para confirmar disponibilidad final, forma de entrega y medios de pago. Gracias.'
  );

  return lines.join('\n');
};

export const formatProductInquiryMessage = (product: Product) => {
  const lines = [
    'Hola Pasos Saludables, quiero consultar por este producto:',
    '',
    `*Producto:* ${product.name}`
  ];

  if (product.category) {
    lines.push(`*Categoria:* ${product.category}`);
  }

  if (product.price > 0) {
    lines.push(`*Precio publicado:* ${formatPriceARS(product.price)}`);
  }

  lines.push(
    `*Stock visible:* ${product.stockQuantity > 0 ? product.stockQuantity : 'sin unidades'}`
  );
  lines.push('');
  lines.push(
    'Quiero confirmar disponibilidad actual, forma de entrega y medios de pago. Gracias.'
  );

  return lines.join('\n');
};

export const openWhatsApp = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};
