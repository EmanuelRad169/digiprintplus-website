import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import path from "path";

type ImportedTemplate = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  status?: string;
  category?: { _ref?: string };
  fileType?: string;
  size?: string;
  previewImage?: unknown;
  externalPreviewImageUrl?: string;
  downloadFile?: unknown;
  externalDownloadUrl?: string;
  sourceProvider?: string;
  importSource?: string;
  importedAt?: string;
  importBatchId?: string;
  importedByScript?: boolean;
};

type AuthMode = "token" | "session";

type FrontendTemplate = {
  _id: string;
  title?: string;
  slug?: { current?: string };
};

function loadEnv() {
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
  dotenv.config({ path: path.resolve(process.cwd(), "../web/.env.local") });
}

function hasPreview(doc: ImportedTemplate): boolean {
  return Boolean(doc.previewImage || doc.externalPreviewImageUrl);
}

function hasDownload(doc: ImportedTemplate): boolean {
  return Boolean(doc.downloadFile || doc.externalDownloadUrl);
}

async function run() {
  loadEnv();

  const batchArg = process.argv.find((arg) => arg.startsWith("--batch-id="));
  const sourceProviderArg = process.argv.find((arg) =>
    arg.startsWith("--source-provider="),
  );

  const batchId = batchArg?.split("=")[1]?.trim();
  const sourceProvider =
    sourceProviderArg?.split("=")[1]?.trim().toLowerCase() || "4over";

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
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(
        `Token auth failed in verification (${message}). Trying session fallback.`,
      );
    }
  }

  if (!token || authMode !== "token") {
    const sessionClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
    });

    try {
      await canRead(sessionClient);
      activeClient = sessionClient;
      authMode = "session";
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Verification requires valid token or active Sanity session. Auth failed: ${message}`,
      );
    }
  }

  const params: Record<string, unknown> = {
    sourceProvider,
    importSource: sourceProvider,
    batchId,
  };

  const clauses = [
    '_type == "template"',
    "importedByScript == true",
    "(importSource == $importSource || lower(sourceProvider) == $sourceProvider)",
  ];

  if (batchId) {
    clauses.push("importBatchId == $batchId");
  }

  const filter = clauses.join(" && ");

  const imported = await activeClient.fetch<ImportedTemplate[]>(
    `*[${filter}] | order(importedAt desc) {
      _id,
      title,
      slug,
      status,
      category,
      fileType,
      size,
      previewImage,
      externalPreviewImageUrl,
      downloadFile,
      externalDownloadUrl,
      sourceProvider,
      importSource,
      importedAt,
      importBatchId,
      importedByScript
    }`,
    params,
  );

  const missingRequired = imported.filter((doc) => {
    return !(
      doc.title &&
      doc.slug?.current &&
      doc.status &&
      doc.category?._ref &&
      doc.fileType &&
      doc.size &&
      hasPreview(doc) &&
      hasDownload(doc)
    );
  });

  const categoryIds = Array.from(
    new Set(
      imported.map((doc) => doc.category?._ref).filter(Boolean) as string[],
    ),
  );

  const categories =
    categoryIds.length > 0
      ? await activeClient.fetch<
          Array<{ _id: string; title?: string; slug?: { current?: string } }>
        >(`*[_type == "templateCategory" && _id in $ids]{ _id, title, slug }`, {
          ids: categoryIds,
        })
      : [];

  const categoryIdSet = new Set(categories.map((cat) => cat._id));
  const missingCategoryRefs = imported.filter(
    (doc) => doc.category?._ref && !categoryIdSet.has(doc.category._ref),
  );

  const frontendVisible = await activeClient.fetch<FrontendTemplate[]>(
    `*[_type == "template" && !(_id in path('drafts.**')) && (!defined(status) || status == "published") && ${filter}]{
      _id,
      title,
      slug
    }`,
    params,
  );

  const frontendVisibleIds = new Set(frontendVisible.map((doc) => doc._id));
  const notInFrontendQuery = imported.filter(
    (doc) => !frontendVisibleIds.has(doc._id),
  );

  console.log("4over import verification report");
  console.log(`AUTH MODE: ${authMode}`);
  console.log(`Token source: ${tokenSource}`);
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}`);
  console.log(`Source provider: ${sourceProvider}`);
  console.log(`Batch filter: ${batchId || "(none)"}`);
  console.log(`Imported templates matched: ${imported.length}`);
  console.log(`Unique categories referenced: ${categoryIds.length}`);
  console.log(`Categories resolved: ${categories.length}`);
  console.log(`Missing category references: ${missingCategoryRefs.length}`);
  console.log(`Missing required fields: ${missingRequired.length}`);
  console.log(`Visible in frontend template query: ${frontendVisible.length}`);
  console.log(
    `Not visible in frontend template query: ${notInFrontendQuery.length}`,
  );

  if (missingRequired.length > 0) {
    console.log("\nTemplates missing required fields (max 20):");
    console.log(
      JSON.stringify(
        missingRequired.slice(0, 20).map((doc) => ({
          id: doc._id,
          title: doc.title,
          slug: doc.slug?.current,
          hasPreview: hasPreview(doc),
          hasDownload: hasDownload(doc),
          status: doc.status,
          hasCategory: Boolean(doc.category?._ref),
        })),
        null,
        2,
      ),
    );
  }

  if (notInFrontendQuery.length > 0) {
    console.log("\nTemplates not visible in frontend query (max 20):");
    console.log(
      JSON.stringify(
        notInFrontendQuery.slice(0, 20).map((doc) => ({
          id: doc._id,
          title: doc.title,
          slug: doc.slug?.current,
          status: doc.status,
        })),
        null,
        2,
      ),
    );
  }
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Verification failed: ${message}`);
  process.exit(1);
});
