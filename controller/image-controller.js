const image = require("../model/image");
const uploadToCloudinary = require("../helpers/cloudinarHelpers");
const fs =require("fs");
const { findById } = require("../model/user");
const cloudinary = require("../config/cloudinary");

const uploadImage = async(req,res) =>{
    try{

        //check if file is missing or not
        if(!req.file){
            res.status(400).json({
                success:false,
                message:"File is required, please upload an image"
            })
        }

        //upload to cloudinary
        const {url, publicId} = await uploadToCloudinary(req.file.path);

        //upload the url,publicId,userId in the datbase
        const newlyUploadedImage = new image({
            url,
            publicId,
            uploadedBy : req.userInfo.id
        })
        await newlyUploadedImage.save();

        //deleting the temp file
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            success : true,
            message : "Image uploaded successfully",
            image : newlyUploadedImage
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong please try again"
        });
    }
};

const fetchAllImages = async(req,res) =>{
    try{
        const page = parseInt(req.query.page) || 1; //which page no
        const limit = parseInt(req.query.limit) || 1; // in page how many images
        const skip = (page-1)*limit; //what all pages not to include

        const sortBy = req.query.sortBy || "createdAt"; //by date
        const sortOrder = req.query.sortOrder === "asc" ? 1:-1; //ascending or descending order
        const totalImages = await image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder;
        const images = await image.find().sort(sortObj).skip(skip).limit(limit);
        if(images){
            res.status(200).json({
                success:true,
                currentPage : page,
                totalPages : totalPages,
                totalImages : totalImages,
                data:images
            })
        }

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong please try again"
        });
    }
};

const deleteImage = async(req,res) =>{
    try{
        const imageIdToBeDeleted = req.params.id;
        const userId = req.userInfo.id;
        //get image
        const images = await image.findById(imageIdToBeDeleted);
        if(!images){
            res.status(404).json({
                success:false,
                message : "Image not found"
            })
        }

        //check if the image is uploaded by the current user that is trying to delete this image
         if(images.uploadedBy.toString() !== userId){
            res.status(404).json({
                success:false,
                message:"Image you are trying to delete is not uploaded by you"
            })
         }

         //delete this image from your  cloudinary storage
         await cloudinary.uploader.destroy(images.publicId);
         //now delete it from db
         await image.findByIdAndDelete(imageIdToBeDeleted);

         res.status(200).json({
            success:true,
            message:"image deleted successfully"
         })


    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong please try again"
        });
    }
};
module.exports = {uploadImage,fetchAllImages,deleteImage};