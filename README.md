# Weero Digital — Product Management App

A full-stack web application where products can be added, viewed, updated, and deleted. Built as part of the Weero Digital task assessment.

**Live Demo:** 

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Axios, React Hot Toast |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT (JSON Web Token) + bcryptjs |
| Build Tool | Vite |

---

## Features

- **Product CRUD** — Create, Read, Update, Delete products
- **Product Form** — Name, Price, Image URL, Description fields
- **Search** — Search products by name, description, category
- **Filter** — Filter by category and price range
- **Pagination** — 9 products per page
- **JWT Authentication** — Register & Login
- **Loading & Error Handling** — Skeleton loaders, toast notifications, form validation
- **Responsive UI** — Works on all screen sizes

---

## Project Structure

```
weero-task/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Get Me
│   │   └── productController.js  # CRUD + search + pagination
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT protect middleware
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt
│   │   └── Product.js            # Product schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── productRoutes.js
│   ├── server.js                 # Express entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Sticky navbar with auth state
│   │   │   ├── ProductCard.jsx   # Product card with edit/delete
│   │   │   └── ProductForm.jsx   # Add/Edit modal form
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state
│   │   ├── hooks/
│   │   │   └── useProducts.js    # Product API custom hook
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Product listing page
│   │   │   ├── Login.jsx         # Login page
│   │   │   └── Register.jsx      # Register page
│   │   ├── utils/
│   │   │   └── api.js            # Axios instance with JWT interceptor
│   │   ├── App.jsx               # Routes
│   │   └── index.css             # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## API Endpoints

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get JWT token |
| GET | `/api/auth/me` | Protected | Get current logged in user |

### Products

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Public | Get all products |
| GET | `/api/products/:id` | Public | Get single product |
| POST | `/api/products` | Protected | Create new product |
| PUT | `/api/products/:id` | Protected | Update product |
| DELETE | `/api/products/:id` | Protected | Delete product |

#### GET /api/products — Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search by name, description, category |
| `category` | string | Filter by category |
| `minPrice` | number | Minimum price |
| `maxPrice` | number | Maximum price |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 9) |
| `sortBy` | string | `createdAt`, `price`, `name` |
| `order` | string | `asc` or `desc` |

---

## Setup Process

### Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas account (free at [mongodb.com/atlas](https://www.mongodb.com/atlas))

---

### 1. Clone the repository

```bash
git clone https://github.com/Junaid8217/weero-task.git
cd weero-task
```

---

### 2. MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and sign in
2. Create a free **M0 cluster**
3. **Database Access** → Add a database user with username & password
4. **Network Access** → Add IP Address → Allow from Anywhere (`0.0.0.0/0`)
5. **Clusters** → Connect → Drivers → Copy the connection string
6. Replace `<username>` and `<password>` with your database user credentials

---

### 3. Backend Setup

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/weero_products?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

```bash
npm install
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB Atlas Connected: cluster0.xxxxxx.mongodb.net
```

---

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The frontend `.env` only needs one value — it points to your backend:

```env
VITE_API_URL=http://localhost:5000/api
```

No changes needed here unless your backend runs on a different port.

Open your browser at **http://localhost:5173**

---

## .env.example Files

**backend/.env.example**
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/weero_products?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**frontend/.env.example**
```env
VITE_API_URL=http://localhost:5000/api
```