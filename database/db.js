const mongoose = require("mongoose");

const connectMongoDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongoDB connected successfully");        
    }catch(err){
        console.log("mongoDb connection failed ");
        process.exit(1);
    }
};

module.exports = connectMongoDB;