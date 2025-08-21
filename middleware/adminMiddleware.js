
const isAdminUser = (req,res,next)=>{
    if(req.userInfo.role !== "admin"){
        return res.status(404).json({
            success : false,
            message : "access denied admin right required"
        })
    }
    next();
};

module.exports = isAdminUser;