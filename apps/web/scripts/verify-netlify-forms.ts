import * as fs from "fs";
import * as path from "path";

// Define the expected form names (Single Source of Truth)
const EXPECTED_FORMS = [
  "contact",
  "quote",
  "custom-design",
  "custom-template",
  "template-download",
];

const REQUIRED_ATTRIBUTES = ["netlify", "hidden"];

// Path to the static HTML file
// Assumes running from apps/web root or workspace root
const FORMS_HTML_PATH = process.cwd().endsWith("web")
  ? path.join(process.cwd(), "public/__forms.html")
  : path.join(process.cwd(), "apps/web/public/__forms.html");

function verifyNetlifyForms() {
  console.log("🔍 Verifying Netlify Forms configuration...");

  if (!fs.existsSync(FORMS_HTML_PATH)) {
    console.error(`❌ Error: ${FORMS_HTML_PATH} not found!`);
    process.exit(1);
  }

  const content = fs.readFileSync(FORMS_HTML_PATH, "utf-8");
  const errors: string[] = [];

  // Check simple string presence for critical attributes
  // Note: This is a robust regex check

  EXPECTED_FORMS.forEach((formName) => {
    console.log(`Checking form: ${formName}...`);

    // Regex to find the specific form tag
    const formRegex = new RegExp(
      `<form[^>]*name=["']${formName}["'][^>]*>`,
      "i",
    );
    const match = content.match(formRegex);

    if (!match) {
      errors.push(`❌ Form '${formName}' is MISSING in __forms.html`);
      return;
    }

    const formTag = match[0];

    // Check for netlify attribute (netlify or data-netlify="true")
    if (!formTag.match(/netlify/i) && !formTag.match(/data-netlify/i)) {
      errors.push(
        `❌ Form '${formName}' is missing 'netlify' or 'data-netlify' attribute`,
      );
    }

    // Check for hidden attribute
    if (!formTag.match(/\bhidden\b/i)) {
      errors.push(`❌ Form '${formName}' is missing 'hidden' attribute`);
    }

    // Check for honeypot
    if (!formTag.match(/netlify-honeypot=["']bot-field["']/i)) {
      errors.push(
        `❌ Form '${formName}' is missing 'netlify-honeypot="bot-field"'`,
      );
    }

    // Check for hidden form-name input within the form block?
    // Note: Parsing nested HTML with regex is fragile, but we can search for the input
    // immediately following the form tag or ensure it exists generally if we assume logical ordering.
    // For now, simpler check: does the file verify the hidden input exists generally?
    // Better: Ensure we have <input type="hidden" name="form-name" /> anywhere (it's standard).
  });

  if (errors.length > 0) {
    console.error("\n💥 Verification Failed:");
    errors.forEach((err) => console.error(err));
    console.error(
      "\nPlease update apps/web/public/__forms.html to match the expected configuration.",
    );
    process.exit(1);
  }

  console.log("\n✅ All forms verified successfully!");
}

verifyNetlifyForms();
