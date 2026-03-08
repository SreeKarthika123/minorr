


const detectIntent = require("../utils/intentDetector");
const Vacancy = require("../models/Vacancy");
const User = require("../models/User");
const Application=require("../models/Application");
const mongoose = require("mongoose");
const analyzeResumeVsJob = require("../utils/aiAnalyzeJob");
const { generateLearningResources } = require("../utils/aiLearningResources");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");

exports.askQuestion = async (req, res) => {
  try {
    let { userId, message, vacancyId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ reply: "Invalid user id" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // --- HANDLE FOLLOW-UP ROLE SELECTION ---
    if (req.session?.pendingATS) {
      const selected = req.session.pendingATS.roles.find(
        r => r.title.toLowerCase() === message.toLowerCase()
      );
      if (selected) {
        vacancyId = selected.id;
        delete req.session.pendingATS;
      }
    }

    // --- DETECT INTENT ---
    let intent, confidence = 1;
    if (req.body._forceATS) {
      intent = "get_ats_score";
    } else {
      ({ intent, confidence } = await detectIntent(message));
    }

    if (!req.body._forceATS && confidence < 0.6) {
      return res.json({
        reply: "I didn’t fully understand You can ask about jobs or ATS score."
      });
    }

    switch (intent) {

       case "get_vacancies": {
        const vacancies = await Vacancy.find();
        return res.json({
          reply: `There are ${vacancies.length} open positions.`,
          data: vacancies
        });
      }

       case "match_jobs": {
  const ATS_THRESHOLD = 37;
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const vacancies = await Vacancy.find({ status: "Active" });

  const matchingJobs = [];

  for (const job of vacancies) {
    const ai = job.aiScores?.find(
      s => s.userId?.toString() === userObjectId.toString()
    );

    const ats = job.atsScores?.find(
      s => s.userId?.toString() === userObjectId.toString()
    );

    let score = null;
    let scoreType = null;

    // ✅ Prefer ATS
    if (ats && typeof ats.score === "number") {
      score = ats.score;
      scoreType = "ATS";
    }
    // 🔁 Fallback to AI
    else if (ai && typeof ai.score === "number") {
      score = ai.score;
      scoreType = "AI";
    }

    // ⛔ Skip jobs with no score
    if (score === null || score < ATS_THRESHOLD) continue;

    matchingJobs.push({
      vacancyId: job._id,
      title: job.title,
      atsScore: score,
      scoreType,
      matchedSkills: ai?.matchedSkills || [],
      missingSkills: ai?.missingSkills || []
    });
  }

  // 🔽 Sort by score (high → low)
  matchingJobs.sort((a, b) => b.atsScore - a.atsScore);

  return res.json({
    reply: matchingJobs.length
      ? "Jobs matching your profile:"
      : "No matching jobs found yet.",
    data: matchingJobs
  });
}


case "get_ats_score": {
  let vacancy;

  // 1️⃣ If vacancyId provided
  if (vacancyId && mongoose.Types.ObjectId.isValid(vacancyId)) {
    vacancy = await Vacancy.findOne(
      { _id: vacancyId },
      { title: 1, aiScores: 1, atsScores: 1, company: 1, location: 1 }
    );
  } else {
    // Extract title from message
    const cleaned = message
      .toLowerCase()
      .replace(/\b(ats|ai|score|for|role|job|the|my)\b/g, "")
      .trim();

    if (!cleaned) {
      return res.json({ reply: "Please mention the job title to get your ATS score." });
    }

    const escaped = cleaned.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

    let vacancies = await Vacancy.find(
      { title: { $regex: `\\b${escaped}\\b`, $options: "i" } },
      { title: 1, aiScores: 1, atsScores: 1, company: 1, location: 1 }
    );

    if (vacancies.length === 0) {
      // fallback partial match
      vacancies = await Vacancy.find(
        { title: { $regex: escaped, $options: "i" } },
        { title: 1, aiScores: 1, atsScores: 1, company: 1, location: 1 }
      );
    }

    if (vacancies.length === 0) {
      return res.json({ reply: "I couldn't find that job. Please try a clearer job title." });
    }

    if (vacancies.length > 1) {
      // save for follow-up
      req.session.pendingATS = { roles: vacancies.map(v => ({ title: v.title, id: v._id })) };
      return res.json({
        reply: `Multiple roles found. Please specify one:\n• ${vacancies.map(v => v.title).join("\n• ")}`
      });
    }

    vacancy = vacancies[0];
  }

  // 2️⃣ Fetch user scores
  const ai = vacancy.aiScores?.find(s => s.userId?.toString() === userObjectId.toString());
  const ats = vacancy.atsScores?.find(s => s.userId?.toString() === userObjectId.toString());

  if (!ai && !ats) {
    return res.json({ reply: `No ATS analysis found yet for ${vacancy.title}. Please analyze your resume first.` });
  }

  // 3️⃣ Pick ATS first
  const score = ats?.score ?? ai?.score;
  const scoreType = ats ? "ATS" : "AI";

  // 4️⃣ Build resume tips from missing skills
  const resumeTips = ai?.missingSkills?.map(s => `• Improve ${s} skills`) || [];

  return res.json({
    reply: `Your ${scoreType} score for ${vacancy.title} is ${score}/100\n` +
           (resumeTips.length ? `Resume Tips:\n${resumeTips.join("\n")}` : ""),
    data: {
      atsScore: score,
      scoreType,
      matchedSkills: ai?.matchedSkills || [],
      missingSkills: ai?.missingSkills || []
    }
  });
}

case "get_missing_skills": {
  try {
    // --- 1️⃣ Get the vacancy ---
    let vacancy;

    if (vacancyId && mongoose.Types.ObjectId.isValid(vacancyId)) {
      vacancy = await Vacancy.findById(vacancyId);
    } else {
      // Clean message to extract job title
      const cleaned = message
        .toLowerCase()
        .replace(/\b(what|skills|are|is|missed|missing|for|role|job|the|my)\b/g, "")
        .trim();

      if (!cleaned) {
        return res.json({ reply: "Please mention the job title to check missing skills." });
      }

      const escaped = cleaned.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      vacancy = await Vacancy.findOne({ title: { $regex: escaped, $options: "i" } });

      if (!vacancy) {
        return res.json({ reply: "I couldn't find that job. Please try a clearer job title." });
      }
    }

    // --- 2️⃣ Get the user resume ---
    const user = await User.findById(userObjectId);
    if (!user?.resume) {
      return res.json({ reply: "You need to upload a resume first." });
    }

    const resumePath = path.join(__dirname, "../", user.resume);
    const pdf = await pdfParse(fs.readFileSync(resumePath));
    const resumeText = pdf.text.slice(0, 3500);

    // --- 3️⃣ Check if already analyzed ---
    let aiScoreObj = vacancy.aiScores?.find(s => s.userId?.toString() === userId);

    if (!aiScoreObj) {
      // Run Gemini AI analysis
      const aiResult = await analyzeResumeVsJob(resumeText, vacancy);

      // Save AI result to vacancy
      await Vacancy.updateOne(
        { _id: vacancy._id },
        {
          $push: {
            aiScores: {
              userId,
              score: aiResult.aiScore,
              matchedSkills: aiResult.matchedSkills,
              missingSkills: aiResult.missingSkills,
              summary: aiResult.summary,
              analyzedAt: new Date()
            }
          }
        }
      );

      aiScoreObj = aiResult;
    }

    // --- 4️⃣ Generate learning resources for missing skills ---
    let learningResources = {};
    if (aiScoreObj.missingSkills?.length) {
      learningResources = await generateLearningResources(aiScoreObj.missingSkills);
    }

    // --- 5️⃣ Build chatbot reply ---
    const replyText = aiScoreObj.missingSkills?.length
      ? `For ${vacancy.title}, you are missing the following skills:\n• ${aiScoreObj.missingSkills.join("\n• ")}`
      : `Great news! You are not missing any major skills for ${vacancy.title}. 🎉`;

    return res.json({
      reply: replyText,
      data: {
        missingSkills: aiScoreObj.missingSkills || [],
        learningResources
      }
    });

  } catch (err) {
    console.error("Error in get_missing_skills:", err);
    return res.status(500).json({
      reply: "Something went wrong while checking missing skills. Please try again."
    });
  }
}
case "get_application_status": {
  const applications = await Application.find({ userId })
    .populate("vacancyId", "title company location")
    .sort({ appliedAt: -1 });

  if (!applications.length) {
    return res.json({
      reply: "You haven’t applied to any jobs yet."
    });
  }

  const statusMap = {
    shortlisted: [],
    pending: [],
    rejected: []
  };

  applications.forEach(app => {
    const rawStatus = app.status?.toLowerCase();

    let normalizedStatus = "pending";

    if (rawStatus === "approved" || rawStatus === "shortlisted") {
      normalizedStatus = "shortlisted";
    } else if (rawStatus === "rejected") {
      normalizedStatus = "rejected";
    }

    statusMap[normalizedStatus].push({
      title: app.vacancyId?.title || "Unknown role",
      company: app.vacancyId?.company,
      location: app.vacancyId?.location,
      appliedAt: app.appliedAt
    });
  });

  let reply = "Here’s the current status of your applications:\n";

  if (statusMap.shortlisted.length) {
    reply += `\n✅ Shortlisted / Approved:\n• ${statusMap.shortlisted
      .map(j => j.title)
      .join("\n• ")}`;
  }

  if (statusMap.pending.length) {
    reply += `\n\n⏳ Under Review:\n• ${statusMap.pending
      .map(j => j.title)
      .join("\n• ")}`;
  }

  if (statusMap.rejected.length) {
    reply += `\n\n❌ Rejected:\n• ${statusMap.rejected
      .map(j => j.title)
      .join("\n• ")}`;
  }

  return res.json({
    reply,
    data: statusMap
  });
}
      // You can keep other intents like get_vacancies, get_ats_score, match_jobs, etc.
      default:
        return res.json({
          reply: "I can help with jobs, ATS score, and applications."
        });
    }
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ reply: "Something went wrong. Please try again." });
  }
};