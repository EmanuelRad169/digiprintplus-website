import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import path from "path";

const UPDATE_BATCH_SIZE = 50;

type AuthMode = "token" | "session";

type TemplateDoc = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  description?: string;
  category?: { _ref?: string };
  fileType?: string;
  size?: string;
  tags?: string[];
  isPremium?: boolean;
  rating?: number;
  downloadCount?: number;
  sourceProvider?: string;
  importSource?: string;
  importedByScript?: boolean;
  importBatchId?: string;
  externalDownloadUrl?: string;
  externalPreviewImageUrl?: string;
  previewImage?: unknown;
  downloadFile?: unknown;
};

type CategoryDoc = {
  _id: string;
  slug?: { current?: string };
};

function loadEnv() {
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
  dotenv.config({ path: path.resolve(process.cwd(), "../web/.env.local") });
}

function normalizeFileType(value?: string): "EPS" | "JPG" | null {
  const v = (value || "").trim().toUpperCase();
  if (!v) return null;
  if (["EPS", "AI"].includes(v)) return "EPS";
  if (["JPG", "JPEG"].includes(v)) return "JPG";
  return null;
}

function deriveDescription(title?: string, size?: string): string {
  const safeTitle = (title || "Professional template").trim();
  const safeSize = (size || "standard size").trim();
  return `${safeTitle} print-ready template in ${safeSize}. Download and customize for your project.`;
}

async function run() {
  loadEnv();

  const commitMode = process.argv.includes("--commit");
  const dryRun = !commitMode;
  const sourceProviderArg = process.argv.find((arg) =>
    arg.startsWith("--source-provider="),
  );
  const batchArg = process.argv.find((arg) => arg.startsWith("--batch-id="));
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;

  const sourceProvider =
    sourceProviderArg?.split("=")[1]?.trim().toLowerCase() || "4over";
  const batchId = batchArg?.split("=")[1]?.trim();

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "as5tildt";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
  const writeToken = process.env.SANITY_API_WRITE_TOKEN;
  const fallbackToken = process.env.SANITY_API_TOKEN;
  const token = writeToken || fallbackToken;
  const tokenSource = writeToken
    ? "SANITY_API_WRITE_TOKEN"
    : fallbackToken
      ? "SANITY_API_TOKEN"
      : "none";

  if (commitMode && !token) {
    throw new Error(
      "Commit mode requested but no write token found. Set SANITY_API_WRITE_TOKEN (preferred) or SANITY_API_TOKEN.",
    );
  }

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

  const category = await activeClient.fetch<CategoryDoc | null>(
    `*[_type == "templateCategory" && slug.current == "all-templates"][0]{ _id, slug }`,
  );

  const filters = [
    '_type == "template"',
    "importedByScript == true",
    "(importSource == $sourceProvider || lower(sourceProvider) == $sourceProvider)",
  ];

  if (batchId) {
    filters.push("importBatchId == $batchId");
  }

  const query = `*[${filters.join(" && ")}] | order(_createdAt desc) {
    _id,
    title,
    slug,
    description,
    category,
    fileType,
    size,
    tags,
    isPremium,
    rating,
    downloadCount,
    sourceProvider,
    importSource,
    importedByScript,
    importBatchId,
    externalDownloadUrl,
    externalPreviewImageUrl,
    previewImage,
    downloadFile
  }`;

  const docs = await activeClient.fetch<TemplateDoc[]>(query, {
    sourceProvider,
    batchId,
  });

  const scopedDocs =
    typeof limit === "number" && Number.isFinite(limit)
      ? docs.slice(0, Math.max(0, limit))
      : docs;

  const updates: Array<{ id: string; set: Record<string, unknown> }> = [];
  let touchedDescription = 0;
  let touchedFileType = 0;
  let touchedSize = 0;
  let touchedCategory = 0;
  let touchedTags = 0;
  let touchedPremium = 0;
  let touchedRating = 0;
  let touchedDownloadCount = 0;

  for (const doc of scopedDocs) {
    const set: Record<string, unknown> = {};

    if (!doc.description || !doc.description.trim()) {
      set.description = deriveDescription(doc.title, doc.size);
      touchedDescription += 1;
    }

    if (!doc.fileType || !doc.fileType.trim()) {
      const inferred = normalizeFileType(
        doc.externalDownloadUrl?.split(".").pop(),
      );
      set.fileType = inferred || "EPS";
      touchedFileType += 1;
    } else {
      const normalized = normalizeFileType(doc.fileType);
      if (normalized && normalized !== doc.fileType) {
        set.fileType = normalized;
        touchedFileType += 1;
      }
    }

    if (!doc.size || !doc.size.trim()) {
      set.size = "Standard";
      touchedSize += 1;
    }

    if (!doc.category?._ref && category?._id) {
      set.category = { _type: "reference", _ref: category._id };
      touchedCategory += 1;
    }

    if (!doc.tags || doc.tags.length === 0) {
      set.tags = ["4over", "template"];
      touchedTags += 1;
    }

    if (typeof doc.isPremium !== "boolean") {
      set.isPremium = false;
      touchedPremium += 1;
    }

    if (typeof doc.rating !== "number") {
      set.rating = 5;
      touchedRating += 1;
    }

    if (typeof doc.downloadCount !== "number") {
      set.downloadCount = 0;
      touchedDownloadCount += 1;
    }

    if (Object.keys(set).length > 0) {
      updates.push({ id: doc._id, set });
    }
  }

  console.log(`Mode: ${dryRun ? "DRY_RUN" : "COMMIT"}`);
  console.log(`AUTH MODE: ${authMode}`);
  console.log(`Token source: ${tokenSource}`);
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}`);
  console.log(`Source provider: ${sourceProvider}`);
  console.log(`Batch filter: ${batchId || "(none)"}`);
  console.log(`Templates in scope: ${scopedDocs.length}`);
  console.log(`Templates needing enrichment: ${updates.length}`);
  console.log(`Description fixes: ${touchedDescription}`);
  console.log(`File type fixes: ${touchedFileType}`);
  console.log(`Size fixes: ${touchedSize}`);
  console.log(`Category fixes: ${touchedCategory}`);
  console.log(`Tag fixes: ${touchedTags}`);
  console.log(`isPremium fixes: ${touchedPremium}`);
  console.log(`Rating fixes: ${touchedRating}`);
  console.log(`downloadCount fixes: ${touchedDownloadCount}`);

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
      tx.patch(item.id, {
        set: item.set,
      });
    }

    await tx.commit({ autoGenerateArrayKeys: true });
    updated += batch.length;
    console.log(
      `Committed enrichment batch ${Math.floor(i / UPDATE_BATCH_SIZE) + 1}: ${batch.length}`,
    );
  }

  console.log(`\nEnrichment complete. Updated ${updated} templates.`);
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Enrichment failed: ${message}`);
  process.exit(1);
});
