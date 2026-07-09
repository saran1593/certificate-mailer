const fs = require('fs-extra');

/**
 * Checks if a file exists at the given path.
 * 
 * @param {string} filePath - Path to check.
 * @returns {Promise<boolean>} Resolves to true if file exists, false otherwise.
 */
async function fileExists(filePath) {
  try {
    const exists = await fs.pathExists(filePath);
    if (!exists) return false;
    
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch (error) {
    return false;
  }
}

module.exports = fileExists;
