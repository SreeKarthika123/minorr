// import express from "express";
// import { createVacancy, getVacancies } from "../controllers/hrController.js";
// import { verifyToken, verifyHR } from "../middleware/authMiddleware.js";
// const User = require("../models/User");

// const express = require("express");
// const router = express.Router();
// const { createVacancy, getVacancies } = require("../controllers/hrController");
// const Vacancy = require("../models/Vacancy");
// const Application=require("../models/Application");
// // HR creates a vacancy
// const { sendApprovalEmail } = require("../utils/mailer");
// // HR creates a vacancy
// router.post("/vacancies", createVacancy);

// // Employees can view vacancies
// router.get("/vacancies", getVacancies);

// router.delete("/vacancies/:id", async (req, res) => {
//   try {
//     await Vacancy.findByIdAndDelete(req.params.id);
//     res.sendStatus(200);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Delete failed" });
//   }
// });
// //single vacancy
// router.get("/vacancies/:id", async (req, res) => {
//   try {
//     const vacancy = await Vacancy.findById(req.params.id);
//     if (!vacancy) {
//       return res.status(404).json({ message: "Vacancy not found" });
//     }
//     res.json(vacancy);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }

// });



// router.get("/vacancies/:vacancyId/candidates", async (req, res) => {
//   try {
//     const { vacancyId } = req.params;

//     // 1️ Get applications for this vacancy
//     const applications = await Application.find({ vacancyId });

//     if (!applications.length) {
//       return res.json([]);
//     }

//     // 2️Extract applied userIds
//     const userIds = applications.map(app => app.userId);

//     // 3️ Get vacancy scores
//     const vacancy = await Vacancy.findById(vacancyId)
//       .populate("atsScores.userId", "name email")
//       .populate("aiScores.userId", "name email");

//     if (!vacancy) {
//       return res.status(404).json({ error: "Vacancy not found" });
//     }

//     // 4️Build candidate list (ONLY APPLIED USERS)
//     const candidates = userIds.map(userId => {
//       const ats = vacancy.atsScores.find(
//         s => s.userId._id.toString() === userId.toString()
//       );

//       const ai = vacancy.aiScores.find(
//         s => s.userId._id.toString() === userId.toString()
//       );

//       return {
//         userId,
//         name: ats?.userId?.name || ai?.userId?.name,
//         email: ats?.userId?.email || ai?.userId?.email,
//         atsScore: ats?.score ?? 0,
//         aiScore: ai?.score ?? null,
//         matchedSkills: ai?.matchedSkills || [],
//         missingSkills: ai?.missingSkills || [],
//         summary: ai?.summary || "",
//         status:
//           applications.find(app => app.userId.toString() === userId.toString())
//             ?.status || "PENDING"
//       };
//     });

//     res.json(candidates);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch candidates" });
//   }
// });

// router.post("/:vacancyId/candidates/:userId/status", async (req, res) => {
//   const { vacancyId, userId } = req.params;
//   const { status } = req.body;

//   try {
//     const application = await Application.findOne({ vacancyId, userId });
//     if (!application) return res.status(404).json({ error: "Application not found" });

//     application.status = status;
//     await application.save();

//     if (status === "APPROVED") {
//       const user = await User.findById(userId);
//       const vacancy = await Vacancy.findById(vacancyId);
//       if (user?.email && vacancy) {
//         await sendApprovalEmail(user.email, user.name || "Candidate", vacancy.title);
//       }
//     }

//     res.json({ message: `Status updated to ${status}` });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const { createVacancy, getVacancies, updateVacancy } = require("../controllers/hrController");
const Vacancy = require("../models/Vacancy");
const User=require("../models/User");
const Application = require("../models/Application");
const { sendApprovalEmail } = require("../utils/mailer");
// HR creates a vacancy
router.post("/vacancies", createVacancy);



router.get("/vacancies/:vacancyId/candidates", async (req, res) => {
  try {
    const { vacancyId } = req.params;

    // 1️ Get applications for this vacancy
    const applications = await Application.find({ vacancyId });

    if (!applications.length) {
      return res.json([]);
    }

    // 2️Extract applied userIds
    const userIds = applications.map(app => app.userId);

    // 3️ Get vacancy scores
    const vacancy = await Vacancy.findById(vacancyId)
      .populate("atsScores.userId", "name email")
      .populate("aiScores.userId", "name email");

    if (!vacancy) {
      return res.status(404).json({ error: "Vacancy not found" });
    }

    // 4️Build candidate list (ONLY APPLIED USERS)
    const candidates = userIds.map(userId => {
      const ats = vacancy.atsScores.find(
        s => s.userId._id.toString() === userId.toString()
      );

      const ai = vacancy.aiScores.find(
        s => s.userId._id.toString() === userId.toString()
      );

      return {
        userId,
        name: ats?.userId?.name || ai?.userId?.name,
        email: ats?.userId?.email || ai?.userId?.email,
        atsScore: ats?.score ?? 0,
        aiScore: ai?.score ?? null,
        matchedSkills: ai?.matchedSkills || [],
        missingSkills: ai?.missingSkills || [],
        summary: ai?.summary || "",
        status:
          vacancy.applications.find(app => app.userId.toString() === userId.toString())
            ?.status || "PENDING"
      };
    });

    res.json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
});


// Update a vacancy
router.put("/vacancies/:id", updateVacancy);

// Employees can view vacancies
router.get("/vacancies", getVacancies);

router.delete("/vacancies/:id", async (req, res) => {
  try {
    await Vacancy.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});
// single vacancy
router.get("/vacancies/:id", async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }
    res.json(vacancy);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }

});



// // const Application = require("../models/Application");

// router.post("/vacancies/:vacancyId/candidates/:userId/status", async (req, res) => {
//   const { vacancyId, userId } = req.params;
//   const { status } = req.body;
//    console.log("💥 Params:", req.params, "Body:", req.body);

//   try {
//     const application = await Application.findOne({ vacancyId, userId });
//     if (!application) return res.status(404).json({ error: "Application not found" });

//     application.status = status;
//     await application.save();

//     if (status === "APPROVED") {
//       const user = await User.findById(userId);
//       const vacancy = await Vacancy.findById(vacancyId);
//       if (user?.email && vacancy) {
//         await sendApprovalEmail(user.email, user.name || "Candidate", vacancy.title);
//       }
//     }

//     res.json({ message: `Status updated to ${status}` });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });
// router.post('/vacancies/:vacancyId/candidates/:userId/status', async (req, res) => {
//   const { vacancyId, userId } = req.params;
//   const { status } = req.body;

//   try {
//     // Find the application
//     const application = await Application.findOne({ vacancyId, userId });
//     if (!application) return res.status(404).json({ message: "Vacancy or candidate not found" });

//     // Update status
//     application.status = status;
//     await application.save();

//     res.json({ message: "Status updated successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });



const sendMail = require("../utils/mailer");
// const User = require("../models/User"); // make sure you have the User model


router.post("/vacancies/:vacancyId/candidates/:userId/status", async (req, res) => {
  const { vacancyId, userId } = req.params;
  const { status } = req.body;

  if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const application = await Application.findOne({ vacancyId, userId });
    if (!application) return res.status(404).json({ message: "Vacancy or candidate not found" });

    // Update status
    application.status = status;
    await application.save();

    // Fetch user & vacancy details
    const user = await User.findById(userId);
    const vacancy = await Vacancy.findById(vacancyId);

    // Send email if approved

    if (user?.email && vacancy) {
  if (status === "APPROVED") {
    await sendMail({
      to: user.email,
      subject: `Congratulations! Your application for "${vacancy.title}" is approved`,
      text: `Hi ${user.name},\n\nYour application for the position "${vacancy.title}" has been approved by the HR.\nHR will contact you for further steps.\n\nBest regards,\nHR Team`,
      html: `<p>Hi <strong>${user.name}</strong>,</p>
             <p>Your application for the position "<strong>${vacancy.title}</strong>" has been <strong>approved</strong> by the HR.</p>
             <p>HR will contact you for further steps.</p>
             <p>Best regards,<br/>HR Team</p>`
    });
  }

  if (status === "REJECTED") {
    await sendMail({
      to: user.email,
      subject: `Update on your application for "${vacancy.title}"`,
      text: `Hi ${user.name},\n\nWe appreciate your interest in the position "${vacancy.title}".\nAfter careful consideration, we regret to inform you that your application was not selected.\nWe wish you all the best in your future endeavors.\n\nBest regards,\nHR Team`,
      html: `<p>Hi <strong>${user.name}</strong>,</p>
             <p>We appreciate your interest in the position "<strong>${vacancy.title}</strong>".</p>
             <p>After careful consideration, we regret to inform you that your application was <strong>not selected</strong>.</p>
             <p>We wish you all the best in your future endeavors.</p>
             <p>Best regards,<br/>HR Team</p>`
    });
  }
}
    // if (status === "APPROVED" && user?.email && vacancy) {
    //   await sendMail({
    //     to: user.email,
    //     subject: `Congratulations! Your application for "${vacancy.title}" is approved`,
    //     text: `Hi ${user.name},\n\nYour application for the position "${vacancy.title}" has been approved by the HR.\n\nBest regards,\nHR Team`,
    //     html: `<p>Hi <strong>${user.name}</strong>,</p>
    //            <p>Your application for the position "<strong>${vacancy.title}</strong>" has been <strong>approved</strong> by the HR.</p>
    //            <p>Best regards,<br/>HR Team</p>`
    //   });
    // }

    res.json({ message: `Status updated to ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// router.post("/vacancies/:vacancyId/candidates/:userId/status", async (req, res) => {
//   const { vacancyId, userId } = req.params;
//   const { status } = req.body;

//   if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
//     return res.status(400).json({ message: "Invalid status" });
//   }

//   try {
//     const application = await Application.findOne({ vacancyId, userId });
//     if (!application) return res.status(404).json({ message: "Vacancy or candidate not found" });

//     application.status = status;
//     await application.save();

//     // Send email if approved
//     if (status === "APPROVED") {
//       const user = await User.findById(userId);
//       if (user?.email) {
//         await sendMail({
//           to: user.email,
//           subject: "Congratulations! Your application is approved",
//           text: `Hi ${user.name},\n\nYour application for the position has been approved by the HR.\n\nBest regards,\nHR Team`,
//           html: `<p>Hi <strong>${user.name}</strong>,</p>
//                  <p>Your application for the position has been <strong>approved</strong> by the HR.</p>
//                  <p>Best regards,<br/>HR Team</p>`
//         });
//       }
//     }

//     res.json({ message: `Status updated to ${status}` });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
 module.exports = router;