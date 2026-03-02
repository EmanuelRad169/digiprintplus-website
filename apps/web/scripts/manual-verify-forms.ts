import fs from "fs";
import path from "path";

// 1. Print Steps
console.log(`
\x1b[36m🚀 Netlify Forms Email Verification Checklist 🚀\x1b[0m

1️⃣  Trigger Smoke Test:
    Run: \x1b[33mpnpm --filter web smoke:forms\x1b[0m

2️⃣  Verify Data Reception:
    Go to: \x1b[34mhttps://app.netlify.com/sites/digiprint-main-web/forms\x1b[0m
    Check for submissions from "Smoke Test User".

3️⃣  Verify Email Delivery:
    Check your admin email inbox for notifications.
    Subject lines start with: "New Form Submission: ..."
    \x1b[31m⚠️ Check Spam/Promotions folder!\x1b[0m

4️⃣  Troubleshooting:
    Open: \x1b[34mapps/web/EMAIL_TEST_PLAN.md\x1b[0m for full guide.
`);

// 2. Open the Markdown file (optional convenience)
const planPath = path.resolve(process.cwd(), "apps/web/EMAIL_TEST_PLAN.md");

if (fs.existsSync(planPath)) {
  console.log(`\x1b[32m✔ Plan file found at: ${planPath}\x1b[0m`);
  console.log(`Open it in your editor to follow along.`);
} else {
  console.log(`\x1b[31m✖ Plan file not found at: ${planPath}\x1b[0m`);
}
