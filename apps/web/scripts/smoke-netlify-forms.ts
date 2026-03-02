import * as dotenv from "dotenv";
dotenv.config();

// CLI Arguments
const args = process.argv.slice(2);
const FORMS_ARG_FULL = args.find((arg) => arg.startsWith("--forms="));
const FORMS_ARG = FORMS_ARG_FULL ? FORMS_ARG_FULL.split("=")[1] : null;

const LIVE_SITE_URL =
  process.env.LIVE_SITE_URL || "https://digiprint-main-web.netlify.app";

interface FormData {
  "form-name": string;
  "bot-field"?: string;
  [key: string]: string | undefined;
}

const ALL_FORMS: Record<string, FormData> = {
  // Contact
  contact: {
    "form-name": "contact",
    firstName: "Smoke Test",
    lastName: "User",
    email: "smoke-test@example.com",
    phone: "555-0199",
    message: "This is a smoke test submission.",
    agreeToTerms: "yes",
  },
  // Custom Design
  "custom-design": {
    "form-name": "custom-design",
    name: "Smoke Test Design",
    email: "smoke-test@example.com",
    projectType: "Smoke Test",
    description: "Smoke test description",
    // No file upload in smoke test
  },
  // Custom Template
  "custom-template": {
    "form-name": "custom-template",
    name: "Smoke Test Template",
    email: "smoke-test@example.com",
    "template-type": "business-card",
    description: "Smoke test description",
  },
  // Quote (Simplified - no file upload)
  quote: {
    "form-name": "quote",
    name: "Smoke Test Quote",
    email: "smoke-test@example.com",
    phone: "555-0123",
    projectType: "Smoke Test Quote",
  },
};

async function smokeTest() {
  console.log(`🚀 Starting Smoke Tests against: ${LIVE_SITE_URL}`);

  let formsToTest = ALL_FORMS;

  if (FORMS_ARG) {
    const requestedForms = FORMS_ARG.split(",");
    console.log(`🎯 Testing specific forms: ${requestedForms.join(", ")}`);
    // Filter ALL_FORMS by requested keys
    formsToTest = Object.fromEntries(
      Object.entries(ALL_FORMS).filter(([key]) => requestedForms.includes(key)),
    );
  } else {
    console.log(`Orders to test all ${Object.keys(ALL_FORMS).length} forms...`);
  }

  let passed = 0;
  let failed = 0;

  for (const [key, data] of Object.entries(formsToTest)) {
    console.log(`\nTesting form: ${key}...`);

    try {
      // 1. Convert data to x-www-form-urlencoded string
      const body = new URLSearchParams(data as any).toString();

      // 2. Send POST request
      const response = await fetch(`${LIVE_SITE_URL}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });

      // 3. Check response
      if (response.ok) {
        console.log(
          `✅ Form '${key}' submitted successfully (Status: ${response.status})`,
        );
        passed++;
      } else {
        console.error(
          `❌ Form '${key}' failed to submit. Status: ${response.status} ${response.statusText}`,
        );
        failed++;
        // Optional: Log response body if needed for debugging
        // const text = await response.text();
        // console.error(text);
      }
    } catch (error) {
      console.error(`❌ Form '${key}' encountered an error:`, error);
      failed++;
    }
  }

  console.log("\n--------------------------------------------------");
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log("--------------------------------------------------");

  if (failed > 0) {
    console.error("🚨 Smoke tests FAILED.");
    process.exit(1);
  } else {
    console.log("🎉 All smoke tests PASSED.");
    process.exit(0);
  }
}

smokeTest();
