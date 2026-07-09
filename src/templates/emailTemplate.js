const fs = require('fs-extra');
const path = require('path');

// We can cache the template in memory or load it on demand. 
// Loading it on demand asynchronously is clean and allows changes without restarting the script, 
// but cache is also good. Let's write a robust loader.

const templatePath = path.resolve(__dirname, '../../templates/certificateEmail.html');

/**
 * Generates the email HTML content by replacing placeholders with student details.
 * 
 * @param {string} formattedName - The formatted name of the student (e.g. "Saran S V")
 * @returns {Promise<string>} The populated HTML string.
 */
async function getEmailHtml(formattedName) {
  try {
    const templateContent = await fs.readFile(templatePath, 'utf8');
    return templateContent.replace(/\{\{name\}\}/g, formattedName);
  } catch (error) {
    throw new Error(`Failed to load email template: ${error.message}`);
  }
}

module.exports = {
  getEmailHtml
};
