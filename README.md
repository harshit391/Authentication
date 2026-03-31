# Singla Authentication Service

A full-stack authentication system built with the MERN stack (MongoDB, Express.js, React, Node.js). Provides secure user registration, email verification, login, and password recovery with a polished, animated UI.

## Features

- **User Registration** with email and password validation
- **Email Verification** via 6-digit OTP codes
- **Secure Login** with JWT-based authentication
- **Password Recovery** with time-limited reset tokens sent via email
- **Protected Routes** requiring authentication and email verification
- **User Dashboard** displaying profile info and account activity
- **Password Strength Meter** with real-time visual feedback
- **Rate Limiting** on sensitive endpoints to prevent abuse
- **Animated UI** with Framer Motion transitions and floating background shapes

## Tech Stack

### Backend

- **Express.js** - Web framework
- **MongoDB** + **Mongoose** - Database and ODM
- **JSON Web Tokens** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** / **Mailtrap** - Email delivery
- **express-rate-limit** - Request rate limiting

### Frontend

- **React 18** - UI library
- **Vite** - Build tool with HMR
- **React Router v6** - Client-side routing
- **Zustand** - State management
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Lucide React** - Icons

## Project Structure

```
Authentication/
├── backend/
│   ├── index.js                 # Express server entry point
│   ├── controllers/
│   │   └── auth.controller.js   # Auth business logic
│   ├── routes/
│   │   └── auth.route.js        # API route definitions
│   ├── models/
│   │   └── user.model.js        # Mongoose User schema
│   ├── middleware/
│   │   └── verifyToken.js       # JWT verification middleware
│   ├── db/
│   │   └── connectDB.js         # MongoDB connection
│   ├── utils/
│   │   └── generateTokenAndSetCookie.js
│   └── mailtrap/
│       ├── mailtrap.config.js   # SMTP configuration
│       ├── emails.js            # Email sending functions
│       └── emailTemplates.js    # HTML email templates
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Routes and layout
│   │   ├── main.jsx             # React entry point
│   │   ├── pages/
│   │   │   ├── Home.jsx                  # Dashboard (protected)
│   │   │   ├── LoginPage.jsx             # Login form
│   │   │   ├── SignUpPage.jsx            # Registration form
│   │   │   ├── EmailVerificationPage.jsx # OTP verification
│   │   │   ├── ForgotPasswordPage.jsx    # Request password reset
│   │   │   └── ResetPasswordPage.jsx     # Set new password
│   │   └── components/
│   │       ├── Input.jsx                 # Reusable input field
│   │       ├── PasswordStrengthMeter.jsx # Password strength indicator
│   │       ├── LoadingSpinner.jsx        # Loading animation
│   │       └── FloatingShape.jsx         # Animated background shapes
│   └── store/
│       └── authStore.js         # Zustand auth state
│
├── package.json                 # Root (backend) dependencies & scripts
└── .gitignore
```

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** (local instance or a cloud service like MongoDB Atlas)
- **SMTP Email Service** (e.g., [Mailtrap](https://mailtrap.io/) for development)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/harshit391/Authentication.git
cd Authentication
```

### 2. Configure environment variables

**Backend** - create `backend/.env` from the example:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your values:

```env
MONGO_URI=mongodb://localhost:27017/auth-db
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development

# Frontend URL (for CORS origin)
MAIN_API=http://localhost:5173

# Client URL (used in password reset email links)
CLIENT_URL=http://localhost:5173

# Email (SMTP) configuration
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
CLIENT_USER=your_email_username
CLIENT_PASS=your_email_password
```

**Frontend** - create `frontend/.env` from the example:

```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:

```env
VITE_DB_API=http://localhost:5000
```

### 3. Install dependencies

```bash
# Backend dependencies (from root)
npm install

# Frontend dependencies
cd frontend
npm install
cd ..
```

### 4. Run the application

Start backend and frontend in separate terminals:

```bash
# Terminal 1 - Backend (runs on port 5000)
npm run dev

# Terminal 2 - Frontend (runs on port 5173)
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:5000`.

## API Endpoints

All routes are prefixed with `/api/auth`.

| Method | Endpoint                  | Description               | Rate Limit   |
|--------|---------------------------|---------------------------|--------------|
| POST   | `/signup`                 | Register a new user       | 10 req/15min |
| POST   | `/login`                  | Log in an existing user   | 10 req/15min |
| POST   | `/logout`                 | Log out the current user  | -            |
| POST   | `/verify-email`           | Verify email with OTP     | 10 req/15min |
| POST   | `/forgot-password`        | Request a password reset  | 5 req/15min  |
| POST   | `/reset-password/:token`  | Reset password with token | 5 req/15min  |
| GET    | `/check-auth`             | Check authentication status | -          |

A global rate limit of 100 requests per 15 minutes is also applied.

## Security

- Passwords hashed with **bcryptjs** (10 salt rounds)
- JWT tokens stored in **httpOnly, secure, sameSite** cookies (7-day expiry)
- Server-side **input validation** on all endpoints (email format, password strength)
- **Rate limiting** per endpoint and globally
- **CSRF protection** via Content-Type header validation
- Password reset tokens expire after **1 hour**
- Email verification tokens expire after **24 hours**

## Deployment

- **Frontend**: Configured for [Vercel](https://vercel.com/) with SPA rewrites (`vercel.json` included)
- **Backend**: Can be deployed to any Node.js hosting provider (Render, Railway, etc.)
- **Database**: Use [MongoDB Atlas](https://www.mongodb.com/atlas) for a managed cloud database

## License

ISC
