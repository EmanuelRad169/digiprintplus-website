import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import path from "path";

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
  externalDownloadUrl?: string;
  category?: {
    _id?: string;
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

function normalizeText(value?: string): string {
  return (value || "").trim().toLowerCase();
}

function normalizeUrl(value?: string): string {
  if (!value) return "";
  try {
    const url = new URL(value.trim());
    return `${url.origin}${url.pathname}`.toLowerCase();
  } catch {
    return value.trim().toLowerCase();
  }
}

function extractKeywords(input: string): string[] {
  return input
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 3)
    .filter((token) => !STOP_WORDS.has(token));
}

function isWeakTitle(title?: string): boolean {
  if (!title) return true;
  const clean = title.trim();
  if (clean.length < 8) return true;
  if (/^(untitled|template|new template)$/i.test(clean)) return true;
  if (/^[0-9\-_.\s]+$/.test(clean)) return true;
  return false;
}

function isWeakDescription(description?: string): boolean {
  if (!description) return true;
  const clean = description.trim();
  if (clean.length < 60) return true;
  if (/^imported from 4over/i.test(clean)) return true;
  return false;
}

async function run() {
  loadEnv();

  const sourceProviderArg = process.argv.find((arg) =>
    arg.startsWith("--source-provider="),
  );
  const batchArg = process.argv.find((arg) => arg.startsWith("--batch-id="));
  const onlyImported =
    process.argv.includes("--only-imported") ||
    !process.argv.includes("--include-all");

  const sourceProvider =
    sourceProviderArg?.split("=")[1]?.trim().toLowerCase() || "4over";
  const batchId = batchArg?.split("=")[1]?.trim();

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "as5tildt";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
  const token =
    process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
  const tokenSource = process.env.SANITY_API_WRITE_TOKEN
    ? "SANITY_API_WRITE_TOKEN"
    : process.env.SANITY_API_TOKEN
      ? "SANITY_API_TOKEN"
      : "none";

  const tokenClient = createClient({
    projectId,
    dataset,
    apiVersion,
    token: token || undefined,
    useCdn: false,
  });

  let activeClient = tokenClient;
  let authMode: AuthMode = "session";

  const canRead = async (targetClient: ReturnType<typeof createClient>) => {
    await targetClient.fetch(`count(*[_type == "template"])`);
  };

  if (token) {
    try {
      await canRead(tokenClient);
      authMode = "token";
    } catch {
      // Fall back to session mode.
    }
  }

  if (!token || authMode !== "token") {
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

  const filters = ['_type == "template"'];
  if (onlyImported) {
    filters.push("importedByScript == true");
    filters.push(
      "(importSource == $sourceProvider || lower(sourceProvider) == $sourceProvider)",
    );
  }
  if (batchId) {
    filters.push("importBatchId == $batchId");
  }

  const templates = await activeClient.fetch<TemplateDoc[]>(
    `*[${filters.join(" && ")}] {
      _id,
      title,
      description,
      seoTitle,
      seoDescription,
      tags,
      fileType,
      size,
      externalDownloadUrl,
      category->{ _id, title, slug },
      sourceProvider,
      importSource,
      importedByScript,
      importBatchId
    }`,
    { sourceProvider, batchId },
  );

  const missingSeoTitle = templates.filter((doc) => !doc.seoTitle?.trim());
  const missingSeoDescription = templates.filter(
    (doc) => !doc.seoDescription?.trim(),
  );
  const weakTitles = templates.filter((doc) => isWeakTitle(doc.title));
  const weakDescriptions = templates.filter((doc) =>
    isWeakDescription(doc.description),
  );
  const missingTags = templates.filter(
    (doc) => !doc.tags || doc.tags.length === 0,
  );

  const poorKeywords = templates.filter((doc) => {
    const fromTags = (doc.tags || []).flatMap((tag) => extractKeywords(tag));
    const fromTitle = extractKeywords(doc.title || "");
    const fromDescription = extractKeywords(doc.description || "");
    const unique = new Set([...fromTags, ...fromTitle, ...fromDescription]);
    return unique.size < 5;
  });

  const titleMap = new Map<string, TemplateDoc[]>();
  const urlMap = new Map<string, TemplateDoc[]>();

  for (const doc of templates) {
    const titleKey = normalizeText(doc.title);
    if (titleKey) {
      const arr = titleMap.get(titleKey) || [];
      arr.push(doc);
      titleMap.set(titleKey, arr);
    }

    const urlKey = normalizeUrl(doc.externalDownloadUrl);
    if (urlKey) {
      const arr = urlMap.get(urlKey) || [];
      arr.push(doc);
      urlMap.set(urlKey, arr);
    }
  }

  const duplicateTitles = Array.from(titleMap.entries()).filter(
    ([, docs]) => docs.length > 1,
  );
  const duplicateUrls = Array.from(urlMap.entries()).filter(
    ([, docs]) => docs.length > 1,
  );

  const categoryCoverage = new Map<
    string,
    { total: number; weakDesc: number; noTags: number; weakKeywords: number }
  >();

  for (const doc of templates) {
    const key = doc.category?.title || "Uncategorized";
    const current = categoryCoverage.get(key) || {
      total: 0,
      weakDesc: 0,
      noTags: 0,
      weakKeywords: 0,
    };
    current.total += 1;
    if (isWeakDescription(doc.description)) current.weakDesc += 1;
    if (!doc.tags || doc.tags.length === 0) current.noTags += 1;

    const kw = new Set([
      ...(doc.tags || []).flatMap((tag) => extractKeywords(tag)),
      ...extractKeywords(doc.title || ""),
      ...extractKeywords(doc.description || ""),
    ]);
    if (kw.size < 5) current.weakKeywords += 1;
    categoryCoverage.set(key, current);
  }

  const weakCategoryCoverage = Array.from(categoryCoverage.entries())
    .map(([category, stats]) => ({
      category,
      total: stats.total,
      weakDescriptionRate: stats.total ? stats.weakDesc / stats.total : 0,
      missingTagsRate: stats.total ? stats.noTags / stats.total : 0,
      weakKeywordsRate: stats.total ? stats.weakKeywords / stats.total : 0,
    }))
    .filter(
      (entry) =>
        entry.weakDescriptionRate > 0.3 ||
        entry.missingTagsRate > 0.3 ||
        entry.weakKeywordsRate > 0.3,
    )
    .sort((a, b) => b.weakKeywordsRate - a.weakKeywordsRate);

  console.log("Template SEO/search audit report");
  console.log(`AUTH MODE: ${authMode}`);
  console.log(`Token source: ${tokenSource}`);
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}`);
  console.log(`Source provider: ${sourceProvider}`);
  console.log(`Batch filter: ${batchId || "(none)"}`);
  console.log(`Only imported: ${onlyImported ? "yes" : "no"}`);
  console.log(`Templates scanned: ${templates.length}`);
  console.log(`Missing seoTitle: ${missingSeoTitle.length}`);
  console.log(`Missing seoDescription: ${missingSeoDescription.length}`);
  console.log(`Weak titles: ${weakTitles.length}`);
  console.log(`Weak descriptions: ${weakDescriptions.length}`);
  console.log(`Missing tags: ${missingTags.length}`);
  console.log(`Poor keyword coverage: ${poorKeywords.length}`);
  console.log(`Duplicate-looking titles: ${duplicateTitles.length}`);
  console.log(`Duplicate-looking external URLs: ${duplicateUrls.length}`);
  console.log(`Weak category coverage buckets: ${weakCategoryCoverage.length}`);

  if (weakCategoryCoverage.length > 0) {
    console.log("\nCategories with weak search coverage:");
    console.log(JSON.stringify(weakCategoryCoverage.slice(0, 20), null, 2));
  }

  const problematic = templates
    .filter(
      (doc) =>
        isWeakTitle(doc.title) ||
        isWeakDescription(doc.description) ||
        !doc.tags ||
        doc.tags.length === 0 ||
        !doc.seoTitle ||
        !doc.seoDescription,
    )
    .slice(0, 20)
    .map((doc) => ({
      id: doc._id,
      title: doc.title,
      category: doc.category?.title,
      hasSeoTitle: Boolean(doc.seoTitle),
      hasSeoDescription: Boolean(doc.seoDescription),
      tags: doc.tags?.length || 0,
      weakTitle: isWeakTitle(doc.title),
      weakDescription: isWeakDescription(doc.description),
    }));

  if (problematic.length > 0) {
    console.log("\nTemplates likely hurting search/discoverability (max 20):");
    console.log(JSON.stringify(problematic, null, 2));
  }
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`SEO/search audit failed: ${message}`);
  process.exit(1);
});
