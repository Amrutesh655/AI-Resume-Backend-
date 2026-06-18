const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please enter all fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


const LoginUser = async (req, res) =>{
    try{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            message:"please enter all fields"
        });
    }

    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({
            message :"user does not exist"
        });
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(400).json({
            message:"invalid credentials"
        });
    }

    const token = jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"1h"}
    );

    res.status(200).json({
        success:true,
        token,
        user:{
            id:user._id,
            name:user.name,
            email:user.email
        }
    });

  }
  catch(error){
     console.error("Error in LoginUser:",error);

     res.status(500).json({
        message:"server error"
     });
  }
}

const getProfile = async (req, res) => {
   console.log("req.user =", req.user);
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = { registerUser,LoginUser, getProfile };
