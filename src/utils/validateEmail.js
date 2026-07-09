const validator = require('validator');

/**
 * Validates whether the given string is a valid email address.
 * 
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return validator.isEmail(email.trim());
}

module.exports = validateEmail;
