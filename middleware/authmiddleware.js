const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

     const decoded = jwt.verify(
       token,
      process.env.JWT_SECRET);
     console.log("Decoded Token:", decoded);

     const user = await User.findById(decoded.id).select("-password");
     console.log("Found User:", user);

     req.user = user;

    next();

    } else {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }
};

module.exports = protect;