# Marketplace Product Creation Module

A production-ready product creation experience for marketplace sellers, built with Next.js App Router, TypeScript, shadcn-style UI, and React Query. It focuses on realistic workflows: smart autofill, autosave, validation, and a live preview that makes the form feel like a real commercial tool rather than a basic CRUD page.

## Features

- **Multi-section product form**
  - Sections: Basic information, Pricing, SEO & discovery, Location.
  - Clear grouping using cards, responsive grid layout, and helpful copy.
- **Smart autofill from product name**
  - Debounced logic based on the product name that:
    - Generates short and long descriptions.
    - Suggests SEO title and description.
    - Builds SEO keyword lists from the name.
    - Auto-generates a slug-like code when empty.
    - Heuristically selects category and global category ids.
- **Autosave drafts**
  - Watches form state and saves it to `localStorage` with debounce.
  - Restores the last draft on reload.
  - Keeps drafts in sync across tabs using the `storage` event.
  - Shows a human-readable draft status indicator (saving / saved / ready).
- **Completion progress**
  - Tracks a curated list of required fields.
  - Shows a progress bar and percentage of completion in the header.
- **Inline validation**
  - Zod schema for the full payload expected by the API.
  - React Hook Form + Zod resolver for real-time validation.
  - Per-field inline messages and helper text.
- **Micro-features for marketplace workflows**
  - Auto-generate internal code from the name.
  - Keyword generator from name/title.
  - Address → mock geocoding (lat/lng) for preview and downstream use.
  - Price preview using localized currency formatting.
  - Duplicate product action (clone form state as “(copy)”).
  - Reset form and clear draft storage.
  - Live product preview card showing how the listing will appear.
- **API integration**
  - Typed integration with a TableCRM nomenclature endpoint using:
    - `NEXT_PUBLIC_API_URL`
    - `NEXT_PUBLIC_API_TOKEN`
  - Uses TanStack Query for mutations with:
    - Network, validation, and unknown error handling modeled via discriminated union.
    - Success and error alerts rendered in the UI.
- **Polished UI/UX**
  - shadcn-style components (buttons, cards, inputs, badges, alerts, progress).
  - Accessible focus states and keyboard-friendly controls.
  - Responsive 2-column layout that gracefully degrades on small screens.
  - Dark mode-ready via `next-themes` and Tailwind `darkMode: "class"`.

## Tech Stack

- **Framework**: Next.js (App Router, React 18, `src/app`)
- **Language**: TypeScript with strict settings
- **UI**:
  - TailwindCSS + `tailwind-merge` + `clsx`
  - shadcn-style component primitives (`button`, `input`, `card`, `alert`, etc.)
- **Forms & Validation**:
  - React Hook Form
  - Zod + `@hookform/resolvers`
- **Data fetching / API**:
  - TanStack Query (React Query)
  - Native `fetch` with typed error handling
- **Theming**:
  - `next-themes` for dark mode via CSS classes

## Architecture

The project follows a **feature-sliced** layout aimed at scaling beyond a single form.

```text
src/
  app/
    layout.tsx     # App shell, providers
    page.tsx       # Entry point – product creation screen
  features/
    product/
      api/         # API client & React Query hooks (create product)
      components/  # UI building blocks for this feature
      hooks/       # Feature-specific hooks (form behavior, autosave, autofill)
      model/       # Types, schemas, constants
  shared/
    lib/           # Reusable utilities (cn, slugify, formatting, providers)
    ui/            # Reusable UI components (shadcn-style primitives)
```

### Why this structure?

- **Separation by feature** keeps domain logic (product creation) close to its components and hooks.
- **Shared** layer is intentionally small and generic:
  - UI primitives are re-usable and un-opinionated.
  - Lib utilities are safe to import from anywhere.
- The **App Router** (`src/app`) only wires pages and layouts; it does not contain business logic.

This layout scales naturally when adding more marketplace capabilities (e.g. product listing, editing, analytics) by adding new `features/*` folders.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/marketplace-product-module.git
cd marketplace-product-module
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root based on `.env.example`:

```bash
cp .env.example .env.local
```

Then set:

- `NEXT_PUBLIC_API_URL` – base URL of the nomenclature API (e.g. `https://app.tablecrm.com/api/v1/nomenclature/`)
- `NEXT_PUBLIC_API_TOKEN` – personal/token for the API

> These are exposed as `NEXT_PUBLIC_*` on purpose because they are required in the browser to call the API directly from the client. Do not commit real tokens; only keep placeholders in `.env.example`.

### 4. Run the development server

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

You should see the product creation screen with the multi-section form and live preview.

## Environment Variables

Defined in `.env.example`:

```bash
NEXT_PUBLIC_API_URL=https://app.tablecrm.com/api/v1/nomenclature/
NEXT_PUBLIC_API_TOKEN=your-token-here
```

Usage in code:

- `src/features/product/api/create-product.ts` reads:
  - `process.env.NEXT_PUBLIC_API_URL`
  - `process.env.NEXT_PUBLIC_API_TOKEN`

If either is missing at runtime, the API hook will throw a typed error with a clear message, surfaced in the UI.

## Scripts

`package.json` exposes the standard Next.js scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

- **`npm run dev`** – start the local development server.
- **`npm run build`** – create a production build.
- **`npm start`** – run the built app in production mode.
- **`npm run lint`** – run ESLint.

## Type Safety & Linting

- TypeScript is enabled in **strict** mode, and the form is fully typed end-to-end via Zod and `ProductFormValues`.
- The React Query mutation and components are typed to avoid accidental `any` usage.
- ESLint is configured via `eslint-config-next` and can be run with `npm run lint`.

Before pushing, it is recommended to run:

```bash
npm run lint
npm run build
```

Both should complete without errors in a correctly configured environment.

## Deployment (Vercel)

The project is designed to be deployed to Vercel with minimal configuration.

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial production-ready product creation module"
git branch -M main
git remote add origin https://github.com/<your-username>/marketplace-product-module.git
git push -u origin main
```

### 2. Import the project in Vercel

1. Go to the Vercel dashboard.
2. Click **“New Project”** → **“Import Git Repository”**.
3. Select your `marketplace-product-module` repository.
4. Vercel will auto-detect **Next.js**:
   - Build command: `npm run build`
   - Output directory: `.next`

### 3. Configure environment variables

In the Vercel project settings, add the same variables as in your `.env.local`:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_API_TOKEN`

Scope them to **Production** (and optionally Preview / Development).

### 4. Deploy

- Click **Deploy** – Vercel will build and deploy the project.
- The resulting URL should immediately show the product creation interface.

Subsequent pushes to `main` (or your configured production branch) will trigger automatic deployments.

## Production Readiness Notes

- **No secrets in code** – API URL and token are read from environment variables, with only placeholders in `.env.example`.
- **Clean root** – Only necessary configuration and source files are present; app code lives inside `src/`.
- **Strict typing and validation** – Zod + TypeScript provide both compile-time and runtime guarantees.
- **Error handling** – User-friendly messages for network/configuration issues and backend errors.
- **Scalable architecture** – Feature-sliced layout and shared primitives make it easy to extend to additional marketplace flows.

This makes the repository suitable for sharing publicly as a portfolio piece and for deploying as a real-world product creation module.

