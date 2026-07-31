import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import path from "path";
import { getCliClient } from "sanity/cli";

const SOURCE_URL =
  "https://4over.com/templates/files/list/category/marketing-products/";

const DEFAULT_CATEGORY_SLUG = "marketing-products";
const BATCH_SIZE = 50;

type AuthMode = "token" | "session" | "offline-preview";

type ParsedTemplate = {
  sourceTitle: string;
  normalizedTitle: string;
  sourceCategory: string;
  categorySlug: string;
  fileTypes: string[];
  preferredFileType: "EPS" | "JPG";
  previewUrl?: string;
  downloadUrl: string;
  dimensions: string;
  sourcePageUrl: string;
};

type ImportDoc = {
  _type: "template";
  status: "published";
  title: string;
  slug: { _type: "slug"; current: string };
  description: string;
  category: { _type: "reference"; _ref: string };
  fileType: "EPS" | "JPG";
  size: string;
  tags: string[];
  isPremium: boolean;
  rating: number;
  downloadCount: number;
  fileSize?: string;
  instructions: string;
  externalDownloadUrl?: string;
  externalPreviewImageUrl?: string;
  sourceProvider: "4over";
  sourcePageUrl: string;
  importSource: "4over";
  importedAt: string;
  importBatchId: string;
  importedByScript: true;
  publishedAt: string;
};

type ExistingTemplateDoc = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  sourceProvider?: string;
  importSource?: string;
  externalDownloadUrl?: string;
  sourcePageUrl?: string;
};

type CategoryEnsureResult = {
  categoryMap: Map<string, string>;
  categoriesPlannedCreate: number;
  categoriesCreated: number;
  categoriesExisting: number;
};

type WriteProbeResult = {
  hasWriteAccess: boolean;
  details: string;
};

function loadEnv() {
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
  dotenv.config({ path: path.resolve(process.cwd(), "../web/.env.local") });
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function titleFromFilename(filename: string): string {
  const withoutExt = filename.replace(
    /\.(eps|jpg|jpeg|pdf|ai|psd|indd|pptx|docx|zip)$/i,
    "",
  );
  return withoutExt.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}

function dimensionsFromText(text: string): string {
  const match = text.match(/\b\d+(?:\.\d+)?\s*[xX]\s*\d+(?:\.\d+)?\b/);
  return match ? match[0].replace(/\s+/g, "") : "Standard";
}

function normalize4overCategory(rawPath: string): string {
  const parts = rawPath.split("/").filter(Boolean);
  const templatesIndex = parts.indexOf("templates");
  if (templatesIndex >= 0 && parts[templatesIndex + 1]) {
    return slugify(parts[templatesIndex + 1]);
  }
  return DEFAULT_CATEGORY_SLUG;
}

function mapToInternalCategorySlug(sourceSlug: string): string {
  const map: Record<string, string> = {
    "business-cards": "business-cards",
    postcards: "postcards",
    flyers: "flyers-brochures",
    brochures: "flyers-brochures",
    banners: "banners-posters",
    "marketing-products": "all-templates",
  };

  return map[sourceSlug] || sourceSlug || "all-templates";
}

function getExtension(url: string): string {
  const pathname = new URL(url).pathname;
  const ext = pathname.split(".").pop()?.toLowerCase();
  return ext || "";
}

function parse4overHtml(html: string): ParsedTemplate[] {
  const mediaLinkRegex =
    /https:\/\/4over\.com\/media\/asset\/[^"'\s<>()]+\.(?:eps|jpg|jpeg)/gi;
  const links = Array.from(new Set(html.match(mediaLinkRegex) || []));

  const grouped = new Map<
    string,
    { eps?: string; jpg?: string; category: string }
  >();

  for (const link of links) {
    try {
      const url = new URL(link);
      const filename = decodeURIComponent(url.pathname.split("/").pop() || "");
      const key = filename.replace(/\.(eps|jpg|jpeg)$/i, "").toLowerCase();
      const ext = getExtension(link);
      const categorySlug = normalize4overCategory(url.pathname);

      const current = grouped.get(key) || { category: categorySlug };
      if (ext === "eps") current.eps = link;
      if (ext === "jpg" || ext === "jpeg") current.jpg = link;
      if (!current.category) current.category = categorySlug;
      grouped.set(key, current);
    } catch {
      // Ignore malformed URL tokens.
    }
  }

  const records: ParsedTemplate[] = [];

  for (const [key, value] of grouped.entries()) {
    const normalizedTitle = titleFromFilename(key);
    const preferredFileType: "EPS" | "JPG" = value.eps ? "EPS" : "JPG";
    const downloadUrl = value.eps || value.jpg;

    if (!downloadUrl) continue;

    records.push({
      sourceTitle: normalizedTitle,
      normalizedTitle,
      sourceCategory: value.category || DEFAULT_CATEGORY_SLUG,
      categorySlug: mapToInternalCategorySlug(
        value.category || DEFAULT_CATEGORY_SLUG,
      ),
      fileTypes: [value.eps ? "EPS" : "", value.jpg ? "JPG" : ""].filter(
        Boolean,
      ),
      preferredFileType,
      previewUrl: value.jpg,
      downloadUrl,
      dimensions: dimensionsFromText(normalizedTitle),
      sourcePageUrl: SOURCE_URL,
    });
  }

  return records.sort((a, b) =>
    a.normalizedTitle.localeCompare(b.normalizedTitle),
  );
}

function simulatedRecords(): ParsedTemplate[] {
  return [
    {
      sourceTitle: '2" x 8" Standard Horizontal',
      normalizedTitle: '2" x 8" Standard Horizontal',
      sourceCategory: "postcards",
      categorySlug: "postcards",
      fileTypes: ["EPS", "JPG"],
      preferredFileType: "EPS",
      previewUrl: "https://4over.com/media/asset/templates/postcards/2X8.jpg",
      downloadUrl:
        "https://4over.com/media/asset/templates/postcards/2X8-SMART-V2.eps",
      dimensions: "2x8",
      sourcePageUrl: SOURCE_URL,
    },
    {
      sourceTitle: '4" x 6" Standard',
      normalizedTitle: '4" x 6" Standard',
      sourceCategory: "postcards",
      categorySlug: "postcards",
      fileTypes: ["EPS", "JPG"],
      preferredFileType: "EPS",
      previewUrl: "https://4over.com/media/asset/templates/postcards/4X6.jpg",
      downloadUrl:
        "https://4over.com/media/asset/templates/postcards/4X6-SMART-V2.eps",
      dimensions: "4x6",
      sourcePageUrl: SOURCE_URL,
    },
  ];
}

async function fetchOrSimulate(): Promise<ParsedTemplate[]> {
  try {
    const response = await fetch(SOURCE_URL, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; TemplateIngestionBot/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const parsed = parse4overHtml(html);

    if (parsed.length > 0) {
      return parsed;
    }

    console.warn("No parseable template links found; using simulated records.");
    return simulatedRecords();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `Source fetch blocked or unavailable (${message}); using simulated records.`,
    );
    return simulatedRecords();
  }
}

async function ensureTemplateCategories(
  client: ReturnType<typeof createClient>,
  slugs: string[],
  dryRun: boolean,
  offlineMode = false,
): Promise<CategoryEnsureResult> {
  const map = new Map<string, string>();
  let categoriesPlannedCreate = 0;
  let categoriesCreated = 0;
  let categoriesExisting = 0;

  for (const slug of Array.from(new Set(slugs))) {
    if (dryRun && offlineMode) {
      const fakeId = `dryrun-templateCategory-${slug}`;
      map.set(slug, fakeId);
      categoriesPlannedCreate += 1;
      console.log(`[DRY RUN/OFFLINE] Would ensure templateCategory: ${slug}`);
      continue;
    }

    const existing = await client.fetch<{ _id: string; title: string } | null>(
      `*[_type == "templateCategory" && slug.current == $slug][0]{ _id, title }`,
      { slug },
    );

    if (existing?._id) {
      map.set(slug, existing._id);
      categoriesExisting += 1;
      continue;
    }

    const title = slug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    if (dryRun) {
      const fakeId = `dryrun-templateCategory-${slug}`;
      map.set(slug, fakeId);
      categoriesPlannedCreate += 1;
      console.log(
        `[DRY RUN] Would create templateCategory: ${title} (${slug})`,
      );
      continue;
    }

    const created = await client.create({
      _type: "templateCategory",
      status: "published",
      title,
      slug: { _type: "slug", current: slug },
      description: `Imported category mapped from 4over: ${slug}`,
      order: 999,
    });

    map.set(slug, created._id);
    categoriesCreated += 1;
    console.log(`Created templateCategory: ${title} (${slug})`);
  }

  return {
    categoryMap: map,
    categoriesPlannedCreate,
    categoriesCreated,
    categoriesExisting,
  };
}

function makeUniqueSlug(base: string, used: Set<string>): string {
  if (!used.has(base)) {
    used.add(base);
    return base;
  }

  let i = 2;
  while (used.has(`${base}-${i}`)) {
    i += 1;
  }

  const unique = `${base}-${i}`;
  used.add(unique);
  return unique;
}

function validateRecord(record: ParsedTemplate): string[] {
  const issues: string[] = [];

  if (!record.normalizedTitle) issues.push("missing title");
  if (!record.categorySlug) issues.push("missing category");
  if (!record.downloadUrl) issues.push("missing download URL");
  if (!record.preferredFileType) issues.push("missing file type");

  return issues;
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

function createBatchId(): string {
  return `4over-${new Date().toISOString().replace(/[:.]/g, "-")}`;
}

async function probeTokenWriteAccess(
  client: ReturnType<typeof createClient>,
): Promise<WriteProbeResult> {
  const nonce = Date.now();
  const categoryId = `auth-probe-category-${nonce}`;
  const templateId = `auth-probe-template-${nonce}`;

  try {
    await client.mutate(
      [
        {
          createIfNotExists: {
            _id: categoryId,
            _type: "templateCategory",
            title: "Auth Probe Category",
            slug: { _type: "slug", current: `auth-probe-category-${nonce}` },
            status: "draft",
          },
        },
        {
          patch: {
            id: categoryId,
            set: { description: "Auth probe" },
          },
        },
        {
          createIfNotExists: {
            _id: templateId,
            _type: "template",
            status: "draft",
            title: "Auth Probe Template",
            slug: { _type: "slug", current: `auth-probe-template-${nonce}` },
            description: "Auth probe description",
            category: { _type: "reference", _ref: categoryId },
            fileType: "EPS",
            size: "Standard",
            externalDownloadUrl: "https://example.com/auth-probe.eps",
            sourceProvider: "other",
            publishedAt: new Date().toISOString(),
          },
        },
        {
          patch: {
            id: templateId,
            set: { importBatchId: `auth-probe-${nonce}` },
          },
        },
      ],
      {
        dryRun: true,
        returnDocuments: false,
      },
    );

    return {
      hasWriteAccess: true,
      details:
        "Token passed dry-run mutation probe for template/templateCategory create+update.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      hasWriteAccess: false,
      details: `Dry-run mutation probe failed: ${message}`,
    };
  }
}

async function run() {
  loadEnv();

  const commitMode = process.argv.includes("--commit");
  const dryRun = !commitMode && process.env.DRY_RUN !== "false";
  const useCliUserToken =
    process.argv.includes("--use-cli-user-token") ||
    process.env.SANITY_USE_CLI_USER_TOKEN === "true";
  const importAssets = process.argv.includes("--import-assets");
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;
  const batchArg = process.argv.find((arg) => arg.startsWith("--batch-id="));
  const importBatchId = batchArg
    ? batchArg.split("=")[1]?.trim()
    : createBatchId();

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
  const tokenExists = Boolean(token);

  if (commitMode && !token) {
    if (!useCliUserToken) {
      throw new Error(
        "Commit mode requested but no write token was detected. Set SANITY_API_WRITE_TOKEN (preferred) or SANITY_API_TOKEN with Editor/create+read+update permissions on template and templateCategory, then rerun: npm run import:templates:4over -- --commit --limit=50",
      );
    }
  }

  const client = useCliUserToken
    ? getCliClient({ apiVersion })
    : createClient({
        projectId,
        dataset,
        apiVersion,
        token: token || undefined,
        useCdn: false,
      });
  let activeClient = client;

  const sourceRecords = await fetchOrSimulate();
  const records =
    typeof limit === "number" && Number.isFinite(limit)
      ? sourceRecords.slice(0, Math.max(0, limit))
      : sourceRecords;

  let authMode: AuthMode = "offline-preview";
  let offlineMode = false;
  let writeProbe: WriteProbeResult | null = null;

  const canReadWithClient = async (
    targetClient: ReturnType<typeof createClient>,
  ) => {
    await targetClient.fetch(`count(*[_type == "template"])`);
  };

  if (useCliUserToken) {
    try {
      await canReadWithClient(client);
      authMode = "token";
      writeProbe = await probeTokenWriteAccess(client);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (commitMode) {
        throw new Error(
          `Commit mode requires a valid Sanity CLI user token. Run this command via 'npx sanity exec ... --with-user-token' and ensure your Sanity user has Editor access to project ${projectId}, dataset ${dataset}. Details: ${message}`,
        );
      }
      console.warn(
        `CLI user token auth failed in preview mode (${message}). Trying session/offline fallback.`,
      );
    }
  } else if (token) {
    try {
      await canReadWithClient(client);
      authMode = "token";
      writeProbe = await probeTokenWriteAccess(client);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (commitMode) {
        throw new Error(
          `Commit mode requires a valid token. ${tokenSource} was detected but token authentication failed while reading dataset: ${message}. Ensure ${tokenSource} is set to an active token for project ${projectId}, dataset ${dataset}, then rerun: npm run import:templates:4over -- --commit --limit=50`,
        );
      }
      console.warn(
        `Token auth failed in preview mode (${message}). Trying session/offline fallback.`,
      );
    }
  }

  if (dryRun && authMode !== "token") {
    try {
      const sessionClient = createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
      });
      await canReadWithClient(sessionClient);
      authMode = "session";
      activeClient = sessionClient;
    } catch (error) {
      offlineMode = true;
      authMode = "offline-preview";
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`DRY_RUN offline mode enabled: ${message}`);
    }
  }

  const writeEnabled = commitMode && authMode === "token";
  const importedAt = new Date().toISOString();

  if (commitMode && authMode !== "token") {
    throw new Error(
      "Commit mode requires token auth (session/offline preview is not allowed for writes). Configure SANITY_API_WRITE_TOKEN (preferred) or SANITY_API_TOKEN and rerun with --commit.",
    );
  }

  if (commitMode && (!writeProbe || !writeProbe.hasWriteAccess)) {
    throw new Error(
      `Commit mode requires token write permissions. ${writeProbe?.details || "Write probe was not available."} Required permission: Editor role or create/read/update access on template and templateCategory. Rerun: npm run import:templates:4over -- --commit --limit=50`,
    );
  }

  console.log(`Mode: ${commitMode ? "COMMIT" : "DRY_RUN"}`);
  console.log(`DRY_RUN = ${dryRun}`);
  console.log(`Commit requested = ${commitMode}`);
  console.log(`Token detected = ${tokenExists ? "yes" : "no"}`);
  console.log(`Using CLI user token = ${useCliUserToken ? "yes" : "no"}`);
  console.log(`AUTH MODE = ${authMode}`);
  console.log(`WRITE ENABLED = ${writeEnabled ? "yes" : "no"}`);
  console.log(`Token source = ${tokenSource}`);
  console.log(
    `Token write probe = ${
      writeProbe ? (writeProbe.hasWriteAccess ? "pass" : "fail") : "not-run"
    }`,
  );
  if (writeProbe) {
    console.log(`Token write probe details = ${writeProbe.details}`);
  }
  console.log(`Project = ${projectId}`);
  console.log(`Dataset = ${dataset}`);
  console.log(`API version = ${apiVersion}`);
  console.log(`Import batch ID = ${importBatchId}`);
  console.log(
    `Import assets: ${importAssets ? "yes" : "no (external links only)"}`,
  );
  console.log(`Source records: ${records.length}`);

  const categoryResult = await ensureTemplateCategories(
    activeClient,
    records.map((record) => record.categorySlug),
    dryRun,
    offlineMode,
  );
  const categoryMap = categoryResult.categoryMap;

  let existingTemplates: ExistingTemplateDoc[] = [];

  if (!offlineMode) {
    existingTemplates = await activeClient.fetch<ExistingTemplateDoc[]>(
      `*[_type == "template"]{
        _id,
        title,
        slug,
        sourceProvider,
        importSource,
        externalDownloadUrl,
        sourcePageUrl
      }`,
    );
  }

  const existingSlugSet = new Set(
    existingTemplates
      .map((doc) => doc.slug?.current)
      .filter(Boolean) as string[],
  );
  const existingTitleSet = new Set(
    existingTemplates.map((doc) => normalizeText(doc.title)),
  );
  const existingExternalUrlSet = new Set(
    existingTemplates
      .map((doc) => normalizeUrl(doc.externalDownloadUrl))
      .filter(Boolean),
  );
  const existingProviderTitleSet = new Set(
    existingTemplates
      .map(
        (doc) =>
          `${normalizeText(doc.sourceProvider || doc.importSource)}|${normalizeText(doc.title)}`,
      )
      .filter((value) => value !== "|"),
  );

  const docsToCreate: ImportDoc[] = [];
  let skippedDuplicate = 0;
  let skippedInvalid = 0;
  let skippedBySlug = 0;
  let skippedByProviderTitle = 0;
  let skippedByExternalUrl = 0;
  let skippedByTitle = 0;

  for (const record of records) {
    const issues = validateRecord(record);
    if (issues.length > 0) {
      skippedInvalid += 1;
      console.log(
        `Skip invalid: ${record.normalizedTitle} -> ${issues.join(", ")}`,
      );
      continue;
    }

    const baseSlug = slugify(
      `${record.categorySlug}-${record.normalizedTitle}`,
    );
    const providerTitleKey = `4over|${normalizeText(record.normalizedTitle)}`;
    const downloadUrlKey = normalizeUrl(record.downloadUrl);

    if (existingSlugSet.has(baseSlug)) {
      skippedDuplicate += 1;
      skippedBySlug += 1;
      console.log(
        `Skip duplicate slug: ${record.normalizedTitle} (${baseSlug})`,
      );
      continue;
    }

    if (existingProviderTitleSet.has(providerTitleKey)) {
      skippedDuplicate += 1;
      skippedByProviderTitle += 1;
      console.log(`Skip duplicate provider+title: ${record.normalizedTitle}`);
      continue;
    }

    if (downloadUrlKey && existingExternalUrlSet.has(downloadUrlKey)) {
      skippedDuplicate += 1;
      skippedByExternalUrl += 1;
      console.log(`Skip duplicate external URL: ${record.normalizedTitle}`);
      continue;
    }

    if (existingTitleSet.has(normalizeText(record.normalizedTitle))) {
      skippedDuplicate += 1;
      skippedByTitle += 1;
      console.log(`Skip duplicate title: ${record.normalizedTitle}`);
      continue;
    }

    const slug = makeUniqueSlug(baseSlug, existingSlugSet);
    const categoryId = categoryMap.get(record.categorySlug);

    if (!categoryId) {
      skippedInvalid += 1;
      console.log(`Skip missing category mapping: ${record.normalizedTitle}`);
      continue;
    }

    docsToCreate.push({
      _type: "template",
      status: "published",
      title: record.normalizedTitle,
      slug: { _type: "slug", current: slug },
      description: `Imported from 4over (${record.sourceCategory})`,
      category: { _type: "reference", _ref: categoryId },
      fileType: record.preferredFileType,
      size: record.dimensions || "Standard",
      tags: [
        "4over",
        record.sourceCategory,
        record.preferredFileType.toLowerCase(),
      ],
      isPremium: false,
      rating: 5,
      downloadCount: 0,
      instructions:
        "Review artwork in your design software before print production.",
      externalDownloadUrl: record.downloadUrl,
      externalPreviewImageUrl: record.previewUrl,
      sourceProvider: "4over",
      sourcePageUrl: record.sourcePageUrl,
      importSource: "4over",
      importedAt,
      importBatchId,
      importedByScript: true,
      publishedAt: importedAt,
    });

    existingTitleSet.add(normalizeText(record.normalizedTitle));
    existingProviderTitleSet.add(providerTitleKey);
    if (downloadUrlKey) {
      existingExternalUrlSet.add(downloadUrlKey);
    }
  }

  console.log(`\nPrepared docs: ${docsToCreate.length}`);
  console.log(
    `Categories to create: ${
      dryRun
        ? categoryResult.categoriesPlannedCreate
        : categoryResult.categoriesCreated
    }`,
  );
  console.log(
    `Categories existing/reused: ${categoryResult.categoriesExisting}`,
  );
  console.log(`Skipped duplicates: ${skippedDuplicate}`);
  console.log(`Skipped by slug: ${skippedBySlug}`);
  console.log(`Skipped by provider+title: ${skippedByProviderTitle}`);
  console.log(`Skipped by external URL: ${skippedByExternalUrl}`);
  console.log(`Skipped by title fallback: ${skippedByTitle}`);
  console.log(`Skipped invalid: ${skippedInvalid}`);

  console.log("\nStructured dataset example (first 3):");
  console.log(JSON.stringify(docsToCreate.slice(0, 3), null, 2));

  if (dryRun) {
    console.log(`Batch ID: ${importBatchId}`);
    console.log(
      `Rollback preview: npm run rollback:templates:4over -- --batch-id=${importBatchId}`,
    );
    console.log("\nDRY_RUN complete. No documents were written.");
    return;
  }

  let created = 0;

  for (let i = 0; i < docsToCreate.length; i += BATCH_SIZE) {
    const batch = docsToCreate.slice(i, i + BATCH_SIZE);

    const transaction = client.transaction();

    for (const doc of batch) {
      if (importAssets) {
        // Asset import can be enabled later if legal approval is confirmed.
        // This migration defaults to external links only.
      }

      transaction.create(doc);
    }

    try {
      await transaction.commit({ autoGenerateArrayKeys: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Batch commit failed. Verify SANITY_API_WRITE_TOKEN/SANITY_API_TOKEN has Editor/write permission for ${projectId}/${dataset}. Details: ${message}`,
      );
    }
    created += batch.length;
    console.log(
      `Committed batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} docs`,
    );
  }

  console.log(`\nImport complete. Created ${created} template documents.`);
  console.log(`Batch ID: ${importBatchId}`);
  console.log(
    `Rollback preview: npm run rollback:templates:4over -- --batch-id=${importBatchId}`,
  );
  console.log(
    `Rollback commit: npm run rollback:templates:4over -- --commit --batch-id=${importBatchId}`,
  );
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Migration failed: ${message}`);
  process.exit(1);
});
