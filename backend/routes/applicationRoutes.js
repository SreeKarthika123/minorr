const express = require("express");
const router = express.Router();
const { applyJob } = require("../controllers/applicationController");
const Application = require("../models/Application");
const mongoose=require("mongoose");
// POST /api/applications
router.post("/", applyJob);
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    // find applications for the user
    const applications = await Application.find({ userId }).select("vacancyId").lean();
    // Always return array
    res.json(Array.isArray(applications) ? applications : []);
  } catch (err) {
    console.error("Fetch applied jobs error:", err);
    res.status(500).json([]); // return empty array on error so frontend doesn't crash
  }
});



router.get("/user/:userId/applications", async (req, res) => {
  const { userId } = req.params;

  // 🔐 safety guard
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.json([]);
  }

  try {
    const applications = await Application.find({ userId })
      .populate("vacancyId", "title department location")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("Fetch applications error:", err);
    res.json([]);
  }
});


router.get("/count-per-vacancy", async (req, res) => {
  try {
    const counts = await Application.aggregate([
      {
        $group: {
          _id: "$vacancyId",
          appliedCount: { $sum: 1 }
        }
      }
    ]);

    res.json(counts); // [{ _id: vacancyId, appliedCount: 5 }, ...]
  } catch (err) {
    console.error("Failed to get application counts", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update status of an application
router.patch("/hr/application/:applicationId/status", async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({ error: "Invalid application ID" });
  }

  if (!["pending", "accepted", "rejected", "hired"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    ).populate("vacancyId", "title department");

    if (!application) return res.status(404).json({ error: "Application not found" });

    res.json({ message: "Status updated", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;