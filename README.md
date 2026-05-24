# Surpass — Gestión de facturas PDF

Aplicación web para **Distribuidora Surpass** que permite iniciar sesión, ver un dashboard y subir facturas PDF de **Cerámica Lima (F004)** y **Saint-Gobain (FV01)** para extraer automáticamente cantidad, unidad, código, descripción, valor unitario, descuento, precio unitario y total por línea.

## Stack

- **Next.js 16.2.6** (App Router, React 19, TypeScript)
- **shadcn/ui** + Tailwind CSS
- **Supabase** (Auth, PostgreSQL, Storage) — producción
- **unpdf** — extracción de texto PDF en servidor
- **Vercel** — deploy gratuito (plan Hobby)

## Inicio rápido (desarrollo local)

Sin Supabase, la app usa almacenamiento local en `.data/` y login demo.

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) e ingresa con:

- **Email:** `admin@surpass.local`
- **Contraseña:** `surpass123`

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm test` | Tests de parsers PDF y reportes |
| `npm run lint` | ESLint |

## Variables de entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

### Modo local (sin Supabase)

```env
LOCAL_AUTH_EMAIL=admin@surpass.local
LOCAL_AUTH_PASSWORD=surpass123
```

### Modo producción (Supabase)

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

## Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. En **SQL Editor**, ejecuta el contenido de [`supabase/migrations/001_init.sql`](supabase/migrations/001_init.sql)
3. En **Authentication → Users**, crea el primer usuario del equipo
4. El bucket `facturas` se crea con la migración (público para lectura autenticada)

## Desplegar en Vercel (gratis)

1. Sube el repo a GitHub
2. Importa el proyecto en [vercel.com](https://vercel.com)
3. Añade las variables de entorno de Supabase en **Settings → Environment Variables**
4. Deploy automático en cada push

El plan **Hobby** de Vercel es gratuito e incluye dominio `*.vercel.app`. Supabase también tiene tier gratis (500 MB DB + 1 GB storage).

## Reportes

En **Reportes** (`/reportes`) puedes generar y descargar:

| Tipo | Descripción |
|------|-------------|
| Resumen del periodo | Totales, monto y promedio |
| Por proveedor | Participación por proveedor |
| Por mes | Desglose mensual del año |
| Listado de facturas | Cabeceras de factura |
| Detalle por línea | Ítems (como el Excel histórico) |
| Top productos | Agregado por código de producto |

Filtros: rango de **fecha de emisión**, proveedor o **subidas hoy**. Exportación en **Excel, CSV y PDF** con vista previa en pantalla.

## Estructura

```
app/
  login/                 # Pantalla de login
  dashboard/             # Dashboard analítico
  facturas/              # Subida y listado
  reportes/              # Módulo de reportes
  api/                   # Upload, listado, reportes, auth
lib/
  pdf/parsers/           # Parsers de facturas PDF
  reports/               # Generadores y exportación
  storage/               # Supabase o almacenamiento local
supabase/migrations/     # Esquema SQL
pdf/                     # PDFs de ejemplo para tests
```

## Formatos PDF soportados

| Proveedor | Serie | Detección |
|-----------|-------|-----------|
| Cerámica Lima | F004 | `CERAMICA LIMA`, `F004` |
| Saint-Gobain | FV01 | `SAINT-GOBAIN`, `FV01` |

Los PDFs deben tener texto embebido (no escaneados). Si el PDF es imagen, verás un aviso de que requiere OCR.

## Tests

Los tests usan los PDFs de ejemplo en `pdf/`:

```bash
npm test
```
