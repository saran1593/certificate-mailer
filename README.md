# Certificate Mailer

A production-ready Node.js utility that reads student records from an Excel (`.xlsx`) file, formats their names, validates their email addresses, verifies the presence of their certificate attachment (PDF), and sends a beautifully styled HTML email with their personalized certificate attached.

## Project Structure

```text
certificate-mailer/
│
├── certificates/         # [USER SUPPLIED] Put your PDF certificates here (e.g. saran_s_v.pdf)
│
├── data/                 # [USER SUPPLIED] Put your Excel files here (e.g. students.xlsx)
│
├── logs/                 # [GENERATED] Success, failure logs, and final run report
│   ├── success.log
│   ├── failed.log
│   └── report.json
│
├── templates/
│   └── certificateEmail.html  # Premium HTML email template
│
├── src/
│   ├── config/
│   │   ├── mail.js       # Nodemailer transporter configuration
│   │   └── constants.js  # Environment configuration and path mappings
│   │
│   ├── services/
│   │   ├── excelReader.js       # Reads & converts Excel to JSON
│   │   ├── emailService.js      # Sends emails via nodemailer
│   │   ├── attachmentService.js # Locates and validates certificate PDF paths
│   │   └── loggerService.js     # Manages logging and summary reports
│   │
│   ├── utils/
│   │   ├── formatName.js    # Formats name (e.g. saran_s_v -> Saran S V)
│   │   ├── validateEmail.js # Validates email addresses
│   │   ├── fileExists.js    # Checks if files exist on disk
│   │   └── delay.js         # Delays execution to prevent SMTP rate-limiting
│   │
│   ├── templates/
│   │   └── emailTemplate.js # Formulates email template contents
│   │
│   ├── workflow/
│   │   └── processStudents.js # Workflow orchestrator
│   │
│   └── index.js          # App entry point
│
├── .env                  # SMTP and environment configuration
├── package.json
└── README.md
```

## Setup Instructions

1. **Install Dependencies:**
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Update the `.env` file in the root directory with your SMTP server details.
   For example, using Gmail:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   SMTP_SECURE=false
   
   EMAIL_FROM="ABC Team" <your_email@gmail.com>
   EMAIL_SUBJECT="Congratulations on your Certificate!"
   ```
   *Note: For Gmail, you will need to generate an App Password in your Google Account settings.*

3. **Provide Data & Certificates:**
   - Create a folder called `data/` and put your `students.xlsx` file inside it. The sheet must have columns named `name` and `email`.
   - Create a folder called `certificates/` and place the certificate PDFs there. The files must match the exact raw names from the Excel file (e.g., if Excel row name is `saran_s_v`, the file must be named `certificates/saran_s_v.pdf`).

## Run the Application

To start the certificate mailing workflow:
```bash
npm start
```

The console will show step-by-step progress, and all actions will be logged to `logs/success.log`, `logs/failed.log`, and `logs/report.json`.
