import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/connectDB.js';
import cookieParser from 'cookie-parser';  
import cors from 'cors';

import authRoutes from './routes/auth.route.js';

dotenv.config();
const app = express();
const PORT = 5000;

app.use(cors({origin: process.env.MAIN_API, credentials: true}));
app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
    console.log('Raw Cookie Header:', req.headers.cookie);
    next();
});


app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port http://localhost:${PORT}`);
})