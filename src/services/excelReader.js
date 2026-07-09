const xlsx = require('xlsx');
const fileExists = require('../utils/fileExists');

/**
 * Reads an Excel file and converts the first sheet into a JSON array.
 * Normailzes column keys to lowercase (e.g., 'name', 'email').
 * 
 * @param {string} filePath - Absolute path to the Excel file.
 * @returns {Promise<Array<object>>} Resolves to array of objects.
 */
async function readExcel(filePath) {
  const exists = await fileExists(filePath);
  if (!exists) {
    throw new Error(`Excel file not found at: ${filePath}`);
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert worksheet to raw JSON array
  const rawRows = xlsx.utils.sheet_to_json(worksheet);

  // Normalize column names to lowercase for consistency
  return rawRows.map(row => {
    const normalized = {};
    for (const key of Object.keys(row)) {
      const normalizedKey = key.trim().toLowerCase();
      normalized[normalizedKey] = row[key];
    }
    return {
      name: normalized.name ? String(normalized.name).trim() : null,
      email: normalized.email ? String(normalized.email).trim() : null,
    };
  });
}

module.exports = {
  readExcel
};
