import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import path from "path";
import { getCliClient } from "sanity/cli";

const UPDATE_BATCH_SIZE = 20;
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

type AuthMode = "token" | "session";

type TemplateDoc = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  previewImage?: { asset?: { _ref?: string } };
  externalPreviewImageUrl?: string;
  externalDownloadUrl?: string;
  additionalImages?: Array<{ asset?: { _ref?: string } }>;
  sourcePageUrl?: string;
  importBatchId?: string;
  importedByScript?: boolean;
  sourceProvider?: string;
  importSource?: string;
};

type ResolvedPreview = {
  method:
    | "external-url"
    | "derived-download-url"
    | "additional-image-ref"
    | "fallback-placeholder";
  sourceUrl?: string;
  sourceAssetRef?: string;
  alt: string;
};

type PreviewPlan = {
  id: string;
  title: string;
  slug: string;
  action: "upload-and-set" | "reuse-asset" | "skip";
  reason: string;
  sourceUrl?: string;
  sourceAssetRef?: string;
  patch?: Record<string, unknown>;
};

function loadEnv() {
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
  dotenv.config({ path: path.resolve(process.cwd(), "../web/.env.local") });
}

function getArg(name: string): string | undefined {
  const value = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return value?.split("=")[1]?.trim();
}

function hasPreview(doc: TemplateDoc): boolean {
  return Boolean(doc.previewImage?.asset?._ref || doc.externalPreviewImageUrl);
}

function inferAltText(title?: string): string {
  const safeTitle = (title || "Template").trim();
  return `${safeTitle} preview image`;
}

function inferFilename(doc: TemplateDoc, sourceUrl: string): string {
  const fromSlug = doc.slug?.current?.trim();
  if (fromSlug) return `${fromSlug}.jpg`;
  const sourceName = sourceUrl.split("/").pop()?.split("?")[0]?.trim();
  if (sourceName) return sourceName;
  return `${doc._id}.jpg`;
}

function toAbsoluteHttpUrl(value?: string): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function buildDerivedPreviewCandidates(externalDownloadUrl?: string): string[] {
  const original = toAbsoluteHttpUrl(externalDownloadUrl);
  if (!original) return [];

  const url = new URL(original);
  const pathname = url.pathname;
  const noExt = pathname.replace(/\.[a-z0-9]+$/i, "");

  const baseVariants = new Set<string>([
    noExt,
    noExt.replace(/-SMART-V2$/i, ""),
    noExt.replace(/-V-SMART-V2$/i, "-V"),
    noExt.replace(/-H-SMART-V2$/i, "-H"),
    noExt.replace(/_2$/i, ""),
    noExt.replace(/-?SMART(?:-V2)?/gi, ""),
  ]);

  const out = new Set<string>();

  for (const base of baseVariants) {
    const compactBase = base.replace(/--+/g, "-");
    for (const ext of IMAGE_EXTENSIONS) {
      const candidatePath = `${compactBase}.${ext}`;
      const candidate = new URL(url.toString());
      candidate.pathname = candidatePath;
      out.add(candidate.toString());

      const lower = new URL(url.toString());
      lower.pathname = `${candidatePath.toLowerCase()}`;
      out.add(lower.toString());

      const upper = new URL(url.toString());
      upper.pathname = `${compactBase.toUpperCase()}.${ext.toUpperCase()}`;
      out.add(upper.toString());
    }
  }

  return Array.from(out);
}

async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url, { method: "GET", redirect: "follow" });
    if (!response.ok) return null;

    const contentType = (
      response.headers.get("content-type") || ""
    ).toLowerCase();
    if (!contentType.includes("image/")) return null;

    const arrayBuffer = await response.arrayBuffer();
    const bytes = Buffer.from(arrayBuffer);
    if (bytes.length === 0) return null;

    return bytes;
  } catch {
    return null;
  }
}

async function resolvePreviewForDoc(
  doc: TemplateDoc,
  fallbackAssetRef?: string,
): Promise<ResolvedPreview | null> {
  if (doc.previewImage?.asset?._ref) return null;

  if (doc.additionalImages && doc.additionalImages.length > 0) {
    const ref = doc.additionalImages[0]?.asset?._ref;
    if (ref) {
      return {
        method: "additional-image-ref",
        sourceAssetRef: ref,
        alt: inferAltText(doc.title),
      };
    }
  }

  const directExternal = toAbsoluteHttpUrl(doc.externalPreviewImageUrl);
  if (directExternal) {
    return {
      method: "external-url",
      sourceUrl: directExternal,
      alt: inferAltText(doc.title),
    };
  }

  for (const candidate of buildDerivedPreviewCandidates(
    doc.externalDownloadUrl,
  )) {
    const probe = await fetchImageBuffer(candidate);
    if (probe) {
      return {
        method: "derived-download-url",
        sourceUrl: candidate,
        alt: inferAltText(doc.title),
      };
    }
  }

  if (fallbackAssetRef) {
    return {
      method: "fallback-placeholder",
      sourceAssetRef: fallbackAssetRef,
      alt: `Preview placeholder for ${(doc.title || "template").trim()}`,
    };
  }

  return null;
}

async function run() {
  loadEnv();

  const commitMode = process.argv.includes("--commit");
  const dryRun = !commitMode;
  const useCliUserToken =
    process.argv.includes("--use-cli-user-token") ||
    process.env.SANITY_USE_CLI_USER_TOKEN === "true";

  const batchId = getArg("--batch-id");
  const sourceProvider = (getArg("--source-provider") || "4over").toLowerCase();
  const limitArg = getArg("--limit");
  const limit = limitArg ? Number(limitArg) : undefined;

  if (!batchId) {
    throw new Error(
      "Missing --batch-id. This script requires explicit batch targeting for production safety.",
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
  let authMode: AuthMode = "session";

  const canRead = async (targetClient: ReturnType<typeof createClient>) => {
    await targetClient.fetch(`count(*[_type == "template"])`);
  };

  try {
    await canRead(tokenClient as ReturnType<typeof createClient>);
    authMode = "token";
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (commitMode) {
      throw new Error(
        `Commit mode requires token auth. ${tokenSource} failed: ${message}`,
      );
    }

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
    throw new Error("Commit mode requires token auth.");
  }

  const docs = await activeClient.fetch<TemplateDoc[]>(
    `*[_type == "template" && importedByScript == true && lower(sourceProvider) == $sourceProvider && importBatchId == $batchId && !defined(previewImage.asset)] | order(_createdAt asc){
      _id,
      title,
      slug,
      previewImage,
      externalPreviewImageUrl,
      externalDownloadUrl,
      additionalImages,
      sourcePageUrl,
      importBatchId,
      importedByScript,
      sourceProvider,
      importSource
    }`,
    { sourceProvider, batchId },
  );

  const scopedDocs =
    typeof limit === "number" && Number.isFinite(limit)
      ? docs.slice(0, Math.max(0, limit))
      : docs;

  const fallbackTemplate = await activeClient.fetch<TemplateDoc | null>(
    `*[_type == "template" && importedByScript == true && lower(sourceProvider) == $sourceProvider && importBatchId == $batchId && defined(previewImage.asset)][0]{_id, title, slug, previewImage}`,
    { sourceProvider, batchId },
  );
  const fallbackAssetRef = fallbackTemplate?.previewImage?.asset?._ref;

  const plans: PreviewPlan[] = [];

  for (const doc of scopedDocs) {
    if (hasPreview(doc)) {
      plans.push({
        id: doc._id,
        title: doc.title || "(untitled)",
        slug: doc.slug?.current || "(no-slug)",
        action: "skip",
        reason: "already-has-preview",
      });
      continue;
    }

    const resolved = await resolvePreviewForDoc(doc, fallbackAssetRef);

    if (!resolved) {
      plans.push({
        id: doc._id,
        title: doc.title || "(untitled)",
        slug: doc.slug?.current || "(no-slug)",
        action: "skip",
        reason: "no-valid-preview-source",
      });
      continue;
    }

    if (resolved.sourceAssetRef) {
      plans.push({
        id: doc._id,
        title: doc.title || "(untitled)",
        slug: doc.slug?.current || "(no-slug)",
        action: "reuse-asset",
        reason: resolved.method,
        sourceAssetRef: resolved.sourceAssetRef,
        patch: {
          previewImage: {
            _type: "image",
            asset: { _type: "reference", _ref: resolved.sourceAssetRef },
            alt: resolved.alt,
          },
        },
      });
      continue;
    }

    if (resolved.sourceUrl) {
      plans.push({
        id: doc._id,
        title: doc.title || "(untitled)",
        slug: doc.slug?.current || "(no-slug)",
        action: "upload-and-set",
        reason: resolved.method,
        sourceUrl: resolved.sourceUrl,
        patch: {
          externalPreviewImageUrl: resolved.sourceUrl,
        },
      });
      continue;
    }

    plans.push({
      id: doc._id,
      title: doc.title || "(untitled)",
      slug: doc.slug?.current || "(no-slug)",
      action: "skip",
      reason: "unhandled-resolution-case",
    });
  }

  const toApply = plans.filter((plan) => plan.action !== "skip");
  const skipped = plans.filter((plan) => plan.action === "skip");

  console.log(`Mode: ${dryRun ? "DRY_RUN" : "COMMIT"}`);
  console.log(`AUTH MODE: ${authMode}`);
  console.log(`Token source: ${tokenSource}`);
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}`);
  console.log(`Source provider: ${sourceProvider}`);
  console.log(`Batch ID: ${batchId}`);
  console.log(
    `Templates in scope (missing previewImage asset): ${scopedDocs.length}`,
  );
  console.log(`Planned fixes: ${toApply.length}`);
  console.log(`Skipped: ${skipped.length}`);

  console.log("\nPer-template remediation plan:");
  for (const plan of plans) {
    const source = plan.sourceUrl || plan.sourceAssetRef || "(none)";
    console.log(
      `- ${plan.id} | ${plan.slug} | ${plan.action} | ${plan.reason} | ${source}`,
    );
  }

  if (dryRun) {
    console.log("\nDRY_RUN complete. No documents were modified.");
    return;
  }

  const writeClient = tokenClient as ReturnType<typeof createClient>;

  let fixed = 0;
  let uploadAndSetCount = 0;
  let reusedAssetCount = 0;
  const failed: Array<{ id: string; slug: string; reason: string }> = [];

  for (let i = 0; i < toApply.length; i += UPDATE_BATCH_SIZE) {
    const batch = toApply.slice(i, i + UPDATE_BATCH_SIZE);
    const tx = writeClient.transaction();

    for (const plan of batch) {
      try {
        const fresh = await writeClient.fetch<TemplateDoc | null>(
          `*[_type == "template" && _id == $id][0]{_id, title, slug, previewImage, externalPreviewImageUrl}`,
          { id: plan.id },
        );

        if (!fresh || hasPreview(fresh)) {
          failed.push({
            id: plan.id,
            slug: plan.slug,
            reason: "skipped-during-commit-already-has-preview",
          });
          continue;
        }

        if (plan.action === "reuse-asset" && plan.patch) {
          tx.patch(plan.id, { set: plan.patch });
          reusedAssetCount += 1;
          fixed += 1;
          continue;
        }

        if (plan.action === "upload-and-set" && plan.sourceUrl) {
          const imageBytes = await fetchImageBuffer(plan.sourceUrl);
          if (!imageBytes) {
            failed.push({
              id: plan.id,
              slug: plan.slug,
              reason: `upload-source-unreachable:${plan.sourceUrl}`,
            });
            continue;
          }

          const uploaded = await writeClient.assets.upload(
            "image",
            imageBytes,
            {
              filename: inferFilename(fresh, plan.sourceUrl),
            },
          );

          tx.patch(plan.id, {
            set: {
              previewImage: {
                _type: "image",
                asset: { _type: "reference", _ref: uploaded._id },
                alt: inferAltText(fresh.title),
              },
              ...(fresh.externalPreviewImageUrl
                ? {}
                : { externalPreviewImageUrl: plan.sourceUrl }),
            },
          });
          uploadAndSetCount += 1;
          fixed += 1;
          continue;
        }

        failed.push({ id: plan.id, slug: plan.slug, reason: "invalid-plan" });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failed.push({ id: plan.id, slug: plan.slug, reason: message });
      }
    }

    await tx.commit({ autoGenerateArrayKeys: true });
    console.log(
      `Committed remediation batch ${Math.floor(i / UPDATE_BATCH_SIZE) + 1}: ${batch.length} planned items`,
    );
  }

  console.log("\nRemediation complete.");
  console.log(`Fixed previews: ${fixed}`);
  console.log(`Fixed via upload: ${uploadAndSetCount}`);
  console.log(`Fixed via asset fallback: ${reusedAssetCount}`);
  console.log(`Failed/skipped during commit: ${failed.length}`);

  if (failed.length > 0) {
    console.log("\nFailed/skipped details:");
    for (const item of failed) {
      console.log(`- ${item.id} | ${item.slug} | ${item.reason}`);
    }
  }
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Preview remediation failed: ${message}`);
  process.exit(1);
});
