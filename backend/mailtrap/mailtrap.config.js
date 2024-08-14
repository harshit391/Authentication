import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const client = nodemailer.createTransport({
  secure: true,
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: 'harshitsingla1761@gmail.com',
    pass: 'uxedmosrczxomxtk',
  }
})

// export const client = new MailtrapClient({ 
//     endpoint: process.env.MAILTRAP_ENDPOINT, 
//     token: process.env.MAILTRAP_TOKEN 
// });

export const sender = {
  email: "getstark15@gmail.com",
  name: "Get Stark",
};

