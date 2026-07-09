const nodemailer = require('nodemailer');
const { SMTP } = require('./constants');

/**
 * Creates and configures a Nodemailer transporter.
 */
const transporter = nodemailer.createTransport({
  host: SMTP.HOST,
  port: SMTP.PORT,
  secure: SMTP.SECURE, // true for 465, false for other ports
  auth: {
    user: SMTP.USER,
    pass: SMTP.PASS,
  },
});

module.exports = transporter;
