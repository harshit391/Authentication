import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const client = nodemailer.createTransport({
  secure: true,
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.CLIENT_USER,
    pass: process.env.CLIENT_PASS,
  }
})

