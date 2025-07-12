# Multi-University AI Assistant - Frontend\n\nThis directory contains the Vite + React + TypeScript frontend application.\n\n## Setup\n\n1.  **Navigate to the frontend directory:**\n    ```bash\n    cd frontend\n    ```\n2.  **Install dependencies:**\n    ```bash\n    pnpm install \n    # or npm install or yarn install\n    ```\n3.  **(Optional) Configure Backend API URL:**\n    Create a `.env` file in this directory (`frontend/.env`) and add the backend URL if it's not running on `http://localhost:8000`:\n    ```dotenv\n    VITE_API_URL=http://your-backend-api-url.com\n    ```\n\n## Running the Development Server\n\n```bash\npnpm dev\n# or npm run dev or yarn dev\n```\n\nThis will start the Vite development server, typically at `http://localhost:5173`.\n\n## Building for Production\n\n```bash\npnpm run build\n# or npm run build or yarn build\n```\n\nThis creates a `dist` directory with the optimized production build.\n\n## Key Libraries Used\n
*   **Vite:** Build tool and development server.
*   **React:** UI library.
*   **TypeScript:** Type safety.
*   **Tailwind CSS:** Utility-first CSS framework.
*   **React Router:** Client-side routing.
*   **TanStack Query (React Query):** Data fetching and state management.
*   **Zustand:** Global state management (for session, user credentials, saved majors).
*   **Swiper.js:** Touch slider/carousel for the major matching deck.
*   **Framer Motion:** Animations.
*   **Lucide React:** Icons.
*   **React Hot Toast:** Notifications.
*   **React Confetti:** Fun effect for completing the swipe deck.
