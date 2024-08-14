import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userId) => {

    const token = jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log("Generated Token", token);

    res.cookie("token", token, {
        httpOnly: true, // XSS protection
        secure : true,
        sameSite: "none", // CSRF protection
        domain: "http://localhost:5173",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return token;
}