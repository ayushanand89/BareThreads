# BareThreads

BareThreads is a modern e-commerce platform for fashion, featuring a full-stack architecture with a React + Vite frontend and a Node.js/Express backend.

---

## Monorepo Structure

```
BareThreads/
├── backend/      # Node.js/Express API, database models, authentication, admin features
├── frontend/     # React + Vite SPA, Redux, Tailwind CSS, PayPal integration
├── README.md     # Project overview (this file)
```

---

## Features

- User authentication (register, login, logout)
- Product catalog with search and filtering
- Shopping cart (guest and user, with merging)
- Order placement and history
- Admin dashboard for managing products, users, and orders
- PayPal payment integration
- Newsletter subscription
- Responsive design

---

## Technology Stack & Usage

### Frontend

| Technology    | Used For                                   |
| ------------- | ------------------------------------------ |
| React         | Building user interfaces                   |
| Vite          | Fast development/build tooling             |
| Redux Toolkit | State management (cart, auth, admin, etc.) |
| React Router  | Client-side routing                        |
| Tailwind CSS  | Utility-first CSS styling                  |
| Axios         | HTTP requests to backend API               |
| PayPal JS SDK | Payment integration                        |
| ESLint        | Linting and code quality                   |

### Backend

| Technology | Used For                         |
| ---------- | -------------------------------- |
| Node.js    | JavaScript runtime               |
| Express    | Web server and API framework     |
| MongoDB    | Database                         |
| Mongoose   | MongoDB object modeling          |
| JWT        | Authentication (JSON Web Tokens) |
| bcrypt     | Password hashing                 |
| dotenv     | Environment variable management  |
| nodemon    | Development server auto-reload   |
| CORS       | Cross-origin resource sharing    |

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (for backend)

### Setup

1. **Clone the repository:**

   ```sh
   git clone <repo-url>
   cd BareThreads
   ```

2. **Install dependencies for both frontend and backend:**

   ```sh
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. **Configure environment variables:**

   - Copy `.env.example` to `.env` in both `backend/` and `frontend/` and fill in required values.

4. **Start the backend:**

   ```sh
   cd ../backend
   npm run dev
   ```

5. **Start the frontend:**

   ```sh
   cd ../frontend
   npm run dev
   ```

6. **Access the app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000) (default)

---

## Scripts

- `npm run dev` — Start development server (frontend or backend)
- `npm run build` — Build frontend for production
- `npm run lint` — Lint code (frontend)

---

## License

MIT

---

**BareThreads** — Modern e-commerce for fashion.
