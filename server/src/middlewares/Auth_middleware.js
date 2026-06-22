const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const AuthMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access — please log in" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};



const if_user_exist = (req, res, next) => {

    try {

        const token = req.cookies.token;

        // if no token → continue normally
        if (!token) {
            return next();
        }

        // verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // user already logged in
        return res.status(200).json({
            loggedIn: true,
            user: decoded,
            message: "Already logged in"
        });

    } catch (error) {

        return res.status(401).json({
            loggedIn: false,
            message: "Invalid token"
        });

    }

};
module.exports = { AuthMiddleware , if_user_exist };