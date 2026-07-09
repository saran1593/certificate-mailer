const transporter = require('../config/mail');
const { EMAIL } = require('../config/constants');

/**
 * Sends an email with an optional attachment.
 * 
 * @param {object} options - Email options.
 * @param {string} options.to - Recipient email.
 * @param {string} options.subject - Email subject.
 * @param {string} options.html - HTML body of the email.
 * @param {Array<object>} [options.attachments] - Array of attachment objects (e.g. [{ filename, path }]).
 * @returns {Promise<{ success: boolean, messageId?: string, error?: Error }>}
 */
async function sendEmail({ to, subject, html, attachments }) {
  try {
    const mailOptions = {
      from: EMAIL.FROM,
      to,
      subject: subject || EMAIL.SUBJECT,
      html,
      attachments: attachments || []
    };

    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    return {
      success: false,
      error
    };
  }
}

module.exports = {
  sendEmail
};
