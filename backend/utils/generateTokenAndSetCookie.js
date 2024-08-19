import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userId) => {

    const token = jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log("Generated Token", token);

    return token;
}