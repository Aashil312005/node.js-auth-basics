require("dotenv").config();
const express = require("express");
const connectMongoDB = require("./database/db");
const authRoutes = require("./routes/auth-routes");
const homeRouter = require("./routes/home-routes");
const adminRoutes = require("./routes/admin-routes");
const uploadImageRoutes = require("./routes/image-routes")



connectMongoDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/home",homeRouter);
app.use("/api/admin",adminRoutes);
app.use("/api/image",uploadImageRoutes);



app.listen(PORT,()=>{
    console.log("server is now listening to port",PORT);
})