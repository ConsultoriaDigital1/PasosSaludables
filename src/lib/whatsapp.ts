import { formatPriceARS } from './formatters';
import type { CartItem, CheckoutDetails, Product } from '../types';

const WHATSAPP_PHONE_NUMBER = '+595992801111';
const WARNING_ICON = '\u26A0\uFE0F';

function normalizePhoneNumber(value: string) {
  return value.replace(/\D/g, '');
}

export const WHATSAPP_CONFIG = {
  phoneNumber: normalizePhoneNumber(WHATSAPP_PHONE_NUMBER)
};

function normalizeCheckoutValue(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export const formatWhatsAppMessage = (
  items: CartItem[],
  total: number,
  checkoutDetails: CheckoutDetails
) => {
  const lines = [
    'Hola Pasos Saludables, quiero confirmar este pedido:',
    '',
    '*Pedido web*',
    `*Nombre:* ${normalizeCheckoutValue(checkoutDetails.customerName)}`,
    `*Direccion:* ${normalizeCheckoutValue(checkoutDetails.address)}`,
    `*Metodo de pago:* ${normalizeCheckoutValue(checkoutDetails.paymentMethod)}`,
    `*Comprobante:* ${normalizeCheckoutValue(checkoutDetails.invoicePreference)}`,
    ''
  ];

  items.forEach((item) => {
    lines.push(`- *${item.product.name}*`);
    lines.push(`   Cantidad: ${item.quantity}`);
    lines.push(`   Precio unitario: ${formatPriceARS(item.product.price)}`);
    lines.push(`   Subtotal: ${formatPriceARS(item.product.price * item.quantity)}`);
    lines.push('');
  });

  lines.push(`*Total estimado:* ${formatPriceARS(total)}`);
  lines.push('');
  lines.push(
    `${WARNING_ICON} Ahora solo necesitamos que nos compartas tu ubicaci\u00F3n para coordinar correctamente la entrega.`
  );
  lines.push(
    `${WARNING_ICON} Toc\u00E1 el clip en WhatsApp y envi\u00E1nos tu ubicaci\u00F3n.`
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
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_CONFIG.phoneNumber}&text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};
