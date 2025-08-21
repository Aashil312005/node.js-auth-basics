const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const isAdminUser = require("../middleware/adminMiddleware");
const adminRoutes = express.Router();

adminRoutes.get("/welcome",authMiddleware,isAdminUser, (req,res)=>{
        const {username,id,role} = req.userInfo;

    res.json({
        message : "Welcome to admin portal",
        user : {
            _id : id,
            username,
            role
        }
    })
})

module.exports = adminRoutes;