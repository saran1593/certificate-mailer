const { PATHS, RATE_LIMIT } = require('../config/constants');
const { readExcel } = require('../services/excelReader');
const { sendEmail } = require('../services/emailService');
const { getCertificateAttachment } = require('../services/attachmentService');
const { initLogger, logSuccess, logFailure, writeReport } = require('../services/loggerService');

const formatName = require('../utils/formatName');
const validateEmail = require('../utils/validateEmail');
const delay = require('../utils/delay');

/**
 * Orchestrates the entire student record reading, validation, formatting, and emailing flow.
 */
async function processStudents() {
  console.log('Initializing logs and reading configuration...');
  await initLogger();

  const stats = {
    startTime: new Date().toISOString(),
    totalProcessed: 0,
    successful: 0,
    failed: 0,
    invalidEmails: 0,
    missingAttachments: 0,
    records: []
  };

  let sentInBatchCount = 0;

  try {
    console.log(`Reading student records from: ${PATHS.EXCEL}`);
    const students = await readExcel(PATHS.EXCEL);
    
    stats.totalProcessed = students.length;
    console.log(`Found ${students.length} student records. Beginning processing...`);

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const { name: rawName, email } = student;
      
      console.log(`\n[${i + 1}/${students.length}] Processing: ${rawName || 'Unknown'} (${email || 'No Email'})`);

      // 1. Validate inputs (specifically check if name or email are empty/undefined)
      if (!rawName) {
        const errorReason = 'Missing student name in Excel record';
        console.error(`❌ ${errorReason}`);
        await logFailure('Unknown', email || 'Unknown', errorReason);
        stats.failed++;
        stats.records.push({ name: 'Unknown', email, status: 'FAILED', reason: errorReason });
        continue;
      }

      // 2. Validate email
      if (!email || !validateEmail(email)) {
        const errorReason = `Invalid email address: "${email}"`;
        console.error(`❌ ${errorReason}`);
        await logFailure(rawName, email || 'Unknown', errorReason);
        stats.invalidEmails++;
        stats.records.push({ name: rawName, email, status: 'INVALID_EMAIL', reason: errorReason });
        continue;
      }

      // 3. Format name
      const formattedName = formatName(rawName);

      // 4. Locate PDF attachment
      const attachment = await getCertificateAttachment(rawName);
      if (!attachment.exists) {
        const errorReason = `Missing PDF attachment: "${attachment.filename}"`;
        console.error(`❌ ${errorReason}`);
        await logFailure(rawName, email, errorReason);
        stats.missingAttachments++;
        stats.records.push({ name: rawName, email, status: 'MISSING_ATTACHMENT', reason: errorReason });
        continue;
      }

      // 5. Generate Email Template HTML
      let htmlContent;
      try {
        const { getEmailHtml } = require('../templates/emailTemplate');
        htmlContent = await getEmailHtml(formattedName);
      } catch (templateError) {
        const errorReason = `Template rendering failed: ${templateError.message}`;
        console.error(`❌ ${errorReason}`);
        await logFailure(rawName, email, errorReason);
        stats.failed++;
        stats.records.push({ name: rawName, email, status: 'FAILED', reason: errorReason });
        continue;
      }

      // 6. Send Email
      console.log(`Sending certificate to ${formattedName} (${email})...`);
      const emailResult = await sendEmail({
        to: email,
        html: htmlContent,
        attachments: [
          {
            filename: attachment.filename,
            path: attachment.path
          }
        ]
      });

      sentInBatchCount++;

      if (emailResult.success) {
        console.log(`✅ Email sent successfully! MessageId: ${emailResult.messageId}`);
        await logSuccess(rawName, email, emailResult.messageId);
        stats.successful++;
        stats.records.push({ name: rawName, email, status: 'SUCCESS', messageId: emailResult.messageId });
      } else {
        const errorReason = `Email delivery failed: ${emailResult.error.message}`;
        console.error(`❌ ${errorReason}`);
        await logFailure(rawName, email, errorReason);
        stats.failed++;
        stats.records.push({ name: rawName, email, status: 'FAILED', reason: errorReason });
      }

      // Check if we need to apply delays or pauses
      if (i + 1 < students.length) {
        if (sentInBatchCount >= RATE_LIMIT.BATCH_SIZE) {
          const pauseMinutes = (RATE_LIMIT.BATCH_PAUSE / 60000).toFixed(1);
          console.log(`\n⏸️ [Batch Limit Reached] Sent ${sentInBatchCount} emails. Pausing for ${pauseMinutes} minutes to avoid rate limits...`);
          await delay(RATE_LIMIT.BATCH_PAUSE);
          sentInBatchCount = 0;
        } else {
          const delayMs = Math.floor(Math.random() * (RATE_LIMIT.DELAY_MAX - RATE_LIMIT.DELAY_MIN + 1)) + RATE_LIMIT.DELAY_MIN;
          console.log(`⏳ Waiting ${(delayMs / 1000).toFixed(1)} seconds...`);
          await delay(delayMs);
        }
      }
    }

  } catch (error) {
    console.error('Fatal error during student processing:', error);
    await logFailure('SYSTEM_ORCHESTRATOR', 'N/A', `Fatal Error: ${error.message}`);
  } finally {
    stats.endTime = new Date().toISOString();
    console.log('\n=======================================');
    console.log('Processing Complete.');
    console.log(`Total Records:        ${stats.totalProcessed}`);
    console.log(`Successful:           ${stats.successful}`);
    console.log(`Failed:               ${stats.failed}`);
    console.log(`Invalid Emails:       ${stats.invalidEmails}`);
    console.log(`Missing Attachments:  ${stats.missingAttachments}`);
    console.log('=======================================');

    await writeReport(stats);
    console.log('Summary report saved to logs/report.json');
  }
}

module.exports = processStudents;
