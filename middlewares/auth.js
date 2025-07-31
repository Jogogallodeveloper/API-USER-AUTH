import jwt from "jsonwebtoken";

//declare the JWT Random Key
const JWT_SECRET = process.env.JWT_SECRET;

//declare the const middleware
const auth = (req, res, next) => {

    // Declare the JWT Token
    const authHeader = req.headers.authorization;

    //Validate if the token was informe in the header request
    if (!authHeader) {
        return res.status(400).json({ message: "Access Denied: Please provide an authorization token ! " });
    };

    // Extract token safely
    const token = authHeader.split(" ")[1];

    // if token was not informed
    if (!token) {
        return res.status(400).json({ message: "Access Denied: Token missing!" });
    }

    try {

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        console.log("✅ Token decoded:", decoded);

        next();

    } catch (error) {
        console.error("❌ Token Error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    };
};

export default auth;

