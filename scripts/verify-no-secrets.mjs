import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { basename } from "node:path";

const trackedFiles = execFileSync("git", ["ls-files", "-z"])
  .toString("utf8")
  .split("\0")
  .filter(Boolean);

const findings = [];
const patterns = [
  {
    name: "Sanity token",
    regex: /\bsk[A-Za-z0-9_-]{40,}\b/g,
  },
  {
    name: "Netlify build hook",
    regex: /https:\/\/api\.netlify\.com\/build_hooks\/[A-Za-z0-9]{12,}/g,
  },
  {
    name: "secret query parameter",
    regex: /[?&]secret=[A-Za-z0-9_-]{20,}/gi,
  },
  {
    name: "secret-like assignment",
    regex: /\b(?:SANITY_(?:STUDIO_)?PREVIEW_SECRET|SANITY_WEBHOOK_SECRET|SANITY_REVALIDATE_SECRET)=[A-Za-z0-9_-]{24,}\b/g,
  },
  {
    name: "private key",
    regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  },
];

for (const file of trackedFiles) {
  if (!existsSync(file)) continue;

  const name = basename(file);
  if (name.startsWith(".env") && name !== ".env.example") {
    findings.push(`${file}: tracked environment file`);
  }

  let source;
  try {
    source = readFileSync(file, "utf8");
  } catch {
    continue;
  }

  for (const pattern of patterns) {
    const lines = source.split(/\r?\n/);
    lines.forEach((line, index) => {
      pattern.regex.lastIndex = 0;
      if (!pattern.regex.test(line)) return;
      if (/YOUR_|YOUR-|XXXX|\.\.\.|SET_IN_/i.test(line)) return;
      findings.push(`${file}:${index + 1}: ${pattern.name}`);
    });
  }
}

if (findings.length) {
  console.error("Credential safety check failed:");
  findings.forEach((finding) => console.error(`- ${finding}`));
  process.exit(1);
}

console.log(`Credential safety check passed (${trackedFiles.length} tracked files).`);
