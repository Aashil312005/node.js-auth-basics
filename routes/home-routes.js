const express = require("express");
const authMiddleware = require("../middleware/auth-middleware")
const homeRouter = express.Router();

homeRouter.get("/welcome",authMiddleware,(req,res)=>{
    const {username,id,role} = req.userInfo;
    res.json({
        message : "Welcome to home page",
        user : {
            _id : id,
            username,
            role
        }
    })
});

module.exports = homeRouter;