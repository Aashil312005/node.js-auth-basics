const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    console.log("👉 Incoming request body:", req.body);

    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required",
      });
    }

    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists with either same username or email. Try new username or email",
      });
    }

    console.log("✅ User is unique. Proceeding to hash password...");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    console.log("✅ Created user object:", newlyCreatedUser);

    await newlyCreatedUser.save();

    console.log("✅ User saved successfully.");

    res.status(201).json({
      success: true,
      message: "New user created",
    });
  } catch (e) {
    console.error(" Error occurred during registration:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred! Please try again",
    });
  }
};

const loginUser = async (req, res) => {
    try {

        const { username, password } = req.body;
        console.log("🔍 Username received:", username);

        const user = await User.findOne({ username });
        console.log("👤 User found in DB:", user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User doesn't exist"
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log("🔑 Password match:", isPasswordMatch);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
    { id: user._id,
      username: user.username,
      role : user.role},
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
);

        console.log("✅ Generated Access Token:", token);

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token
        });

    } 
catch (error) {
    console.error("❌ Login error:", error.message);
    console.error(error.stack);
    return res.status(500).json({
        success: false,
        message: "Some error occurred! Please try again"
    });
}
};

const changePassword = async(req,res)=>{
  try{
    const userId = req.userInfo.id;
    //extract old and new password
    const{oldPassword,newPassword} = req.body;
    //find the current logged in user
    const user = await User.findById(userId);
    if(!user){
      res.status(400).json({
        success : false,
        message : "User Not Found"
      })
    }
    //check if old password is correct
    const isPasswordMatch = await bcrypt.compare(oldPassword,user.password);
    if(!isPasswordMatch){
      res.status(400).json({
        success : false,
        message : "Old password is not correct! please try again"
      })
    }
    //hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword,salt);
    //update the user password
    user.password= newHashedPassword;
    await user.save(); 

    res.status(200).json({
      successs: true,
      message : "Password changed successfully"
    })

  }catch(error){
    console.error("❌ Login error:", error.message);
    console.error(error.stack);
    return res.status(500).json({
        success: false,
        message: "Some error occurred! Please try again"
    });
}
};


module.exports = {registerUser,loginUser,changePassword};