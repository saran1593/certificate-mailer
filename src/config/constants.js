const path = require('path');
require('dotenv').config();

const ROOT_DIR = path.resolve(__dirname, '../../');

module.exports = {
  SMTP: {
    HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
    USER: process.env.SMTP_USER,
    PASS: process.env.SMTP_PASS,
    SECURE: process.env.SMTP_SECURE === 'true',
  },
  EMAIL: {
    FROM: process.env.EMAIL_FROM || '"ABC Team" <noreply@example.com>',
    SUBJECT: process.env.EMAIL_SUBJECT || 'Congratulations on your Certificate!',
  },
  PATHS: {
    EXCEL: path.resolve(ROOT_DIR, process.env.EXCEL_PATH || 'data/students.xlsx'),
    CERTIFICATES: path.resolve(ROOT_DIR, process.env.CERTIFICATES_DIR || 'certificates'),
    LOGS: path.resolve(ROOT_DIR, process.env.LOGS_DIR || 'logs'),
  },
  RATE_LIMIT: {
    DELAY_MIN: parseInt(process.env.EMAIL_DELAY_MIN, 10) || 5000,
    DELAY_MAX: parseInt(process.env.EMAIL_DELAY_MAX, 10) || 10000,
    BATCH_SIZE: parseInt(process.env.BATCH_SIZE, 10) || 25,
    BATCH_PAUSE: parseInt(process.env.BATCH_PAUSE_MS, 10) || 180000,
  }
};
