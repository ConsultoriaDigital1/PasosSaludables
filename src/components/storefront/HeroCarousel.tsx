import { useCallback, useEffect, useRef, useState } from 'react';

type Slide = {
  eyebrow: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  gradient: string;
  image: string;
};

// Fondos del carrusel: fotos acordes al stock real (frutos secos, café) más una
// toma de la cascada local. Cada slide combina la imagen con un degradado verde
// de la marca por encima, semitransparente, para que el texto blanco siga
// legible. Misma UX que antes (auto-avance, flechas, puntos, swipe).
// Las de Unsplash (uso libre) se sirven desde su CDN a 2000px.
const IMG = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=80`;

const SLIDES: Slide[] = [
  {
    eyebrow: 'Tienda paraguaya · stock real',
    title: 'Comprar saludable no tiene que ser un trámite',
    text: 'Filtrás, elegís y cerrás el pedido por WhatsApp con información real del stock.',
    ctaLabel: 'Ver catálogo',
    ctaHref: '#catalogo',
    gradient:
      'linear-gradient(120deg, rgba(14,47,30,0.88) 0%, rgba(23,59,45,0.80) 55%, rgba(36,90,60,0.72) 100%)',
    // Frutos secos surtidos (nueces, pistachos, avellanas, maní).
    image: IMG('photo-1600189020840-e9918c25269d')
  },
  {
    eyebrow: 'Lo más buscado',
    title: 'Destacados frescos, elegidos por nuestro equipo',
    text: 'Descubrí los productos que más se piden, siempre con stock al día.',
    ctaLabel: 'Ver destacados',
    ctaHref: '#destacados',
    gradient:
      'linear-gradient(120deg, rgba(24,59,45,0.86) 0%, rgba(74,110,30,0.76) 50%, rgba(109,143,47,0.70) 100%)',
    // Café de filtro (categoría CAFÉ del stock).
    image: IMG('photo-1442512595331-e89e73853f31')
  },
  {
    eyebrow: 'Atención personalizada',
    title: 'Cerrás el pedido con una persona real',
    text: 'Armá tu carrito y coordinamos entrega y pago directo por WhatsApp.',
    ctaLabel: 'Cómo comprar',
    ctaHref: '#como-comprar',
    gradient:
      'linear-gradient(120deg, rgba(16,48,31,0.86) 0%, rgba(33,80,60,0.78) 55%, rgba(70,103,33,0.70) 100%)',
    // Cascada local (Salto Cristal) — imagen de marca.
    image: '/assets/cascada-fondo.jpg'
  }
];

const INTERVAL = 5000;
const SWIPE_MIN = 40;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const goTo = useCallback((i: number) => {
    setIndex((i + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL);
    return () => window.clearInterval(timer);
  }, [index, paused]);

  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < SWIPE_MIN) return;
    if (dx < 0) next();
    else prev();
  }

  return (
    <section
      className="group relative w-full overflow-hidden"
      aria-roledescription="carrusel"
      aria-label="Promociones destacadas"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.title}
            className="relative flex w-full shrink-0 items-center bg-cover bg-center"
            style={{ backgroundImage: `${slide.gradient}, url("${slide.image}")` }}
            aria-hidden={i !== index}
          >
            <div className="mx-auto flex min-h-[300px] w-full max-w-7xl flex-col justify-center gap-4 px-6 py-12 sm:min-h-[360px] sm:px-10 md:min-h-[420px]">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 sm:text-xs">
                {slide.eyebrow}
              </span>
              <h2 className="max-w-2xl font-serif text-3xl leading-tight text-white sm:text-4xl md:text-5xl">
                {slide.title}
              </h2>
              <p className="max-w-xl text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
                {slide.text}
              </p>
              <a
                href={slide.ctaHref}
                className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-marca-800 shadow-lg transition-transform hover:scale-105"
              >
                {slide.ctaLabel}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Anterior"
        className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-marca-800 shadow-md backdrop-blur transition hover:bg-white md:h-10 md:w-10 md:opacity-0 md:group-hover:opacity-100"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Siguiente"
        className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-marca-800 shadow-md backdrop-blur transition hover:bg-white md:h-10 md:w-10 md:opacity-0 md:group-hover:opacity-100"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir al slide ${i + 1}`}
            aria-current={i === index}
            className="p-1"
          >
            <span
              className={`block h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-white' : 'w-2 bg-white/60 hover:bg-white/80'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
