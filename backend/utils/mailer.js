
// const nodemailer = require("nodemailer");


// utils/mailer.js
const nodemailer = require("nodemailer");

// Example with Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

const sendMail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent: ", info.response);
  } catch (err) {
    console.error("Error sending email: ", err);
  }
};

module.exports = sendMail;