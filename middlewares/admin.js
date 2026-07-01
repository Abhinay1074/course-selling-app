const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");


function adminMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : req.headers.token;

    if (!token) {
        return res.status(403).json({
            message: "token missing"
        });
    }

    try {

        const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);

        req.adminId = decoded.id;

        next();

    } 
    catch(e) {

        return res.status(403).json({
            message: "you are not signed in"
        });

    }
}


module.exports = {
    adminMiddleware
};
