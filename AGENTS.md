# AGENTS.md

Guía para agentes de IA que trabajan en **PasosSaludables** (Astro + React sobre PostgreSQL). Storefront público con carrito por WhatsApp + dashboard admin de inventario y tesorería.

## Stack

- **Astro 4** en modo `output: 'server'` con adapter `@astrojs/node` (standalone)
- **React 18** para islas interactivas (`StorefrontApp`, `DashboardApp`)
- **Tailwind CSS 3**
- **PostgreSQL** vía la librería `postgres` (driver `sql` tag)
- **Zustand** para estado de cliente, **react-hook-form** + **zod** para formularios
- **TypeScript** estricto

## Gestor de paquetes y Node

- Usa **pnpm** (campo `packageManager` en `package.json`). Instala con `pnpm install`. Lockfile: `pnpm-lock.yaml`.
- Requiere **Node 20.x** (ver `.nvmrc`). Con Node 24 el proyecto falla con `spawn EPERM` / `The service is no longer running` de esbuild/Astro. Verifica con `node -v`.
- En Windows, si PowerShell bloquea `pnpm.ps1`, usa `pnpm.cmd run dev`.

## Comandos

| Comando | Qué hace |
|---|---|
| `pnpm run dev` | Servidor de desarrollo (corre `sync:assets` antes vía `predev`) |
| `pnpm run build` | Build de producción |
| `pnpm run preview` | Preview del build |
| `pnpm run sync:assets` | Sincroniza assets del storefront (`scripts/sync-stock-assets.mjs`) |
| `npx tsc --noEmit` | Type-check (debe pasar limpio antes de dar por terminado un cambio) |

Los scripts `dev`/`build`/`preview` se invocan mediante `scripts/run-astro.mjs`, no `astro` directo.

## Estructura

```
src/
  pages/
    index.astro          # Storefront público
    admin.astro          # Dashboard admin
    api/                 # Endpoints REST (Astro server endpoints)
      products/, categories/, treasury/, analytics/, uploads/
      admin-login.ts, dashboard.ts, stock-movements.ts, init-db.ts, upload-image.ts
    uploads/[...path].ts # Sirve imágenes subidas desde disco
  components/
    StorefrontApp.tsx    # Isla React del storefront
    DashboardApp.tsx     # Isla React del dashboard
    Admin/, Cart/
  lib/
    database.ts          # Cliente `sql` + `ensureSchema()` (crea tablas con CREATE TABLE IF NOT EXISTS)
    formatters.ts, whatsapp.ts, userAgent.ts
  stores/                # Zustand: cartStore, productStore
  types/index.ts         # Tipos compartidos (Product, Category, etc.)
  layouts/Layout.astro
```

## Convenciones

- **Idioma**: comentarios y mensajes en español. Mantén ese estilo.
- **Base de datos**: el esquema se crea/migra en runtime con `ensureSchema()` en `src/lib/database.ts` usando `CREATE TABLE IF NOT EXISTS`. No hay carpeta de migraciones — los cambios de esquema van ahí.
- **Queries**: usa el tag `sql` de la librería `postgres` (parametrizado, evita inyección). Importa `sql` desde `src/lib/database.ts`.
- **Endpoints API**: son server endpoints de Astro (`export const GET/POST/...`). Auth admin vía `AUTH_USERNAME`/`AUTH_PASSWORD`.
- **Tipos**: define/usa los tipos compartidos de `src/types/index.ts`.

## Variables de entorno

Ver `.env.example`. Claves principales:

- `DATABASE_URL` (requerida; SSL se activa solo si la cadena incluye `sslmode=require`)
- `AUTH_USERNAME`, `AUTH_PASSWORD` (login del dashboard)
- `ANALYTICS_TIMEZONE` (default `America/Asuncion`)

**Nunca** commitees `.env` (contiene credenciales reales; ya fue removido del repo).

## Deploy

- Containerizado con **Docker** (`Dockerfile` + `docker-compose.yml`): app + Postgres, uploads persistidos a disco.
- Corre en un VPS (`72.60.15.125:8090`); Traefik ocupa los puertos 80/443. Deploy pull-based desde el VPS vía cron (ver `.github/`).

## Antes de terminar un cambio

1. `npx tsc --noEmit` debe pasar limpio.
2. Si tocaste el esquema, hazlo en `ensureSchema()` (`src/lib/database.ts`).
3. No introduzcas dependencias de Node 24+ ni rompas el flujo de pnpm.
