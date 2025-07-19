# Multi-University AI Assistant – Frontend

This directory contains the **Vite + React + TypeScript** frontend application.

---

## 🚀 Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   pnpm install 
   # or
   npm install 
   # or
   yarn install
   ```

3. **(Optional) Configure Backend API URL:**

   If your backend isn't running at `http://localhost:8000`, create a `.env` file in the `frontend/` directory and add your custom API URL:

   ```dotenv
   VITE_API_URL=http://your-backend-api-url.com
   ```

---

## 🧪 Running the Development Server

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

This will start the **Vite development server**, usually accessible at:

```
http://localhost:5173
```

---

## 🏗️ Building for Production

```bash
pnpm run build
# or
npm run build
# or
yarn build
```

This creates a `dist/` directory with the **optimized production build**.

---

## 📦 Key Libraries Used

* **Vite** – Build tool and dev server
* **React** – UI library
* **TypeScript** – Type safety
* **Tailwind CSS** – Utility-first CSS framework
* **React Router** – Client-side routing
* **TanStack Query (React Query)** – Data fetching and caching
* **Zustand** – Lightweight global state management (e.g., session, user credentials, saved majors)
* **Swiper.js** – Touch slider/carousel used in the major matching deck
* **Framer Motion** – Animation library
* **Lucide React** – Icon library
* **React Hot Toast** – Toast notifications
* **React Confetti** – Confetti effect (used for swipe deck completion)

