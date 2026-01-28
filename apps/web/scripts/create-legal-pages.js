const { createClient } = require("@sanity/client");
require("dotenv").config({ path: ".env.local" });

// Create Sanity client with proper configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-05-03",
  useCdn: false,
});

const privacyContent = [
  {
    _type: "block",
    _key: "intro",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "intro-span",
        text: "At DigiPrintPlus, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our printing services.",
      },
    ],
  },
  {
    _type: "block",
    _key: "info-collect-header",
    style: "h2",
    children: [
      {
        _type: "span",
        _key: "info-collect-span",
        text: "1. Information We Collect",
      },
    ],
  },
  {
    _type: "block",
    _key: "personal-info",
    style: "h3",
    children: [
      {
        _type: "span",
        _key: "personal-info-span",
        text: "Personal Information",
      },
    ],
  },
  {
    _type: "block",
    _key: "personal-info-content",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "personal-info-content-span",
        text: "We may collect personal information that you voluntarily provide to us when you:",
      },
    ],
  },
  {
    _type: "block",
    _key: "personal-info-list",
    style: "normal",
    listItem: "bullet",
    children: [
      {
        _type: "span",
        _key: "list1-span",
        text: "Create an account or place an order",
      },
    ],
  },
  {
    _type: "block",
    _key: "personal-info-list2",
    style: "normal",
    listItem: "bullet",
    children: [
      {
        _type: "span",
        _key: "list2-span",
        text: "Contact us via email, phone, or contact forms",
      },
    ],
  },
  {
    _type: "block",
    _key: "personal-info-list3",
    style: "normal",
    listItem: "bullet",
    children: [
      {
        _type: "span",
        _key: "list3-span",
        text: "Subscribe to our newsletter or marketing communications",
      },
    ],
  },
  {
    _type: "block",
    _key: "personal-info-list4",
    style: "normal",
    listItem: "bullet",
    children: [
      {
        _type: "span",
        _key: "list4-span",
        text: "Upload files for printing services",
      },
    ],
  },
  {
    _type: "block",
    _key: "usage-data",
    style: "h3",
    children: [
      {
        _type: "span",
        _key: "usage-data-span",
        text: "Usage Data",
      },
    ],
  },
  {
    _type: "block",
    _key: "usage-data-content",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "usage-data-content-span",
        text: "We automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, and pages visited. We use this information to analyze website usage and improve our services.",
      },
    ],
  },
  {
    _type: "block",
    _key: "how-we-use",
    style: "h2",
    children: [
      {
        _type: "span",
        _key: "how-we-use-span",
        text: "2. How We Use Your Information",
      },
    ],
  },
  {
    _type: "block",
    _key: "use-purposes",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "use-purposes-span",
        text: "We use the information we collect for various purposes, including:",
      },
    ],
  },
  {
    _type: "block",
    _key: "use-list1",
    style: "normal",
    listItem: "bullet",
    children: [
      {
        _type: "span",
        _key: "use-list1-span",
        text: "Processing and fulfilling your printing orders",
      },
    ],
  },
  {
    _type: "block",
    _key: "use-list2",
    style: "normal",
    listItem: "bullet",
    children: [
      {
        _type: "span",
        _key: "use-list2-span",
        text: "Providing customer support and responding to inquiries",
      },
    ],
  },
  {
    _type: "block",
    _key: "use-list3",
    style: "normal",
    listItem: "bullet",
    children: [
      {
        _type: "span",
        _key: "use-list3-span",
        text: "Sending order confirmations and shipping notifications",
      },
    ],
  },
  {
    _type: "block",
    _key: "use-list4",
    style: "normal",
    listItem: "bullet",
    children: [
      {
        _type: "span",
        _key: "use-list4-span",
        text: "Improving our website and services",
      },
    ],
  },
  {
    _type: "block",
    _key: "data-protection",
    style: "h2",
    children: [
      {
        _type: "span",
        _key: "data-protection-span",
        text: "3. Data Protection and Security",
      },
    ],
  },
  {
    _type: "block",
    _key: "security-measures",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "security-measures-span",
        text: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.",
      },
    ],
  },
  {
    _type: "block",
    _key: "your-rights",
    style: "h2",
    children: [
      {
        _type: "span",
        _key: "your-rights-span",
        text: "4. Your Rights",
      },
    ],
  },
  {
    _type: "block",
    _key: "rights-content",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "rights-content-span",
        text: "You have the right to access, update, or delete your personal information. You may also opt out of receiving marketing communications from us at any time by contacting us directly or using the unsubscribe link in our emails.",
      },
    ],
  },
  {
    _type: "block",
    _key: "contact-info-header",
    style: "h2",
    children: [
      {
        _type: "span",
        _key: "contact-info-span",
        text: "5. Contact Us",
      },
    ],
  },
  {
    _type: "block",
    _key: "contact-content",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "contact-normal",
        text: "If you have any questions about this Privacy Policy or our data practices, please contact us at ",
      },
      {
        _type: "span",
        _key: "contact-email",
        marks: ["strong"],
        text: "privacy@digiprintplus.com",
      },
      {
        _type: "span",
        _key: "contact-or",
        text: " or call us at ",
      },
      {
        _type: "span",
        _key: "contact-phone",
        marks: ["strong"],
        text: "[PHONE_FROM_SETTINGS]",
      },
      {
        _type: "span",
        _key: "contact-period",
        text: ".",
      },
    ],
  },
];

const termsContent = [
  {
    _type: "block",
    _key: "terms-intro",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "terms-intro-span",
        text: 'Welcome to DigiPrintPlus. These Terms of Service ("Terms") govern your use of our website and printing services. By accessing our website or using our services, you agree to be bound by these Terms.',
      },
    ],
  },
  {
    _type: "block",
    _key: "acceptance",
    style: "h2",
    children: [
      {
        _type: "span",
        _key: "acceptance-span",
        text: "1. Acceptance of Terms",
      },
    ],
  },
  {
    _type: "block",
    _key: "acceptance-content",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "acceptance-content-span",
        text: "By using DigiPrintPlus services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.",
      },
    ],
  },
  {
    _type: "block",
    _key: "services",
    style: "h2",
    children: [
      {
        _type: "span",
        _key: "services-span",
        text: "2. Our Services",
      },
    ],
  },
  {
    _type: "block",
    _key: "services-content",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "services-content-span",
        text: "DigiPrintPlus provides professional printing services including but not limited to business cards, brochures, flyers, banners, and custom printing solutions. All services are subject to availability and our production capabilities.",
      },
    ],
  },
  {
    _type: "block",
    _key: "orders",
    style: "h2",
    children: [
      {
        _type: "span",
        _key: "orders-span",
        text: "3. Orders and Payment",
      },
    ],
  },
  {
    _type: "block",
    _key: "order-process",
    style: "h3",
    children: [
      {
        _type: "span",
        _key: "order-process-span",
        text: "Order Process",
      },
    ],
  },
  {
    _type: "block",
    _key: "order-content",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "order-content-span",
        text: "All orders must be placed through our website or by contacting our customer service team. Orders are subject to acceptance and verification. We reserve the right to refuse or cancel any order at our discretion.",
      },
    ],
  },
  {
    _type: "block",
    _key: "pricing",
    style: "h3",
    children: [
      {
        _type: "span",
        _key: "pricing-span",
        text: "Pricing and Payment",
      },
    ],
  },
  {
    _type: "block",
    _key: "pricing-content",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "pricing-content-span",
        text: "Prices are quoted based on current specifications and are subject to change without notice. Payment is required before production begins unless alternative arrangements have been made. We accept major credit cards and other approved payment methods.",
      },
    ],
  },
  {
    _type: "block",
    _key: "quality",
    style: "h2",
    children: [
      {
        _type: "span",
        _key: "quality-span",
        text: "4. Quality and Delivery",
      },
    ],
  },
  {
    _type: "block",
    _key: "quality-content",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "quality-content-span",
        text: "We strive to deliver high-quality printing services within the agreed timeframe. Delivery times are estimates and may vary based on order complexity, quantity, and current workload. Rush orders may be available for an additional fee.",
      },
    ],
  },
  {
    _type: "block",
    _key: "liability",
    style: "h2",
    children: [
      {
        _type: "span",
        _key: "liability-span",
        text: "5. Limitation of Liability",
      },
    ],
  },
  {
    _type: "block",
    _key: "liability-content",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "liability-content-span",
        text: "DigiPrintPlus shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid for the specific order in question.",
      },
    ],
  },
  {
    _type: "block",
    _key: "intellectual-property",
    style: "h2",
    children: [
      {
        _type: "span",
        _key: "ip-span",
        text: "6. Intellectual Property",
      },
    ],
  },
  {
    _type: "block",
    _key: "ip-content",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "ip-content-span",
        text: "You retain ownership of your content and designs. By submitting materials to us, you grant DigiPrintPlus a limited license to use, reproduce, and modify your materials solely for the purpose of fulfilling your order. You represent that you have the right to use all submitted materials.",
      },
    ],
  },
  {
    _type: "block",
    _key: "changes",
    style: "h2",
    children: [
      {
        _type: "span",
        _key: "changes-span",
        text: "7. Changes to Terms",
      },
    ],
  },
  {
    _type: "block",
    _key: "changes-content",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "changes-content-span",
        text: "We reserve the right to update these Terms at any time. Changes will be posted on our website and will become effective immediately upon posting. Your continued use of our services constitutes acceptance of the revised Terms.",
      },
    ],
  },
  {
    _type: "block",
    _key: "contact",
    style: "h2",
    children: [
      {
        _type: "span",
        _key: "contact-span",
        text: "8. Contact Information",
      },
    ],
  },
  {
    _type: "block",
    _key: "terms-contact-content",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "terms-contact-normal",
        text: "For questions about these Terms of Service, please contact us at ",
      },
      {
        _type: "span",
        _key: "terms-contact-email",
        marks: ["strong"],
        text: "legal@digiprintplus.com",
      },
      {
        _type: "span",
        _key: "terms-contact-or",
        text: " or call ",
      },
      {
        _type: "span",
        _key: "terms-contact-phone",
        marks: ["strong"],
        text: "[PHONE_FROM_SETTINGS]",
      },
      {
        _type: "span",
        _key: "terms-contact-period",
        text: ".",
      },
    ],
  },
];

async function createLegalPages() {
  try {
    console.log("🚀 Starting to create legal pages in Sanity...");

    // Check if pages already exist
    const existingPrivacy = await client.fetch(
      '*[_type == "page" && slug.current == "privacy"][0]',
    );
    const existingTerms = await client.fetch(
      '*[_type == "page" && slug.current == "terms"][0]',
    );

    if (existingPrivacy) {
      console.log("⚠️  Privacy Policy page already exists, skipping...");
    } else {
      console.log("📝 Creating Privacy Policy page...");
      const privacyPage = await client.create({
        _type: "page",
        title: "Privacy Policy",
        slug: {
          _type: "slug",
          current: "privacy",
        },
        subtitle: "How we collect, use, and protect your personal information",
        content: privacyContent,
        seo: {
          metaTitle: "Privacy Policy - DigiPrintPlus",
          metaDescription:
            "Learn how DigiPrintPlus protects your privacy and handles your personal information. Comprehensive privacy policy for our printing services.",
        },
        publishedAt: new Date().toISOString(),
      });
      console.log("✅ Privacy Policy page created with ID:", privacyPage._id);
    }

    if (existingTerms) {
      console.log("⚠️  Terms of Service page already exists, skipping...");
    } else {
      console.log("📝 Creating Terms of Service page...");
      const termsPage = await client.create({
        _type: "page",
        title: "Terms of Service",
        slug: {
          _type: "slug",
          current: "terms",
        },
        subtitle: "Terms and conditions for using our printing services",
        content: termsContent,
        seo: {
          metaTitle: "Terms of Service - DigiPrintPlus",
          metaDescription:
            "Read our terms of service for DigiPrintPlus printing services. Understand your rights and responsibilities when using our services.",
        },
        publishedAt: new Date().toISOString(),
      });
      console.log("✅ Terms of Service page created with ID:", termsPage._id);
    }

    console.log("🎉 Legal pages setup completed successfully!");
  } catch (error) {
    console.error("❌ Error creating legal pages:", error);
    process.exit(1);
  }
}

createLegalPages();
