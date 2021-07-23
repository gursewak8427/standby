const jwt = require("jsonwebtoken");
const UserAuth = (req, res, next) => {
    // console.log('headers' ,req.headers)
    try {
        // const token = req.body.headers.Authorization.split(" ")[1];
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        console.log(decodedToken)
        req.userData = {
            phone: decodedToken.phone,
            id: decodedToken.id,
            name: decodedToken.name
        };
        next();
    } catch (error) {
        console.log('failed',error)
        res.status(401).json({ error: "Auth failed!" });
    }
};

module.exports = UserAuth