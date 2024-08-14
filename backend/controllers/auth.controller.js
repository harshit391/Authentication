import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail, sendResetSuccessfullEmail } from "../mailtrap/emails.js";

export const signup = async (req, res) => {

    const { email, password, name } = req.body;
    try {
       
        if (!email || !password || !name) {
            throw new Error("Please fill all the fields");
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ success: "false", message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email, password: hashedPassword, name,
            verificationToken, 
            verifitcationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        })

        sendVerificationEmail(user.email, verificationToken);

        await user.save();

        const token = generateTokenAndSetCookie(res, user._id);

        res.cookie("token", token);

        res.status(201).json({ success: "true", message: "User created successfully", user: {
            ...user._doc, 
            password: undefined,
            token: token,
        }});

    } catch (error) {
        return res.status(500).json({ success: "false", message: error.message });
    }

}

export const verifyEmail = async (req, res) => {

    const { code } = req.body;

    try {
        const user = await User.findOne({

            verificationToken: code,
            verifitcationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: "false", message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verifitcationTokenExpiresAt = undefined;

        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        return res.status(200).json({ success: "true", message: "Email verified successfully", user: {
            ...user._doc,
            password: undefined,
        } });

    } catch (error) {
        console.log("Error in Verification", error);
        return res.status(500).json({ success: "false", message: error.message });
    }

}

export const login = async (req, res) => {
    
    const {email, password} = req.body;

    try {
        
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: "false", message: "Invalid User" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: "false", message: "Invalid Password" });
        }

        const token = generateTokenAndSetCookie(res, user._id);
        res.cookie("token", token);

        user.lastLogin = Date.now();

        await user.save();

        res.status(200).json({ success: "true", message: "Logged in successfully", user: {
            ...user._doc,
            password: undefined,
            token: token,
        }});

    } catch (error) {
        console.log("Error in Login", error);
        return res.status(500).json({ success: "false", message: error.message });
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: "true", message: "Logged out successfully" });
}

export const forgotPassword = async (req, res) => {
    
    const { email } = req.body;

    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({ success: "false", message: "Invalid User" });
        }

        const resetPasswordToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hours

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // send email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`);

        return res.status(200).json({ success: "true", message: "Password reset link sent successfully" });
    } catch (error) {
        console.log("Error in Forgot Password", error);
        return res.status(500).json({ success: "false", message: error.message });
    }
}

export const resetPassword = async (req, res) => {

    try {
        
        const { token } = req.params;

        console.log("Token", token);

        const { password } = req.body;

        console.log("Password", password);

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        console.log("User", user);

        if (!user) {
            return res.status(400).json({ success: "false", message: "Invalid or expired reset token" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        await sendResetSuccessfullEmail(user.email);

        return res.status(200).json({ success: "true", message: "Password reset successfully" });

    } catch (error) {
        console.log("Error in Reset Password", error);
        return res.status(500).json({ success: "false", message: error.message });
    }

}

export const checkAuth = async (req, res) => {

    console.log("Check Auth", req.userId);

    try {
        
        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(400).json({ success: "false", message: "Invalid User" })
        }

        res.status(200).json({ success: "true", message: "User authenticated successfully", user: {
            ...user._doc,
            password: undefined
        }});
    } catch (error) {
        console.log("Error in Check Auth", error);
        return res.status(500).json({ success: "false", message: error.message });
    }
}