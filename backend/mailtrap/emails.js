import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL } from './emailTemplates.js';
import { client } from './mailtrap.config.js'

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        await client.sendMail({
            to: email,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        });
    } catch (error) {
        console.error("Failed to send verification email:", error.message);
        throw new Error("Email Sent Failed");
    }
}

export const sendWelcomeEmail = async (email, name) => {
    try {
        await client.sendMail({
            to: email,
            subject: "Welcome to Singla Authentication",
            html: WELCOME_EMAIL,
        });
    } catch (error) {
        console.error("Failed to send welcome email:", error.message);
        throw new Error("Welcome Email Sent Failed");
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        await client.sendMail({
            to: email,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        });
    } catch (error) {
        console.error("Failed to send password reset email:", error.message);
        throw new Error("Password Reset Email Sent Failed");
    }
}

export const sendResetSuccessfullEmail = async (email) => {
    try {
        await client.sendMail({
            to: email,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        });
    } catch (error) {
        console.error("Failed to send password reset success email:", error.message);
        throw new Error("Password Reset Success Email Sent Failed");
    }
}