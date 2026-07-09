/**
 * Formats a name string by splitting it on underscores, capitalizing each segment, 
 * and joining them back with spaces.
 * 
 * Example: "saran_s_v" -> "Saran S V"
 * 
 * @param {string} rawName - The raw name string from the Excel sheet (e.g. 'saran_s_v')
 * @returns {string} The formatted name (e.g. 'Saran S V')
 */
function formatName(rawName) {
  if (!rawName || typeof rawName !== 'string') {
    return '';
  }
  
  return rawName
    .split('_')
    .filter(segment => segment.length > 0) // Avoid extra spaces if double underscores exist
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

module.exports = formatName;
