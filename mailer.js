const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail", // ✅ correct
  auth: {
    user: process.env.EMAIL_USER, // ✅ env variable
    pass: process.env.EMAIL_PASS, // ✅ app password
  },
});

/* ✅ VERIFY MAIL CONFIG */
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail config error:", error);
  } else {
    console.log("✅ Mail server ready");
  }
});

module.exports = transporter;
