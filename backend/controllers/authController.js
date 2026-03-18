const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Vacancy = require("../models/Vacancy");
const path=require('path');
const fs = require("fs");
const pdfParse = require("pdf-parse");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
   
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const jwt = require("jsonwebtoken");
// const { generateAccessToken, generateRefreshToken } = require("../utils/token");




// const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // ✅ Create single JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Store token in cookie
    res.cookie("jwtToken", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

     res.json({
      message: "Login successful",
      token: token,   // 👈 added
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
         role: "employee"

      }
    });

    // res.json({
    //   message: "Login successful",
    //   user: {
    //     id: user._id,
    //     name: user.name,
    //     email: user.email
    //   }
    // });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid password" });
//     }

//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     user.refreshToken = refreshToken;
//     await user.save();

    
//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       sameSite: "lax",
//       maxAge: 15 * 60 * 1000, // 15 min
//     });
//     // Cookie is sent on top-level GET navigations

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       sameSite: "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     res.json({
//       message: "Login successful",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


exports.logout = (req, res) => {
  res.clearCookie("jwtToken");

  res.json({
    message: "Logged out successfully",
  });
};


exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Refresh token expired" });
  }
};




exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .lean(); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      designation: user.designation,
      skills: user.skills,
      resume: user.resume,
      atsAnalyzed: user.atsAnalyzed || false 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


function extractSkills(text) {
  const SKILL_SECTION_REGEX =
    /(skills|technical skills|expertise|technologies|tools)[\s:\n]+([\s\S]*?)(\n\n|experience|education|projects)/i;

  let skillBlock = "";

  const sectionMatch = text.match(SKILL_SECTION_REGEX);
  if (sectionMatch) {
    skillBlock = sectionMatch[2];
  }

  const content = skillBlock || text;

  // Split by commas, bullets, pipes, newlines
  let tokens = content
    .split(/[\n,•|/]+/)
    .map(t => t.trim().toLowerCase())
    .filter(t => t.length > 1);

  // Remove noise words
  const stopWords = new Set([
    "and", "with", "using", "knowledge", "basic", "good", "experience",
    "familiar", "strong", "working", "skills", "tools"
  ]);

  tokens = tokens.filter(t =>
    !stopWords.has(t) &&
    !/\d+/.test(t) &&
    t.length < 40
  );
// \d+ → one or more digits

//   .test(t) → checks if token contains numbers
  // Normalize (React.js → React)
  const normalize = skill =>
    skill
      .replace(/\.js$/i, "")
      .replace(/js$/i, "")
      .replace(/\s+/g, " ")
      .trim();

  const uniqueSkills = [...new Set(tokens.map(normalize))];

  return uniqueSkills.map(
    s => s.charAt(0).toUpperCase() + s.slice(1)
  );
}
function extractProfileFromText(text) {
  // Normalize text
  const cleanText = text
    .replace(/\r/g, "")// removes window line breaks
    .replace(/\t/g, " ")//tabs
    .replace(/ +/g, " ")// extra spaces
    .trim();

  // ───────── EMAIL ─────────
  const emailMatch = cleanText.match(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
  );

  // ───────── PHONE ─────────
  const phoneMatch = cleanText.match(
    /(\+?\d{1,3}[\s-]?)?\d{10}/
  );
// country code hyphen number 
  // ───────── NAME (first strong line) ─────────
  const lines = cleanText
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 2);

  const name = lines[0] || "";

  // ───────── SKILLS EXTRACTION ─────────
  const skills = extractSkills(cleanText);

  return {
    name,
    phone: phoneMatch ? phoneMatch[0] : "",
    email: emailMatch ? emailMatch[0] : "",
    skills
  };
}




exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, phone, designation, skills } = req.body;

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.designation = designation || user.designation;

    // Parse skills JSON if provided
    if (skills) {
      try {
        const skillsArray = JSON.parse(skills);
        if (Array.isArray(skillsArray)) user.skills = skillsArray;
      } catch {
        console.warn("Invalid skills JSON");
      }
    }

    let resumeUpdated = false;
    let extractedProfile = null;

    if (req.file) {
      user.resume = `/uploads/${req.file.filename}`;
      user.atsAnalyzed = false;
      resumeUpdated = true;

      // 🔹 Extract fields from uploaded resume
      const resumePath = path.join(__dirname, "../", user.resume);
      const pdfData = await pdfParse(fs.readFileSync(resumePath));
      extractedProfile = extractProfileFromText(pdfData.text);

      // Prefill user fields if missing
      user.name = extractedProfile.name || user.name;
      user.phone = extractedProfile.phone || user.phone;
      user.skills = extractedProfile.skills.length ? extractedProfile.skills : user.skills;
    }

    await user.save();

    // Trigger ATS analysis in background if resume updated
    if (resumeUpdated) {
      await Vacancy.updateMany({}, { $pull: { aiScores: { userId: user._id } } });

      fetch(`http://localhost:5000/api/ats/analyze-all/${user._id}`, { method: "POST" })
        .catch(() => console.warn("AI analyze trigger failed"));
    }

    res.json({
      message: resumeUpdated
        ? "Profile updated. Resume re-analysis started."
        : "Profile updated successfully",
      user,
      extractedProfile, // ✅ send extracted data to frontend
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};