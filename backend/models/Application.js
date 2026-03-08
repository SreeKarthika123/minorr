const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
 userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  vacancyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vacancy",
    required: true
  },
 
  coverLetter: { type: String },
  appliedAt: { type: Date, default: Date.now },
 
  
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING", 
  }
});


module.exports = mongoose.model("Application", applicationSchema);