const fs = require('fs-extra');
const path = require('path');
const { PATHS } = require('../config/constants');

const successLogPath = path.resolve(PATHS.LOGS, 'success.log');
const failedLogPath = path.resolve(PATHS.LOGS, 'failed.log');
const reportPath = path.resolve(PATHS.LOGS, 'report.json');

/**
 * Initializes logs directory and files if they do not exist.
 */
async function initLogger() {
  await fs.ensureDir(PATHS.LOGS);
}

/**
 * Logs a successful email transmission.
 * 
 * @param {string} name - Raw student name.
 * @param {string} email - Student email.
 * @param {string} messageId - Nodemailer response messageId.
 */
async function logSuccess(name, email, messageId) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] SUCCESS: Name="${name}", Email="${email}", MessageId="${messageId}"\n`;
  await fs.appendFile(successLogPath, logMessage, 'utf8');
}

/**
 * Logs a failed email processing event (e.g. invalid email, missing attachment, SMTP error).
 * 
 * @param {string} name - Raw student name.
 * @param {string} email - Student email.
 * @param {string} reason - Detailed error reason.
 */
async function logFailure(name, email, reason) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] FAILED: Name="${name}", Email="${email}", Reason="${reason}"\n`;
  await fs.appendFile(failedLogPath, logMessage, 'utf8');
}

/**
 * Writes the final execution summary to report.json.
 * 
 * @param {object} reportData - Object summarizing execution status.
 */
async function writeReport(reportData) {
  await fs.writeJson(reportPath, reportData, { spaces: 2 });
}

module.exports = {
  initLogger,
  logSuccess,
  logFailure,
  writeReport
};
