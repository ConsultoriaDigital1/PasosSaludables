import { WhatsAppIcon } from './productHelpers';

// Botón flotante de WhatsApp (esquina inferior derecha).
export default function WhatsAppFab({
  phoneNumber,
  message = 'Hola Pasos Saludables! Quiero hacer una consulta sobre un producto.'
}: {
  phoneNumber: string;
  message?: string;
}) {
  const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl ring-4 ring-white/70 transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
