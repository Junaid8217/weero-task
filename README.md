# Weero — Full Stack Product Management Platform

A production-ready MERN stack application for managing product catalogues. Features JWT authentication, full CRUD operations, real-time search, filtering, sorting, and pagination — deployed on Netlify (frontend) and Render (backend).

**Live Demo:** [https://melodic-shortbread-324da4.netlify.app](https://melodic-shortbread-324da4.netlify.app)  
**Backend API:** [https://weero-task.onrender.com/api](https://weero-task.onrender.com/api)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios, React Hot Toast, Vite |
| Backend | Node.js, Express.js, express-validator |
| Database | MongoDB Atlas, Mongoose ODM |
| Auth | JWT (JSON Web Token), bcryptjs |
| Deployment | Netlify (frontend), Render (backend) |

---

## Features

- **Full CRUD** — Create, read, update, and delete products
- **JWT Auth** — Register, login, protected routes with token-based auth
- **Search** — Debounced real-time search across name, description, and category
- **Filter & Sort** — Filter by category, sort by price, name, or date
- **Pagination** — Server-side pagination, 9 products per page
- **Form Validation** — Client-side and server-side validation with error messages
- **Skeleton Loaders** — Shimmer loading states while fetching data
- **Toast Notifications** — Success and error feedback on all actions
- **Responsive Design** — Mobile-first, works on all screen sizes
- **CORS Configured** — Secure cross-origin setup for production and local dev

---

## Project Structure

```
weero-task/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, Get Me
│   │   └── productController.js   # CRUD + search + pagination
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protect middleware
│   ├── models/
│   │   ├── User.js                # User schema (bcrypt hashed passwords)
│   │   └── Product.js             # Product schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── productRoutes.js
│   ├── server.js                  # Express entry point
│   ├── vercel.json
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── _redirects             # Netlify SPA redirect rule
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx         # Footer with API docs + tech stack
│   │   │   ├── Navbar.jsx         # Sticky navbar with auth state
│   │   │   ├── ProductCard.jsx    # Product card with edit/delete
│   │   │   └── ProductForm.jsx    # Add/Edit modal form
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state (React Context)
│   │   ├── hooks/
│   │   │   └── useProducts.js     # Product CRUD custom hook
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Product listing + filters
│   │   │   ├── Login.jsx          # Login page
│   │   │   └── Register.jsx       # Register page
│   │   ├── utils/
│   │   │   └── api.js             # Axios instance + JWT interceptor
│   │   ├── App.jsx                # Router setup
│   │   └── index.css              # Global design system (CSS variables)
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## API Reference

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |
| `GET` | `/api/auth/me` | Protected | Get current user info |

### Products

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | Get all products (paginated) |
| `GET` | `/api/products/:id` | Public | Get a single product |
| `POST` | `/api/products` | Protected | Create a new product |
| `PUT` | `/api/products/:id` | Protected | Update a product |
| `DELETE` | `/api/products/:id` | Protected | Delete a product |

### GET /api/products — Query Parameters

| Param | Type | Default | Description |
|---|---|---|---|
| `search` | string | — | Search by name, description, category |
| `category` | string | — | Filter by category |
| `page` | number | `1` | Page number |
| `limit` | number | `9` | Items per page |
| `sortBy` | string | `createdAt` | `createdAt`, `price`, or `name` |
| `order` | string | `desc` | `asc` or `desc` |

### Example Response — GET /api/products

```json
{
  "success": true,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Wireless Headphones",
      "price": 99.99,
      "description": "Premium noise-cancelling headphones",
      "category": "Electronics",
      "imageUrl": "https://example.com/image.jpg",
      "createdAt": "2024-03-13T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 41,
    "page": 1,
    "pages": 5,
    "limit": 9
  }
}
```

---

## Local Development Setup

### Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas account — free at [mongodb.com/atlas](https://www.mongodb.com/atlas)

### 1. Clone the repo

```bash
git clone https://github.com/Junaid8217/weero-task.git
cd weero-task
```

### 2. MongoDB Atlas Setup

1. Sign in at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free **M0 cluster**
3. **Database Access** → Add a user with a username and password
4. **Network Access** → Add IP `0.0.0.0/0` (allow from anywhere)
5. **Connect** → Drivers → Copy the connection string
6. Replace `<username>` and `<password>` with your credentials

### 3. Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/weero_products
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

```bash
npm install
npm run dev
# Server running on http://localhost:5000
```

### 4. Frontend

Open a new terminal:

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm install
npm run dev
# App running on http://localhost:5173
```

---

## Deployment

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo, set root directory to `backend`
3. Build command: `npm install` — Start command: `node server.js`
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, `NODE_ENV=production`

### Frontend → Netlify

1. Create a new site on [netlify.com](https://netlify.com)
2. Connect your GitHub repo, set base directory to `frontend`
3. Build command: `npm run build` — Publish directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`

---

## Environment Variables

**backend/.env.example**
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/weero_products
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**frontend/.env.example**
```env
VITE_API_URL=https://weero-task.onrender.com/api
```

---

## Author

**Md Junaid Hossain** — Full Stack Developer  
Built as a technical assessment for Weero Digital.
