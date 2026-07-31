import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import path from "path";
import { getCliClient } from "sanity/cli";

const UPDATE_BATCH_SIZE = 50;

type AuthMode = "token" | "session";

type TemplateDoc = {
  _id: string;
  title?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  fileType?: string;
  size?: string;
  category?: {
    title?: string;
    slug?: { current?: string };
  };
  sourceProvider?: string;
  importSource?: string;
  importedByScript?: boolean;
  importBatchId?: string;
};

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "your",
  "this",
  "that",
  "template",
  "print",
  "ready",
  "download",
]);

function loadEnv() {
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
  dotenv.config({ path: path.resolve(process.cwd(), "../web/.env.local") });
}

function cleanText(input: string): string {
  return input.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function titleCase(input: string): string {
  return input
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function isWeakDescription(description?: string): boolean {
  if (!description) return true;
  const clean = description.trim();
  if (clean.length < 60) return true;
  if (/^imported from 4over/i.test(clean)) return true;
  return false;
}

function isClearlyWeakTitle(title?: string): boolean {
  if (!title) return true;
  const clean = title.trim();
  if (clean.length < 8) return true;
  if (/^(untitled|template|new template)$/i.test(clean)) return true;
  if (/^[0-9\-_.\s]+$/.test(clean)) return true;
  return false;
}

function extractKeywords(input: string): string[] {
  return input
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 3)
    .filter((token) => !STOP_WORDS.has(token));
}

function buildDescription(doc: TemplateDoc): string {
  const title = cleanText(doc.title || "Professional template");
  const category = doc.category?.title
    ? ` for ${doc.category.title.toLowerCase()}`
    : "";
  const format = doc.fileType ? ` in ${doc.fileType} format` : "";
  const size = doc.size ? ` (${doc.size})` : "";
  return `${title}${category}${format}${size}. Print-ready design template optimized for fast customization and production use.`;
}

function buildSeoTitle(doc: TemplateDoc): string {
  const base = titleCase(cleanText(doc.title || "Template"));
  const category = doc.category?.title ? ` | ${doc.category.title}` : "";
  return `${base} Template${category}`.slice(0, 65);
}

function buildSeoDescription(doc: TemplateDoc): string {
  const description = buildDescription(doc);
  return description.length > 155
    ? `${description.slice(0, 152)}...`
    : description;
}

function buildImprovedTitle(doc: TemplateDoc): string {
  const raw = cleanText(doc.title || "");
  const fallback = doc.category?.title
    ? `${doc.category.title} Template`
    : "Professional Print Template";
  const base = raw && !isClearlyWeakTitle(raw) ? raw : fallback;
  return titleCase(base).slice(0, 80);
}

function buildSearchTags(doc: TemplateDoc): string[] {
  const seed = [
    ...(doc.tags || []),
    doc.title || "",
    doc.description || "",
    doc.category?.title || "",
    doc.category?.slug?.current || "",
    doc.fileType || "",
    doc.size || "",
    "4over",
    "template",
  ];

  const keywords = new Set<string>();

  for (const item of seed) {
    for (const token of extractKeywords(item)) {
      keywords.add(token);
    }
  }

  return Array.from(keywords).slice(0, 14);
}

async function run() {
  loadEnv();

  const commitMode = process.argv.includes("--commit");
  const dryRun = !commitMode;
  const useCliUserToken =
    process.argv.includes("--use-cli-user-token") ||
    process.env.SANITY_USE_CLI_USER_TOKEN === "true";
  const sourceProviderArg = process.argv.find((arg) =>
    arg.startsWith("--source-provider="),
  );
  const batchArg = process.argv.find((arg) => arg.startsWith("--batch-id="));
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const improveWeakTitles = process.argv.includes("--improve-weak-titles");

  const sourceProvider =
    sourceProviderArg?.split("=")[1]?.trim().toLowerCase() || "4over";
  const batchId = batchArg?.split("=")[1]?.trim();
  const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "as5tildt";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
  const writeToken = process.env.SANITY_API_WRITE_TOKEN;
  const fallbackToken = process.env.SANITY_API_TOKEN;
  const envToken = writeToken || fallbackToken;
  const token = useCliUserToken ? undefined : envToken;
  const tokenSource = useCliUserToken
    ? "CLI_USER_TOKEN"
    : writeToken
      ? "SANITY_API_WRITE_TOKEN"
      : fallbackToken
        ? "SANITY_API_TOKEN"
        : "none";

  if (commitMode && !token) {
    if (!useCliUserToken) {
      throw new Error(
        "Commit mode requested but no write token found. Set SANITY_API_WRITE_TOKEN (preferred) or SANITY_API_TOKEN.",
      );
    }
  }

  const tokenClient = useCliUserToken
    ? getCliClient({ apiVersion })
    : createClient({
        projectId,
        dataset,
        apiVersion,
        token: token || undefined,
        useCdn: false,
      });

  let activeClient = tokenClient;
  let authMode: AuthMode = useCliUserToken ? "token" : "session";

  const canRead = async (targetClient: ReturnType<typeof createClient>) => {
    await targetClient.fetch(`count(*[_type == "template"])`);
  };

  if (token) {
    try {
      await canRead(tokenClient);
      authMode = "token";
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (commitMode) {
        throw new Error(
          `Commit mode requires valid token auth. ${tokenSource} failed: ${message}`,
        );
      }
    }
  }

  if (dryRun && authMode !== "token") {
    const sessionClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
    });
    await canRead(sessionClient);
    activeClient = sessionClient;
    authMode = "session";
  }

  const filters = [
    '_type == "template"',
    "importedByScript == true",
    "(importSource == $sourceProvider || lower(sourceProvider) == $sourceProvider)",
  ];

  if (batchId) {
    filters.push("importBatchId == $batchId");
  }

  const docs = await activeClient.fetch<TemplateDoc[]>(
    `*[${filters.join(" && ")}] | order(_createdAt desc) {
      _id,
      title,
      description,
      seoTitle,
      seoDescription,
      tags,
      fileType,
      size,
      category->{ title, slug },
      sourceProvider,
      importSource,
      importedByScript,
      importBatchId
    }`,
    { sourceProvider, batchId },
  );

  const scopedDocs =
    typeof limit === "number" && Number.isFinite(limit)
      ? docs.slice(0, Math.max(0, limit))
      : docs;

  const updates: Array<{ id: string; set: Record<string, unknown> }> = [];
  let descriptionImproved = 0;
  let seoTitleCreated = 0;
  let seoDescriptionCreated = 0;
  let tagsFixes = 0;
  let titleImproved = 0;
  let skipped = 0;

  for (const doc of scopedDocs) {
    const set: Record<string, unknown> = {};

    if (isWeakDescription(doc.description)) {
      set.description = buildDescription(doc);
      descriptionImproved += 1;
    }

    if (!doc.seoTitle || !doc.seoTitle.trim()) {
      set.seoTitle = buildSeoTitle(doc);
      seoTitleCreated += 1;
    }

    if (!doc.seoDescription || !doc.seoDescription.trim()) {
      set.seoDescription = buildSeoDescription(doc);
      seoDescriptionCreated += 1;
    }

    const generatedTags = buildSearchTags(doc);
    if (!doc.tags || doc.tags.length === 0) {
      set.tags = generatedTags;
      tagsFixes += 1;
    }

    if (improveWeakTitles && isClearlyWeakTitle(doc.title)) {
      const improvedTitle = buildImprovedTitle(doc);
      if (improvedTitle && improvedTitle !== doc.title) {
        set.title = improvedTitle;
        titleImproved += 1;
      }
    }

    if (Object.keys(set).length > 0) {
      updates.push({ id: doc._id, set });
    } else {
      skipped += 1;
    }
  }

  console.log(`Mode: ${dryRun ? "DRY_RUN" : "COMMIT"}`);
  console.log(`AUTH MODE: ${authMode}`);
  console.log(`Token source: ${tokenSource}`);
  console.log(`Using CLI user token: ${useCliUserToken ? "yes" : "no"}`);
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}`);
  console.log(`Source provider: ${sourceProvider}`);
  console.log(`Batch filter: ${batchId || "(none)"}`);
  console.log(`Improve weak titles: ${improveWeakTitles ? "yes" : "no"}`);
  console.log(`Templates in scope: ${scopedDocs.length}`);
  console.log(`Templates needing SEO/search enrichment: ${updates.length}`);
  console.log(`Templates skipped (already strong): ${skipped}`);
  console.log(`Descriptions improved: ${descriptionImproved}`);
  console.log(`seoTitle created: ${seoTitleCreated}`);
  console.log(`seoDescription created: ${seoDescriptionCreated}`);
  console.log(`Tag fixes: ${tagsFixes}`);
  console.log(`Weak titles improved: ${titleImproved}`);

  const preview = updates.slice(0, 20).map((item) => ({
    id: item.id,
    patch: item.set,
  }));

  if (preview.length > 0) {
    console.log("\nPatch preview (max 20):");
    console.log(JSON.stringify(preview, null, 2));
  }

  if (dryRun) {
    console.log("\nDRY_RUN complete. No documents were modified.");
    return;
  }

  let updated = 0;

  for (let i = 0; i < updates.length; i += UPDATE_BATCH_SIZE) {
    const batch = updates.slice(i, i + UPDATE_BATCH_SIZE);
    const tx = tokenClient.transaction();

    for (const item of batch) {
      tx.patch(item.id, { set: item.set });
    }

    await tx.commit({ autoGenerateArrayKeys: true });
    updated += batch.length;
    console.log(
      `Committed SEO/search enrichment batch ${Math.floor(i / UPDATE_BATCH_SIZE) + 1}: ${batch.length}`,
    );
  }

  console.log(
    `\nSEO/search enrichment complete. Updated ${updated} templates.`,
  );
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`SEO/search enrichment failed: ${message}`);
  process.exit(1);
});
