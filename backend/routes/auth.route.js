import express from "express";
import rateLimit from "express-rate-limit";
import { signup, login, logout, verifyEmail, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { checkAuth } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Strict limiter for login/signup/verify: 10 attempts per 15 minutes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: "false", message: "Too many authentication attempts, please try again later" },
});

// Strict limiter for password reset: 5 attempts per 15 minutes
const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: "false", message: "Too many password reset requests, please try again later" },
});

router.get('/check-auth', verifyToken, checkAuth);

router.post('/signup', authLimiter, signup);

router.post('/login', authLimiter, login);

router.post('/logout', logout);

router.post('/verify-email', authLimiter, verifyEmail);

router.post('/forgot-password', passwordResetLimiter, forgotPassword);

router.post('/reset-password/:token', passwordResetLimiter, resetPassword);

export default router;
