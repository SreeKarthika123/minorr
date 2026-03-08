// import jwt from "jsonwebtoken";
// import User from "../models/User.js";


// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// // Verify JWT token
// export const verifyToken = async (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token provided" });

//   try {
//     const decoded = jwt.verify(token, "your_jwt_secret");
//     req.user = await User.findById(decoded.id);
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };


// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   const token = req.cookies.accessToken; 

//   if (!token) {
//     return res.status(401).json({ message: "No token, unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
//     req.user = { id: decoded.id };
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };



// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   const token = req.cookies.jwtToken;

//   if (!token) {
//     return res.status(401).json({ message: "No token" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };



const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  let token;

  // 1️⃣ Check cookie
  if (req.cookies && req.cookies.jwtToken) {
    token = req.cookies.jwtToken;
  }

  // 2️⃣ Check Authorization header
  else if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};