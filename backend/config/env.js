import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'CLIENT_URL', 'MAIN_API', 'MAIL_HOST', 'MAIL_PORT', 'CLIENT_USER', 'CLIENT_PASS'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.error(`FATAL: Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
}
