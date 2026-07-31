import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import path from "path";
import { getCliClient } from "sanity/cli";

const UPDATE_BATCH_SIZE = 50;

type AuthMode = "token" | "session";

type TemplateDoc = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  category?: { title?: string; slug?: { current?: string } };
  tags?: string[];
  size?: string;
  fileType?: string;
  isPremium?: boolean;
  rating?: number;
  downloadCount?: number;
  seoTitle?: string;
  sourceProvider?: string;
  importSource?: string;
  importedByScript?: boolean;
  importBatchId?: string;
  publishedAt?: string;
};

function loadEnv() {
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
  dotenv.config({ path: path.resolve(process.cwd(), "../web/.env.local") });
}

function normalizeText(value?: string): string {
  return (value || "").replace(/\s+/g, " ").trim();
}

function toTitleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function isWeakMerchTitle(title?: string, categoryTitle?: string): boolean {
  const clean = normalizeText(title).toLowerCase();
  if (!clean) return true;
  if (["template", "untitled"].includes(clean)) return true;
  if (["postcards template", "all templates template"].includes(clean))
    return true;

  const category = normalizeText(categoryTitle).toLowerCase();
  if (category && clean === `${category} template`) return true;

  return false;
}

function titleFromSeoTitle(doc: TemplateDoc): string | null {
  const seo = normalizeText(doc.seoTitle);
  if (!seo) return null;
  const base = seo.split("|")[0]?.trim();
  if (!base) return null;
  return base.length <= 80 ? base : base.slice(0, 80).trim();
}

function titleFromSlug(doc: TemplateDoc): string | null {
  const slug = doc.slug?.current;
  if (!slug) return null;

  let value = slug;
  const categorySlug = doc.category?.slug?.current;
  if (categorySlug && value.startsWith(`${categorySlug}-`)) {
    value = value.slice(categorySlug.length + 1);
  }

  value = value
    .replace(/\b-v\b/g, " vertical")
    .replace(/\b-h\b/g, " horizontal")
    .replace(/\b-v2\b/g, " v2")
    .replace(/\bsmart\b/g, "smart")
    .replace(/-/g, " ");

  const cleaned = toTitleCase(normalizeText(value));
  if (!cleaned) return null;

  const withTemplate = cleaned.toLowerCase().includes("template")
    ? cleaned
    : `${cleaned} Template`;

  return withTemplate.length <= 80
    ? withTemplate
    : withTemplate.slice(0, 80).trim();
}

function buildBetterTitle(doc: TemplateDoc): string | null {
  return titleFromSeoTitle(doc) || titleFromSlug(doc);
}

function unique(values: string[]): string[] {
  return Array.from(
    new Set(values.map((v) => normalizeText(v)).filter(Boolean)),
  );
}

function parseKeywordsFromSlug(slug?: string): string[] {
  if (!slug) return [];
  return slug
    .split("-")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
    .filter((part) => !["template", "all", "templates"].includes(part));
}

function buildTagSuggestions(doc: TemplateDoc): string[] {
  const categorySlug = doc.category?.slug?.current || "";
  const categoryTitle = doc.category?.title || "";
  const fileType = (doc.fileType || "").toLowerCase();

  const suggestions = [
    ...(doc.tags || []),
    categorySlug,
    categoryTitle,
    fileType,
    ...(doc.size ? [doc.size] : []),
    ...parseKeywordsFromSlug(doc.slug?.current),
  ];

  return unique(suggestions)
    .filter((tag) => tag.length >= 2)
    .slice(0, 12);
}

function shouldEnrichTags(doc: TemplateDoc, weakTitle: boolean): boolean {
  const tags = (doc.tags || []).map((tag) => normalizeText(tag).toLowerCase());
  if (tags.length < 3) return true;
  if (weakTitle) return true;
  if (tags.includes("marketing-products")) return true;
  return false;
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
  const normalizeTitles = process.argv.includes("--normalize-weak-titles");
  const enrichTags = process.argv.includes("--enrich-tags");

  const sourceProvider =
    sourceProviderArg?.split("=")[1]?.trim().toLowerCase() || "4over";
  const batchId = batchArg?.split("=")[1]?.trim();
  const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;

  if (!batchId) {
    throw new Error(
      "Missing --batch-id. Merchandising enrichment requires explicit batch targeting.",
    );
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "as5tildt";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

  const writeToken = process.env.SANITY_API_WRITE_TOKEN;
  const fallbackToken = process.env.SANITY_API_TOKEN;
  const envToken = writeToken || fallbackToken;
  const tokenSource = useCliUserToken
    ? "CLI_USER_TOKEN"
    : writeToken
      ? "SANITY_API_WRITE_TOKEN"
      : fallbackToken
        ? "SANITY_API_TOKEN"
        : "none";

  if (commitMode && !useCliUserToken && !envToken) {
    throw new Error(
      "Commit mode requires SANITY_API_WRITE_TOKEN (preferred) or SANITY_API_TOKEN, or run with --use-cli-user-token via sanity exec --with-user-token.",
    );
  }

  const tokenClient = useCliUserToken
    ? getCliClient({ apiVersion })
    : createClient({
        projectId,
        dataset,
        apiVersion,
        token: envToken || undefined,
        useCdn: false,
      });

  let activeClient = tokenClient;
  let authMode: AuthMode = useCliUserToken ? "token" : "session";

  const canRead = async (targetClient: ReturnType<typeof createClient>) => {
    await targetClient.fetch(`count(*[_type == "template"])`);
  };

  if (!useCliUserToken && envToken) {
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

  if (commitMode && authMode !== "token") {
    throw new Error("Commit mode requires token-authenticated client.");
  }

  const docs = await activeClient.fetch<TemplateDoc[]>(
    `*[_type == "template" && importedByScript == true && (importSource == $sourceProvider || lower(sourceProvider) == $sourceProvider) && importBatchId == $batchId] | order(publishedAt desc, _createdAt desc) {
      _id,
      title,
      slug,
      category->{ title, slug },
      tags,
      size,
      fileType,
      isPremium,
      rating,
      downloadCount,
      seoTitle,
      sourceProvider,
      importSource,
      importedByScript,
      importBatchId,
      publishedAt
    }`,
    { sourceProvider, batchId },
  );

  const scopedDocs =
    typeof limit === "number" && Number.isFinite(limit)
      ? docs.slice(0, Math.max(0, limit))
      : docs;

  const updates: Array<{
    id: string;
    set: Record<string, unknown>;
    reason: string[];
  }> = [];
  let titleImproved = 0;
  let tagsImproved = 0;
  let skipped = 0;

  for (const doc of scopedDocs) {
    const set: Record<string, unknown> = {};
    const reasons: string[] = [];
    const weakTitle = isWeakMerchTitle(doc.title, doc.category?.title);

    if (normalizeTitles && weakTitle) {
      const better = buildBetterTitle(doc);
      if (better && better !== doc.title) {
        set.title = better;
        titleImproved += 1;
        reasons.push("weak-title-normalized");
      }
    }

    if (enrichTags && shouldEnrichTags(doc, weakTitle)) {
      const existing = doc.tags || [];
      const suggested = buildTagSuggestions(doc);
      const existingSet = new Set(
        existing.map((x) => normalizeText(x).toLowerCase()),
      );
      const merged = [...existing];

      for (const tag of suggested) {
        const key = normalizeText(tag).toLowerCase();
        if (!key || existingSet.has(key)) continue;
        merged.push(tag);
        existingSet.add(key);
      }

      if (merged.length > existing.length) {
        set.tags = merged.slice(0, 12);
        tagsImproved += 1;
        reasons.push("tags-augmented");
      }
    }

    if (Object.keys(set).length > 0) {
      updates.push({ id: doc._id, set, reason: reasons });
    } else {
      skipped += 1;
    }
  }

  console.log(`Mode: ${dryRun ? "DRY_RUN" : "COMMIT"}`);
  console.log(`AUTH MODE: ${authMode}`);
  console.log(`Token source: ${tokenSource}`);
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}`);
  console.log(`Source provider: ${sourceProvider}`);
  console.log(`Batch filter: ${batchId}`);
  console.log(`Normalize weak titles: ${normalizeTitles ? "yes" : "no"}`);
  console.log(`Enrich tags: ${enrichTags ? "yes" : "no"}`);
  console.log(`Templates in scope: ${scopedDocs.length}`);
  console.log(`Templates needing merchandising enrichment: ${updates.length}`);
  console.log(`Titles improved: ${titleImproved}`);
  console.log(`Tags improved: ${tagsImproved}`);
  console.log(`Skipped: ${skipped}`);

  if (updates.length > 0) {
    console.log("\nPatch preview (max 20):");
    console.log(
      JSON.stringify(
        updates
          .slice(0, 20)
          .map((u) => ({ id: u.id, reason: u.reason, set: u.set })),
        null,
        2,
      ),
    );
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
      `Committed merchandising enrichment batch ${Math.floor(i / UPDATE_BATCH_SIZE) + 1}: ${batch.length}`,
    );
  }

  console.log(
    `\nMerchandising enrichment complete. Updated ${updated} templates.`,
  );
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Merchandising enrichment failed: ${message}`);
  process.exit(1);
});
