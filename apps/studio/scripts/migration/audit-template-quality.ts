import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import path from "path";

type AuthMode = "token" | "session";

type TemplateDoc = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  description?: string;
  category?: { _ref?: string };
  fileType?: string;
  size?: string;
  isPremium?: boolean;
  price?: number;
  rating?: number;
  downloadCount?: number;
  previewImage?: unknown;
  externalPreviewImageUrl?: string;
  downloadFile?: unknown;
  externalDownloadUrl?: string;
  tags?: string[];
  sourceProvider?: string;
  importSource?: string;
  importedByScript?: boolean;
  importBatchId?: string;
  importedAt?: string;
  status?: string;
};

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

function hasPreview(doc: TemplateDoc): boolean {
  return Boolean(doc.previewImage || doc.externalPreviewImageUrl);
}

function hasDownload(doc: TemplateDoc): boolean {
  return Boolean(doc.downloadFile || doc.externalDownloadUrl);
}

async function run() {
  loadEnv();

  const sourceProviderArg = process.argv.find((arg) =>
    arg.startsWith("--source-provider="),
  );
  const batchArg = process.argv.find((arg) => arg.startsWith("--batch-id="));
  const onlyImported = process.argv.includes("--only-imported");

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
      // Fall back to session mode for audits.
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
  }

  filters.push(
    "(importSource == $sourceProvider || lower(sourceProvider) == $sourceProvider || !defined(sourceProvider))",
  );

  if (batchId) {
    filters.push("importBatchId == $batchId");
  }

  const query = `*[${filters.join(" && ")}] {
    _id,
    title,
    slug,
    description,
    category,
    fileType,
    size,
    isPremium,
    price,
    rating,
    downloadCount,
    previewImage,
    externalPreviewImageUrl,
    downloadFile,
    externalDownloadUrl,
    tags,
    sourceProvider,
    importSource,
    importedByScript,
    importBatchId,
    importedAt,
    status
  }`;

  const templates = await activeClient.fetch<TemplateDoc[]>(query, {
    sourceProvider,
    batchId,
  });

  const missingPreview = templates.filter((doc) => !hasPreview(doc));
  const missingCategory = templates.filter((doc) => !doc.category?._ref);
  const missingDownload = templates.filter((doc) => !hasDownload(doc));
  const missingDescription = templates.filter(
    (doc) => !doc.description || !doc.description.trim(),
  );
  const missingFileType = templates.filter(
    (doc) => !doc.fileType || !doc.fileType.trim(),
  );
  const missingSize = templates.filter((doc) => !doc.size || !doc.size.trim());
  const missingSlug = templates.filter((doc) => !doc.slug?.current);

  const duplicateByTitleMap = new Map<string, TemplateDoc[]>();
  const duplicateByUrlMap = new Map<string, TemplateDoc[]>();

  for (const doc of templates) {
    const titleKey = normalizeText(doc.title);
    if (titleKey) {
      const current = duplicateByTitleMap.get(titleKey) || [];
      current.push(doc);
      duplicateByTitleMap.set(titleKey, current);
    }

    const urlKey = normalizeUrl(doc.externalDownloadUrl);
    if (urlKey) {
      const current = duplicateByUrlMap.get(urlKey) || [];
      current.push(doc);
      duplicateByUrlMap.set(urlKey, current);
    }
  }

  const duplicateTitles = Array.from(duplicateByTitleMap.entries())
    .filter(([, docs]) => docs.length > 1)
    .map(([key, docs]) => ({ key, docs }));

  const duplicateUrls = Array.from(duplicateByUrlMap.entries())
    .filter(([, docs]) => docs.length > 1)
    .map(([key, docs]) => ({ key, docs }));

  const poorFrontendFit = templates.filter((doc) => {
    return (
      !doc.title ||
      !doc.slug?.current ||
      !doc.category?._ref ||
      !doc.fileType ||
      !doc.size ||
      !hasPreview(doc) ||
      !hasDownload(doc) ||
      !doc.description
    );
  });

  console.log("Template quality audit");
  console.log(`AUTH MODE: ${authMode}`);
  console.log(`Token source: ${tokenSource}`);
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}`);
  console.log(`Source provider: ${sourceProvider}`);
  console.log(`Batch filter: ${batchId || "(none)"}`);
  console.log(`Only imported: ${onlyImported ? "yes" : "no"}`);
  console.log(`Templates scanned: ${templates.length}`);
  console.log(`Missing preview image: ${missingPreview.length}`);
  console.log(`Missing category: ${missingCategory.length}`);
  console.log(`Missing download target: ${missingDownload.length}`);
  console.log(`Missing description: ${missingDescription.length}`);
  console.log(`Missing fileType: ${missingFileType.length}`);
  console.log(`Missing size: ${missingSize.length}`);
  console.log(`Missing slug: ${missingSlug.length}`);
  console.log(`Duplicate-looking titles: ${duplicateTitles.length}`);
  console.log(`Duplicate-looking external URLs: ${duplicateUrls.length}`);
  console.log(`Likely poor frontend fit: ${poorFrontendFit.length}`);

  const preview = poorFrontendFit.slice(0, 20).map((doc) => ({
    id: doc._id,
    title: doc.title,
    slug: doc.slug?.current,
    hasCategory: Boolean(doc.category?._ref),
    hasPreview: hasPreview(doc),
    hasDownload: hasDownload(doc),
    hasDescription: Boolean(doc.description?.trim()),
    fileType: doc.fileType,
    size: doc.size,
  }));

  if (preview.length > 0) {
    console.log("\nPotentially problematic templates (max 20):");
    console.log(JSON.stringify(preview, null, 2));
  }
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Quality audit failed: ${message}`);
  process.exit(1);
});
