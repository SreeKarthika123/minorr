const express=require('express')
const User=require("../models/User");


const router = express.Router();


router.get("/search", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);

  const users = await User.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } }
    ]
  }).select("name email _id");

  res.json(users);
});





module.exports= router;