





const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const natural = require("natural");
const User = require("../models/User");
const Vacancy = require("../models/Vacancy");

// const tokenizer = new natural.WordTokenizer();
 const analysisProgress = {};



const analyzeResumeVsJob = require("../utils/aiAnalyzeJob");


router.get("/jobs-count", async (req, res) => {
  try {
    const totalJobs = await Vacancy.countDocuments();
    res.json({ total: totalJobs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job count" });
  }
});



module.exports=router;