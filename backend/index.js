import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.route.js';

dotenv.config();
const app = express();
const PORT = 5000;

// Global rate limiter: 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: "false", message: "Too many requests, please try again later" },
});

app.use(generalLimiter);
app.use(cors({origin: process.env.MAIN_API, credentials: true}));
app.use(cookieParser());
app.use(express.json());

// CSRF protection: enforce JSON content-type on mutation requests
app.use("/api", (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
        const contentType = req.headers["content-type"];
        if (!contentType || !contentType.includes("application/json")) {
            return res.status(415).json({ success: "false", message: "Content-Type must be application/json" });
        }
    }
    next();
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port http://localhost:${PORT}`);
})