# Botion — Frontend

Next.js web app for Botion: landing page, auth, and a workspace UI for notes, Snaps, graphs, calendar, trash, and collaboration.

## Tech stack

- **Next.js 16** (App Router) — React 19
- **Apollo Client 4** — GraphQL + `graphql-ws` subscriptions
- **BlockNote** — Block-based page editor
- **Tailwind CSS 4** — Styling with light/dark theme
- **Radix UI** + **shadcn-style** components in `src/components/ui/`
- **@xyflow/react** — Graph editor
- **@dnd-kit** — Sidebar page reordering
- **sonner** — Save and action toasts
- **framer-motion** — UI motion
- **Bun** — Package manager and runtime for local development

## Prerequisites

- **Bun** 1.1+ ([install](https://bun.sh))
- [Backend](../backend/README.md) running on port **3000**

## Quick start

```bash
cd frontend
bun install
cp .env.local.example .env.local
bun dev
```

Open **http://localhost:3001**.

Default API URLs (no `.env.local` needed for local dev):

- HTTP: `http://localhost:3000/graphql`
- WebSocket: `ws://localhost:3000/graphql`

## Environment variables

Copy `.env.local.example` to `.env.local`:

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_GRAPHQL_URL` | `http://localhost:3000/graphql` | GraphQL HTTP endpoint |
| `NEXT_PUBLIC_GRAPHQL_WS_URL` | derived from HTTP | GraphQL subscriptions (`ws://` / `wss://`) |

## Main routes

| Path | Description |
|------|-------------|
| `/` | Marketing landing (demo CTA, features, pricing) |
| `/login`, `/register` | Auth (+ **Try free demo**) |
| `/workspace` | Home / filtered note list |
| `/workspace/notes/[noteId]` | Page editor (auto-save + toast) |
| `/workspace/graphs` | Graph list |
| `/workspace/graphs/[graphId]` | React Flow editor (auto-save) |
| `/workspace/calendar` | Calendar / updates |
| `/workspace/settings` | Profile and preferences |
| `/workspace?archived=1` | Trash |

Route-level `loading.tsx`, `error.tsx`, and `not-found.tsx` provide consistent status UI.

## Project structure

```
src/
├── app/                    # Next.js App Router pages and layouts
├── components/
│   ├── auth/               # Login, register, demo account
│   ├── landing/            # Marketing sections and illustrations
│   ├── layout/             # Status pages, loading shells
│   ├── providers/          # Apollo, auth, theme
│   ├── ui/                 # Shared UI primitives
│   └── workspace/          # Sidebar, editor, Snaps, dialogs, …
├── graphql/
│   ├── operations.ts       # Queries, mutations, subscriptions
│   └── types.ts            # TypeScript result types
├── hooks/                  # Sidebar, notifications, workspace create, …
└── lib/                    # Apollo, auth, content, URLs, cache helpers
```

## Features (UI)

- **Auto-save** — Notes and graphs debounce saves; success/error toasts via `sonner`
- **Trash** — Soft-deleted pages (`isArchived`); restore or empty trash
- **Drag & drop** — Reorder pages in the sidebar (`reorderNotes`)
- **Snaps panel** — References beside the document
- **People / sharing** — Page editors and workspace invites
- **Notifications** — Bell panel + GraphQL subscription
- **Command palette** — ⌘K quick navigation
- **Demo account** — One-click workspace with sample content (no signup)

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Dev server on port **3001** |
| `bun run build` | Production build |
| `bun run start` | Run production build |
| `bun run lint` | ESLint |
| `bun run check` | Biome check (format + lint) |
| `bun run format` | Biome format write |

## Development notes

- Auth token and user live in `localStorage` (`botion_token`, `botion_user`); Apollo cache can persist via `apollo3-cache-persist`.
- Page content uses BlockNote serialization (`__BOTION_BLOCKS:v1__` prefix in `lib/content.ts`).
- GraphQL errors and session expiry are handled in `lib/session-expired.ts` (redirect to login).
- For backend schema changes, restart the API and refresh; Apollo refetches on mutations where configured.

## Related

- [Backend README](../backend/README.md)
