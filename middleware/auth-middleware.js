const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers["authorization"];
    console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({
            success : false,
            message : "Accesss denied. No token provided"
        })
    }

    try{
        const decodeToken = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decodeToken);

        req.userInfo = decodeToken
        next();

    }catch(error){
        return res.status(500).json({
            success : false,
            message : "Accesss denied. No token provided"
        })
    }

};

module.exports = authMiddleware;