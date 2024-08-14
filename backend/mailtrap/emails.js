import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL } from './emailTemplates.js';
import { client, sender } from './mailtrap.config.js'

// uxed mosr czxo mxtk

export const sendVerificationEmail = (email, verificationToken) => {

    // console.log("Recipient", recipient);

    try {
        const response = client.sendMail({
            to: email,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })

        console.log("Email Sent SuccessFully", response);
    } catch (error) {
        console.log("Email Sent Failed", error);
        throw new Error("Email Sent Failed");
    }
}

export const sendWelcomeEmail = (email, name) => {

    const recipient = [{email}];

    try {
        
        const response = client.sendMail({
            to : email,
            subject: "Logged in Success",
            template_uuid: "17c90737-ec67-467f-85bb-fe11f6cd3702",
            template_variables: {
                "company_info_name": "Get Stark",
                "name": name,
                "company_info_address": "Test_Company_info_address",
                "company_info_city": "Test_Company_info_city",
                "company_info_zip_code": "Test_Company_info_zip_code",
                "company_info_country": "India"
            },
            html : WELCOME_EMAIL,
            category: "Welcome Email"
        })

        console.log("Welcome Email Sent SuccessFully", response);
    } catch (error) {
        throw new Error("Welcome Email Sent Failed");
    }
}

export const sendPasswordResetEmail = (email, resetURL) => {

    const recipient = [{email}];

    try {
        
        const response = client.sendMail({
            to : email,
            subject: "Reset Your Password",
            html : PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"
        });

        console.log("Password Reset Email Sent SuccessFully", response);
    } catch (error) {
        console.log("Password Reset Email Sent Failed", error);
        throw new Error("Password Reset Email Sent Failed");
    }

}

export const sendResetSuccessfullEmail = (email) => {
    
        const recipient = [{email}];
    
        try {
            
            const response = client.sendMail({
                to : email,
                subject: "Password Reset Successful",
                html : PASSWORD_RESET_SUCCESS_TEMPLATE,
                category: "Password Reset"
            });
    
            console.log("Password Reset Success Email Sent SuccessFully", response);
        } catch (error) {
            console.log("Password Reset Success Email Sent Failed", error);
            throw new Error("Password Reset Success Email Sent Failed");
        }
} 