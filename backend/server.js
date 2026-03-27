const express = require("express");
// const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // <-- must be at the very top
// const { precomputeJobEmbeddings } = require("./routes/aiRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
// const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/auth");
const hrRoutes = require("./routes/hr.js");
const cookieParser = require("cookie-parser");
const app = express();
const aiRoutes =require("./routes/aiRoutes.js");
const atsScoring=require("./routes/ats.js");
const vacancyRoutes = require("./routes/vacancy");
// const vacancy=require("/routes/vacancy.js");
// const server = http.createServer(app);

// // attach Socket.IO chatbot
// const attachChatbot = require("./routes/chatbot");
// attachChatbot(server);
const chatbot=require("./routes/chatbot.js");
// const matchRoutes = require("./routes/aiRoutes.js");

const chatbotRoutes = require("./routes/chatbot");
const userRoutes = require("./routes/users");
const session = require("express-session");

console.log("🔥 SERVER FILE RUNNING");
// app.use(
//   session({
//     secret: "123456", // change this
//     resave: false,
//     saveUninitialized: true,   
//     // Save a session even if it’s new and hasn’t been modified yet.
//     cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
//   })
// );

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
// MongoDB connection
mongoose
  .connect("mongodb+srv://tarunicherukuri_db_user:9MKcNs5tjHzuMpYG@cluster0.q3ujumr.mongodb.net/?appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));


app.use("/api/users", userRoutes);
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/hr", hrRoutes);

app.use("/api/applications", applicationRoutes);
app.use("/api/chatbot", chatbotRoutes);
// app.use("/api/ai", matchRoutes);
// app.use("/api/ai", aiRoutes);
// app.use("/api/ai", aiRoutes);
app.use("/api/ats",atsScoring);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/")
app.use("/api/vacancies", vacancyRoutes);
app.use("/api/notifications", require("./routes/notification"));

// app.use("/api/hr-chatbot", require("./routes/hrChatbot"));
app.use("/api/ai", aiRoutes);
// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
