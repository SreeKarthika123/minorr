
// const nodemailer = require("nodemailer");


// utils/mailer.js
const nodemailer = require("nodemailer");

// Example with Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password or regular password
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
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   },
//   connectionTimeout: 10000,  // optional: increase timeout
//   tls: {
//     rejectUnauthorized: false,
//   },
//   family: 4 // ⚡ Force IPv4
// });

// async function sendApprovalEmail(to, candidateName, vacancyTitle) {
//   const mailOptions = {
//     from: `"HR Team" <${process.env.EMAIL_USER}>`,
//     to,
//     subject: `Congratulations! You are shortlisted for ${vacancyTitle}`,
//     html: `
//       <p>Hi ${candidateName},</p>
//       <p>Congratulations! You have been <strong>shortlisted</strong> for the position <strong>${vacancyTitle}</strong>.</p>
//       <p>Our HR team will contact you shortly with the next steps.</p>
//       <br/>
//       <p>Best regards,<br/>HR Team</p>
//     `,
//   };

//   return transporter.sendMail(mailOptions);
// }

// module.exports = { sendApprovalEmail };