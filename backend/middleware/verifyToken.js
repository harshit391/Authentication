import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {

    console.log("Token Explicit :- ", req.headers);

    const token = req.headers.cookies;

    console.log("Cookies", req.cookies);

    console.log("Token", token);

    if (!token) {
        return res.status(401).json({ success: "false", message: "Unauthorized" });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded", decoded);

        if (!decoded) {

            return res.status(401).json({ success: "false", message: "Unauthorized - Invalid Token" });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        
        console.log("Error in Verify Token", error);
        return res.status(500).json({ success: "false", message: error.message });
    }
}