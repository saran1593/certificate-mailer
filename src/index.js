const processStudents = require('./workflow/processStudents');

// Ensure environmental configurations are loaded
require('dotenv').config();

(async () => {
  try {
    console.log('--- Certificate Mailer Starting ---');
    await processStudents();
    console.log('--- Certificate Mailer Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('Unhandled fatal error in application main process:', error);
    process.exit(1);
  }
})();
