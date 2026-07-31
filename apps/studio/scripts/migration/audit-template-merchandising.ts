import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import path from "path";

type AuthMode = "token" | "session";

type TemplateDoc = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  description?: string;
  category?: { title?: string; slug?: { current?: string } };
  tags?: string[];
  fileType?: string;
  size?: string;
  isPremium?: boolean;
  rating?: number;
  downloadCount?: number;
  previewImage?: { asset?: { _id?: string; url?: string } };
  externalPreviewImageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  sourceProvider?: string;
  importSource?: string;
  importedByScript?: boolean;
  importBatchId?: string;
  publishedAt?: string;
};

type SimilarPair = {
  leftId: string;
  rightId: string;
  leftSlug: string;
  rightSlug: string;
  score: number;
  leftTitle: string;
  rightTitle: string;
};

function loadEnv() {
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
  dotenv.config({ path: path.resolve(process.cwd(), "../web/.env.local") });
}

function normalizeText(input?: string): string {
  return (input || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTitleKey(input?: string): string {
  return normalizeText(input)
    .replace(/\btemplate\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(input?: string): string[] {
  return normalizeText(input)
    .split(" ")
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => t.length >= 2)
    .filter((t) => !["template", "all"].includes(t));
}

function jaccard(left: string[], right: string[]): number {
  const a = new Set(left);
  const b = new Set(right);
  if (a.size === 0 && b.size === 0) return 1;

  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection += 1;
  }

  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}

function hasWeakMerchTitle(doc: TemplateDoc): boolean {
  const title = (doc.title || "").trim();
  if (!title) return true;
  if (/^(untitled|template)$/i.test(title)) return true;
  if (/^(postcards|all templates)\s+template$/i.test(title)) return true;

  const categoryTitle = (doc.category?.title || "").trim();
  if (
    categoryTitle &&
    new RegExp(`^${categoryTitle}\\s+template$`, "i").test(title)
  ) {
    return true;
  }

  return false;
}

function buildPreviewPattern(doc: TemplateDoc): string {
  const source =
    doc.previewImage?.asset?.url ||
    doc.externalPreviewImageUrl ||
    doc.slug?.current ||
    doc.title ||
    "unknown";

  const base = source.split("/").pop() || source;
  return (
    base
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[0-9.]+x[0-9.]+/gi, "")
      .replace(
        /\b(v|h|smart|v2|drillhole|roundcorner|postcards|templates|all)\b/gi,
        "",
      )
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim() || "generic"
  );
}

function safeSlug(doc: TemplateDoc): string {
  return doc.slug?.current || "(no-slug)";
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
      // Fall back to session mode for read-only audit.
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

  const docs = await activeClient.fetch<TemplateDoc[]>(
    `*[${filters.join(" && ")}] | order(publishedAt desc, _createdAt desc) {
      _id,
      title,
      slug,
      description,
      category->{ title, slug },
      tags,
      fileType,
      size,
      isPremium,
      rating,
      downloadCount,
      previewImage { asset->{ _id, url } },
      externalPreviewImageUrl,
      seoTitle,
      seoDescription,
      sourceProvider,
      importSource,
      importedByScript,
      importBatchId,
      publishedAt
    }`,
    { sourceProvider, batchId },
  );

  const duplicateMap = new Map<string, TemplateDoc[]>();
  for (const doc of docs) {
    const key = normalizeTitleKey(doc.title);
    if (!key) continue;
    const existing = duplicateMap.get(key) || [];
    existing.push(doc);
    duplicateMap.set(key, existing);
  }

  const duplicateTitleGroups = Array.from(duplicateMap.entries())
    .filter(([, list]) => list.length > 1)
    .map(([key, list]) => ({
      key,
      count: list.length,
      docs: list.map((doc) => ({
        id: doc._id,
        title: doc.title,
        slug: safeSlug(doc),
        category: doc.category?.title,
        size: doc.size,
        fileType: doc.fileType,
      })),
    }));

  const likelyTrueDuplicates = duplicateTitleGroups
    .flatMap((group) => {
      const rows: Array<Record<string, unknown>> = [];
      for (let i = 0; i < group.docs.length; i += 1) {
        for (let j = i + 1; j < group.docs.length; j += 1) {
          const left = group.docs[i];
          const right = group.docs[j];
          const sameSize = left.size && right.size && left.size === right.size;
          const sameType =
            left.fileType && right.fileType && left.fileType === right.fileType;
          const sameCategory =
            left.category && right.category && left.category === right.category;

          if (sameSize && sameType && sameCategory) {
            rows.push({
              left,
              right,
              reason: "same-title+size+fileType+category",
            });
          }
        }
      }
      return rows;
    })
    .slice(0, 20);

  const previewPatternMap = new Map<string, TemplateDoc[]>();
  for (const doc of docs) {
    const pattern = buildPreviewPattern(doc);
    const existing = previewPatternMap.get(pattern) || [];
    existing.push(doc);
    previewPatternMap.set(pattern, existing);
  }

  const repeatedPreviewPatterns = Array.from(previewPatternMap.entries())
    .filter(([pattern, list]) => pattern !== "generic" && list.length >= 4)
    .map(([pattern, list]) => ({
      pattern,
      count: list.length,
      examples: list.slice(0, 6).map((d) => ({
        id: d._id,
        title: d.title,
        slug: safeSlug(d),
      })),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const categoryStats = new Map<
    string,
    { count: number; weakTitles: number }
  >();
  for (const doc of docs) {
    const key = doc.category?.title || "Uncategorized";
    const current = categoryStats.get(key) || { count: 0, weakTitles: 0 };
    current.count += 1;
    if (hasWeakMerchTitle(doc)) current.weakTitles += 1;
    categoryStats.set(key, current);
  }

  const total = docs.length || 1;
  const categoryBalance = Array.from(categoryStats.entries()).map(
    ([category, stats]) => ({
      category,
      count: stats.count,
      share: Number((stats.count / total).toFixed(3)),
      weakTitleRate: Number((stats.weakTitles / stats.count).toFixed(3)),
      flag:
        stats.count / total > 0.65
          ? "overweighted"
          : stats.count / total < 0.1
            ? "underrepresented"
            : "balanced",
    }),
  );

  const similarPairs: SimilarPair[] = [];
  for (let i = 0; i < docs.length - 1; i += 1) {
    const left = docs[i];
    const right = docs[i + 1];

    const leftTokens = [
      ...tokenize(left.title),
      ...tokenize(left.size),
      ...tokenize((left.tags || []).join(" ")),
    ];
    const rightTokens = [
      ...tokenize(right.title),
      ...tokenize(right.size),
      ...tokenize((right.tags || []).join(" ")),
    ];

    const score = jaccard(leftTokens, rightTokens);
    if (score >= 0.72) {
      similarPairs.push({
        leftId: left._id,
        rightId: right._id,
        leftSlug: safeSlug(left),
        rightSlug: safeSlug(right),
        score: Number(score.toFixed(3)),
        leftTitle: left.title || "",
        rightTitle: right.title || "",
      });
    }
  }

  const weakMerchTemplates = docs
    .filter((doc) => {
      const weakTitle = hasWeakMerchTitle(doc);
      const lowTagDepth = !doc.tags || doc.tags.length < 3;
      const neutralTrustSignals =
        (doc.downloadCount || 0) === 0 && (doc.rating || 0) === 5;
      const externalOnlyPreview =
        !doc.previewImage?.asset?.url && Boolean(doc.externalPreviewImageUrl);
      return (
        weakTitle || lowTagDepth || externalOnlyPreview || neutralTrustSignals
      );
    })
    .slice(0, 30)
    .map((doc) => ({
      id: doc._id,
      title: doc.title,
      slug: safeSlug(doc),
      category: doc.category?.title,
      tags: doc.tags?.length || 0,
      externalOnlyPreview:
        !doc.previewImage?.asset?.url && Boolean(doc.externalPreviewImageUrl),
      neutralTrustSignals:
        (doc.downloadCount || 0) === 0 && (doc.rating || 0) === 5,
      weakTitle: hasWeakMerchTitle(doc),
    }));

  console.log("Template merchandising audit report");
  console.log(`AUTH MODE: ${authMode}`);
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}`);
  console.log(`Source provider: ${sourceProvider}`);
  console.log(`Batch filter: ${batchId || "(none)"}`);
  console.log(`Only imported: ${onlyImported ? "yes" : "no"}`);
  console.log(`Templates scanned: ${docs.length}`);
  console.log(`Duplicate-looking title groups: ${duplicateTitleGroups.length}`);
  console.log(`Likely true duplicate pairs: ${likelyTrueDuplicates.length}`);
  console.log(`Repeated preview patterns: ${repeatedPreviewPatterns.length}`);
  console.log(`Category buckets: ${categoryBalance.length}`);
  console.log(`Highly similar neighboring pairs: ${similarPairs.length}`);
  console.log(`Weak merchandising candidates: ${weakMerchTemplates.length}`);

  if (duplicateTitleGroups.length > 0) {
    console.log("\nDuplicate-looking title groups:");
    console.log(JSON.stringify(duplicateTitleGroups.slice(0, 20), null, 2));
  }

  if (likelyTrueDuplicates.length > 0) {
    console.log("\nLikely true duplicate pairs:");
    console.log(JSON.stringify(likelyTrueDuplicates, null, 2));
  }

  if (repeatedPreviewPatterns.length > 0) {
    console.log("\nRepeated preview patterns:");
    console.log(JSON.stringify(repeatedPreviewPatterns, null, 2));
  }

  console.log("\nCategory balance:");
  console.log(JSON.stringify(categoryBalance, null, 2));

  if (similarPairs.length > 0) {
    console.log("\nHighly similar neighboring entries:");
    console.log(JSON.stringify(similarPairs.slice(0, 30), null, 2));
  }

  if (weakMerchTemplates.length > 0) {
    console.log("\nWeak merchandising candidates (max 30):");
    console.log(JSON.stringify(weakMerchTemplates, null, 2));
  }
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Merchandising audit failed: ${message}`);
  process.exit(1);
});
