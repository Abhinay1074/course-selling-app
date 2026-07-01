const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");


function userMiddleware(req, res, next) {

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

        const decoded = jwt.verify(token, JWT_USER_PASSWORD);

        req.userId = decoded.id;

        next();

    } 
    catch(e) {

        return res.status(403).json({
            message: "you are not signed in"
        });

    }
}


module.exports = {
    userMiddleware
};
