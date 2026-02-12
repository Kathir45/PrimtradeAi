# Primtrade.ai — Scalable Web App with Auth & Dashboard

A production-ready, full-stack web application featuring JWT authentication, user profile management, and a complete task management dashboard. Built with modern technologies and industry best practices.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Next.js 14 (App Router) + React 18 |
| Styling    | Tailwind CSS 3                    |
| Backend    | Node.js + Express 4               |
| Database   | MongoDB (Mongoose 8)              |
| Auth       | JWT (jsonwebtoken) + bcryptjs     |
| Validation | Zod (server) + custom (client)    |
| HTTP       | Axios                             |
| Icons      | Lucide React                      |
| Toasts     | React Hot Toast                   |

---

## Project Structure

```
Primtrade.ai/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Logout
│   │   ├── userController.js     # Get profile, Update profile
│   │   └── taskController.js     # CRUD tasks + search/filter
│   ├── middlewares/
│   │   ├── auth.js               # JWT verification middleware
│   │   ├── errorHandler.js       # Centralized error handler
│   │   └── validate.js           # Zod validation middleware
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt hooks
│   │   └── Task.js               # Task schema with indexes
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/
│   │   ├── ApiError.js           # Custom error class
│   │   ├── generateToken.js      # JWT helper functions
│   │   └── validators.js         # Zod schemas
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Express entry point
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── layout.js         # Dashboard layout with sidebar
│   │   │   ├── page.js           # Overview with stats
│   │   │   ├── profile/page.js   # Profile settings
│   │   │   └── tasks/page.js     # Full CRUD task manager
│   │   ├── login/page.js         # Login form
│   │   ├── register/page.js      # Registration form
│   │   ├── globals.css           # Tailwind + custom styles
│   │   ├── layout.js             # Root layout with providers
│   │   └── page.js               # Landing page
│   ├── components/
│   │   ├── InputField.js         # Reusable form input
│   │   ├── LoadingSpinner.js     # Spinner component
│   │   └── ProtectedRoute.js     # Auth guard wrapper
│   ├── hooks/
│   │   └── useAuth.js            # Auth context + provider
│   ├── services/
│   │   ├── api.js                # Axios instance + interceptors
│   │   ├── authService.js        # Auth API calls
│   │   ├── taskService.js        # Task API calls
│   │   └── userService.js        # User API calls
│   ├── utils/
│   │   └── validation.js         # Client-side validators
│   ├── .env.local
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── primtrade-api.postman_collection.json
└── README.md
```

---

## Assignment Checklist (Status)

### ✅ Frontend (Primary Focus)
- [x] Built with React/Next.js (Next.js 14, App Router)
- [x] Responsive design (Tailwind CSS)
- [x] Forms with validation (client + server)
- [x] Protected routes (auth-guarded dashboard)

### ✅ Basic Backend (Supportive)
- [x] Node.js/Express backend implemented
- [x] JWT-based user signup/login/logout APIs
- [x] Profile fetching/updating APIs
- [x] CRUD APIs for tasks (sample entity)
- [x] Database integration (MongoDB + Mongoose)

### ✅ Dashboard Features
- [x] User profile display (fetched from backend)
- [x] CRUD-enabled tasks UI
- [x] Search and filter UI
- [x] Logout flow

### ✅ Security & Scalability
- [x] Password hashing (bcrypt)
- [x] JWT auth middleware
- [x] Centralized error handling & validation
- [x] Modular, scalable project structure

### ✅ Deliverables
- [x] Frontend + backend in one repo
- [x] Functional auth (register/login/logout with JWT)
- [x] Dashboard with CRUD entity
- [x] Postman collection included
- [x] Scaling notes included

---

## Setup Instructions

### Prerequisites

- **Node.js** v18+ installed
- **MongoDB** running locally or a MongoDB Atlas URI
- **npm** or **yarn** package manager

### 1. Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd Primtrade.ai

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/primtrade
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

---

## API Documentation

### Base URL: `http://localhost:5000/api`

### Health Check

| Method | Endpoint       | Description       |
|--------|----------------|-------------------|
| GET    | `/api/health`  | API health check  |

### Authentication

| Method | Endpoint             | Body                              | Description         |
|--------|----------------------|-----------------------------------|---------------------|
| POST   | `/api/auth/register` | `{ name, email, password }`       | Register new user   |
| POST   | `/api/auth/login`    | `{ email, password }`             | Login user          |
| POST   | `/api/auth/logout`   | —                                 | Logout (clear cookie) |

### User (Protected — requires JWT)

| Method | Endpoint           | Body                  | Description         |
|--------|--------------------|-----------------------|---------------------|
| GET    | `/api/user/me`     | —                     | Get current profile |
| PUT    | `/api/user/update` | `{ name?, email? }`   | Update profile      |

### Tasks (Protected — requires JWT)

| Method | Endpoint           | Body / Query                             | Description         |
|--------|--------------------|------------------------------------------|---------------------|
| POST   | `/api/tasks`       | `{ title, description?, status? }`       | Create task         |
| GET    | `/api/tasks`       | `?search=&status=&page=&limit=`          | Get tasks (filtered)|
| PUT    | `/api/tasks/:id`   | `{ title?, description?, status? }`      | Update task         |
| DELETE | `/api/tasks/:id`   | —                                        | Delete task         |

### Response Format

All responses follow a consistent structure:

```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes Used

| Code | Meaning                          |
|------|----------------------------------|
| 200  | Success                          |
| 201  | Created                          |
| 400  | Bad Request (validation error)   |
| 401  | Unauthorized                     |
| 404  | Not Found                        |
| 409  | Conflict (duplicate resource)    |
| 500  | Internal Server Error            |

---

## Security Measures

1. **Password Hashing**: bcrypt with 12 salt rounds — passwords never stored in plaintext
2. **JWT Authentication**: Tokens signed with a secret key, stored in httpOnly cookies + Authorization header fallback
3. **Protected Routes**: Auth middleware verifies JWT before granting access to private endpoints
4. **Input Validation**: Zod schemas validate all inputs on the server; client-side validation provides instant feedback
5. **CORS Configuration**: Restricted to the specific frontend origin with credentials support
6. **Password Field Protection**: User model uses `select: false` on the password field — it's never returned in queries
7. **Centralized Error Handling**: Consistent error responses; no stack traces leaked in production
8. **Request Size Limiting**: Express JSON body limited to 10KB to prevent abuse
9. **Environment Variables**: All secrets stored in `.env` files, never committed to version control
10. **Parameterized Queries**: Mongoose ORM prevents NoSQL injection by default

---

## How This Scales in Production

### Frontend Optimization

- **Next.js SSR/SSG**: Server-side rendering for SEO and initial load performance
- **Code Splitting**: App Router automatically code-splits per route
- **Image Optimization**: Next.js `<Image>` component for responsive, lazy-loaded images
- **Edge Caching**: Deploy on Vercel/Cloudflare for global CDN distribution
- **Bundle Analysis**: Use `@next/bundle-analyzer` to identify and remove bloat
- **React Server Components**: Move data fetching to server components to reduce client JS

### Backend Scaling

- **Horizontal Scaling**: Stateless JWT auth enables running multiple server instances behind a load balancer
- **Database Indexing**: Compound indexes on Task model for efficient queries at scale
- **Connection Pooling**: Mongoose manages MongoDB connection pools automatically
- **Rate Limiting**: Add `express-rate-limit` to prevent API abuse
- **Caching Layer**: Add Redis for session caching and frequently accessed data
- **Message Queues**: Offload heavy operations (email, notifications) to Bull/RabbitMQ workers
- **API Versioning**: Prefix routes with `/api/v1/` for backward-compatible evolution
- **Monitoring**: Integrate Sentry for error tracking, Prometheus + Grafana for metrics

### Auth Improvements

- **Refresh Tokens**: Short-lived access tokens (15min) + long-lived refresh tokens for better security
- **OAuth 2.0**: Add Google/GitHub social login via Passport.js
- **Role-Based Access**: Implement user roles (admin, user) with permission middleware
- **Account Lockout**: Lock accounts after N failed login attempts
- **Password Reset**: Email-based forgot password flow with time-limited tokens
- **Two-Factor Authentication**: TOTP-based 2FA using speakeasy/otplib
- **Token Blacklisting**: Redis-backed token blacklist for immediate logout across devices

---

## Postman Collection

Import `primtrade-api.postman_collection.json` from the project root into Postman to test all API endpoints. The collection includes pre-configured requests for:

- User registration and login
- Profile management
- Full task CRUD
- Search and filter queries

---

## Backend Assignment Checklist (Status)

### ✅ Backend (Primary Focus)
- [x] User registration & login APIs with password hashing and JWT auth
- [x] Role-based access (user vs admin) — admin-only route added
- [x] CRUD APIs for tasks (sample entity)
- [x] API versioning, error handling, validation
- [x] API documentation (Postman collection)
- [x] Database schema (MongoDB + Mongoose)

### ✅ Basic Frontend (Supportive)
- [x] Built with Next.js
- [x] UI for register/login
- [x] Protected dashboard (JWT required)
- [x] CRUD actions on tasks
- [x] Error/success messages surfaced in UI

### ✅ Security & Scalability
- [x] Secure JWT handling (httpOnly cookie + header fallback)
- [x] Input sanitization & validation (Zod + client validators)
- [x] Scalable project structure for new modules
- [x] Optional enhancements outlined (caching/logging/Docker)

---

## License

MIT — built for the Primtrade.ai Frontend Developer Intern assignment.
