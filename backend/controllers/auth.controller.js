import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail, sendResetSuccessfullEmail } from "../mailtrap/emails.js";

// --- Input Validation Helpers ---

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email) => {
    if (!email || typeof email !== "string") return "Email is required";
    if (email.length > 254) return "Email is too long";
    if (!EMAIL_REGEX.test(email.trim())) return "Invalid email format";
    return null;
};

const validatePassword = (password) => {
    if (!password || typeof password !== "string") return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password.length > 128) return "Password is too long";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    return null;
};

const validateName = (name) => {
    if (!name || typeof name !== "string") return "Name is required";
    const trimmed = name.trim();
    if (trimmed.length === 0) return "Name is required";
    if (trimmed.length > 100) return "Name is too long";
    return null;
};

export const signup = async (req, res) => {

    const { email, password, name } = req.body;
    try {
        const emailError = validateEmail(email);
        if (emailError) return res.status(400).json({ success: false, message: emailError });

        const passwordError = validatePassword(password);
        if (passwordError) return res.status(400).json({ success: false, message: passwordError });

        const nameError = validateName(name);
        if (nameError) return res.status(400).json({ success: false, message: nameError });

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = crypto.randomInt(100000, 1000000).toString();

        const user = new User({
            email, password: hashedPassword, name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        })

        await user.save();

        try {
            await sendVerificationEmail(user.email, verificationToken);
        } catch (emailErr) {
            console.error("Failed to send verification email:", emailErr.message);
        }

        const token = generateTokenAndSetCookie(res, user._id);

        res.status(201).json({ success: true, message: "User created successfully", user: {
            ...user._doc,
            password: undefined,
            token: token,
        }});

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

}

export const verifyEmail = async (req, res) => {

    const { code } = req.body;

    try {
        if (!code || typeof code !== "string" || !/^\d{6}$/.test(code)) {
            return res.status(400).json({ success: false, message: "Invalid verification code format" });
        }

        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        try {
            await sendWelcomeEmail(user.email, user.name);
        } catch (emailErr) {
            console.error("Failed to send welcome email:", emailErr.message);
        }

        return res.status(200).json({ success: true, message: "Email verified successfully", user: {
            ...user._doc,
            password: undefined,
        } });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

}

export const login = async (req, res) => {

    const {email, password} = req.body;

    try {
        const emailError = validateEmail(email);
        if (emailError) return res.status(400).json({ success: false, message: emailError });

        if (!password || typeof password !== "string") {
            return res.status(400).json({ success: false, message: "Password is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateTokenAndSetCookie(res, user._id);

        user.lastLogin = Date.now();

        await user.save();

        res.status(200).json({ success: true, message: "Logged in successfully", user: {
            ...user._doc,
            password: undefined,
            token: token,
        }});

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        path: "/",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

export const forgotPassword = async (req, res) => {

    const { email } = req.body;

    try {
        const emailError = validateEmail(email);
        if (emailError) return res.status(400).json({ success: false, message: emailError });

        const user = await User.findOne({email});

        if (user) {
            const resetPasswordToken = crypto.randomBytes(20).toString('hex');
            const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

            user.resetPasswordToken = resetPasswordToken;
            user.resetPasswordExpiresAt = resetTokenExpiresAt;

            await user.save();

            try {
                await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`);
            } catch (emailErr) {
                console.error("Failed to send password reset email:", emailErr.message);
            }
        }

        return res.status(200).json({ success: true, message: "If an account exists with this email, a password reset link has been sent" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const resetPassword = async (req, res) => {

    try {
        const { token } = req.params;
        const { password } = req.body;

        const passwordError = validatePassword(password);
        if (passwordError) return res.status(400).json({ success: false, message: passwordError });

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        try {
            await sendResetSuccessfullEmail(user.email);
        } catch (emailErr) {
            console.error("Failed to send password reset success email:", emailErr.message);
        }

        return res.status(200).json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

}

export const checkAuth = async (req, res) => {

    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid User" });
        }

        res.status(200).json({ success: true, message: "User authenticated successfully", user: {
            ...user._doc,
            password: undefined
        }});
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}