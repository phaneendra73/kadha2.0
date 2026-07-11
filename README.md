# ✍️ Kadha 2.0 – Edge-Powered Modern Blog Platform

**Kadha 2.0** is the modernized, serverless version of the Kadha blog writing platform. Built with **React 19**, **Vite**, **Chakra UI**, and migrated to Cloudflare's serverless edge database service **Cloudflare D1 (SQLite)**.

---

## ✨ Features & Improvements in Kadha 2.0

* ⚡ **Cloudflare D1 Serverless Database**: Complete migration from PostgreSQL/Prisma to edge-native SQLite on Cloudflare D1 (`c.env.DB`).
* 🎨 **Stunning Glassmorphic Design**: Modernized aesthetic with glassmorphic navigation, Framer Motion animations, dark theme tokens, and dynamic hover interactions.
* 📝 **Rich Markdown Experience**: Real-time reading progress indicator, instant copy link, code highlighting styling, and split-screen Markdown authoring.
* 🏷️ **Instant Search & Tag Filtering**: Debounced edge database search with drop-down preview and tag pills.
* 🛠️ **Full Administration & Tag Manager**: Dedicated Admin table for story status management and tag lifecycle control.

---

## 📂 Architecture & Directory Structure

```
kadha2.0/
├── backend/          # Cloudflare Worker API + Hono + Cloudflare D1 Database
│   ├── schema.sql    # D1 SQLite Database Schema
│   ├── seed.sql      # Demo User, Tags & Sample Blog Posts
│   └── src/          # Hono API Routes (/user & /blog)
└── frontend/         # Modern React 19 + Vite + Chakra UI Application
```

---

## 🚀 Getting Started Locally

### 1. Initialize & Seed Cloudflare D1 Database (Local SQLite)

Inside `kadha2.0/backend`, initialize your local D1 SQLite database:

```bash
cd kadha2.0/backend
npm install
npm run db:init
npm run db:seed
```

### 2. Start the Cloudflare D1 Backend API Server

```bash
npm run dev
```

The backend server runs at `http://localhost:8787`.

---

### 3. Start the Modern React Frontend

Open a new terminal window inside `kadha2.0/frontend`:

```bash
cd kadha2.0/frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to experience Kadha 2.0!

---

## ☁️ Deploying to Production (Cloudflare Pages & D1)

1. Create a remote D1 database on Cloudflare:
   ```bash
   wrangler d1 create kadha2-db
   ```
2. Run schema and seed migrations on your remote D1 database:
   ```bash
   npm run db:remote-init
   npm run db:remote-seed
   ```
3. Deploy your backend:
   ```bash
   npm run deploy
   ```
