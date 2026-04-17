import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL } from './emailTemplates.js';
import { client } from './mailtrap.config.js'

export const sendVerificationEmail = (email, verificationToken) => {

    try {
        client.sendMail({
            to: email,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        })
    } catch (error) {
        throw new Error("Email Sent Failed");
    }
}

export const sendWelcomeEmail = (email, name) => {

    try {
        client.sendMail({
            to : email,
            subject: "Welcome to Singla Authentication",
            html : WELCOME_EMAIL,
        })
    } catch (error) {
        throw new Error("Welcome Email Sent Failed");
    }
}

export const sendPasswordResetEmail = (email, resetURL) => {

    try {
        client.sendMail({
            to : email,
            subject: "Reset Your Password",
            html : PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        });
    } catch (error) {
        throw new Error("Password Reset Email Sent Failed");
    }

}

export const sendResetSuccessfullEmail = (email) => {

        try {
            client.sendMail({
                to : email,
                subject: "Password Reset Successful",
                html : PASSWORD_RESET_SUCCESS_TEMPLATE,
            });
        } catch (error) {
            throw new Error("Password Reset Success Email Sent Failed");
        }
}