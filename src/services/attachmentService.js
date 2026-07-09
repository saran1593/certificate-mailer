const path = require('path');
const { PATHS } = require('../config/constants');
const fileExists = require('../utils/fileExists');

/**
 * Resolves the certificate PDF file path and verifies if it exists.
 * 
 * @param {string} rawName - Original name from Excel sheet (e.g., "saran_s_v")
 * @returns {Promise<{ exists: boolean, path: string, filename: string }>}
 */
async function getCertificateAttachment(rawName) {
  if (!rawName) {
    return { exists: false, path: '', filename: '' };
  }

  const filename = `${rawName}.pdf`;
  const fullPath = path.resolve(PATHS.CERTIFICATES, filename);
  const exists = await fileExists(fullPath);

  return {
    exists,
    path: fullPath,
    filename
  };
}

module.exports = {
  getCertificateAttachment
};
