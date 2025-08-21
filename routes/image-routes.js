const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const isAdminUser = require("../middleware/adminMiddleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const {uploadImage,fetchAllImages,deleteImage} = require("../controller/image-controller");

const router = express.Router();

//upload image
router.post("/upload" ,authMiddleware,isAdminUser, uploadMiddleware.single("image"),uploadImage);

//get all images
router.get("/get",authMiddleware,fetchAllImages);

//delete image
router.delete("/:id",authMiddleware,isAdminUser,deleteImage);

module.exports = router;