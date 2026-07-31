import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import path from "path";

const DELETE_BATCH_SIZE = 100;

type AuthMode = "token" | "session";

type RollbackTarget = {
  _id: string;
  title?: string;
  importBatchId?: string;
  importedAt?: string;
  sourceProvider?: string;
  importSource?: string;
  importedByScript?: boolean;
};

function loadEnv() {
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
  dotenv.config({ path: path.resolve(process.cwd(), "../web/.env.local") });
}

function normalizeIso(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid ISO date: ${value}`);
  }
  return date.toISOString();
}

async function run() {
  loadEnv();

  const commitMode = process.argv.includes("--commit");
  const dryRun = !commitMode;
  const batchArg = process.argv.find((arg) => arg.startsWith("--batch-id="));
  const sourceProviderArg = process.argv.find((arg) =>
    arg.startsWith("--source-provider="),
  );
  const fromArg = process.argv.find((arg) => arg.startsWith("--from="));
  const toArg = process.argv.find((arg) => arg.startsWith("--to="));

  const importBatchId = batchArg?.split("=")[1]?.trim();
  const sourceProvider =
    sourceProviderArg?.split("=")[1]?.trim().toLowerCase() || "4over";
  const from = normalizeIso(fromArg?.split("=")[1]?.trim());
  const to = normalizeIso(toArg?.split("=")[1]?.trim());

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
      "Rollback commit requested but no write token found. Set SANITY_API_WRITE_TOKEN (preferred) or SANITY_API_TOKEN.",
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
          `Rollback commit requires valid token auth. ${tokenSource} failed: ${message}`,
        );
      }
      console.warn(
        `Token auth failed in rollback preview (${message}). Trying session fallback.`,
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
        `Rollback preview requires valid token or active Sanity session. Auth failed: ${message}`,
      );
    }
  }

  const params: Record<string, unknown> = {
    sourceProvider,
    importSource: sourceProvider,
    batchId: importBatchId,
    from,
    to,
  };

  const clauses = [
    '_type == "template"',
    "importedByScript == true",
    "(importSource == $importSource || lower(sourceProvider) == $sourceProvider)",
  ];

  if (importBatchId) {
    clauses.push("importBatchId == $batchId");
  }

  if (from) {
    clauses.push("importedAt >= $from");
  }

  if (to) {
    clauses.push("importedAt <= $to");
  }

  const filter = clauses.join(" && ");

  const targets = await activeClient.fetch<RollbackTarget[]>(
    `*[${filter}] | order(importedAt desc) {
      _id,
      title,
      importBatchId,
      importedAt,
      sourceProvider,
      importSource,
      importedByScript
    }`,
    params,
  );

  console.log(`Mode: ${dryRun ? "DRY_RUN" : "COMMIT"}`);
  console.log(`AUTH MODE: ${authMode}`);
  console.log(`Token source: ${tokenSource}`);
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}`);
  console.log(`Source provider: ${sourceProvider}`);
  console.log(`Batch filter: ${importBatchId || "(none)"}`);
  console.log(`Date range from: ${from || "(none)"}`);
  console.log(`Date range to: ${to || "(none)"}`);
  console.log(`Matched templates: ${targets.length}`);

  const previewRows = targets.slice(0, 20).map((target) => ({
    id: target._id,
    title: target.title,
    batchId: target.importBatchId,
    importedAt: target.importedAt,
  }));

  if (previewRows.length > 0) {
    console.log("Preview targets (max 20):");
    console.log(JSON.stringify(previewRows, null, 2));
  }

  if (dryRun) {
    console.log("\nDRY_RUN complete. No documents were deleted.");
    return;
  }

  let deleted = 0;

  for (let i = 0; i < targets.length; i += DELETE_BATCH_SIZE) {
    const batch = targets.slice(i, i + DELETE_BATCH_SIZE);
    const tx = tokenClient.transaction();

    for (const target of batch) {
      tx.delete(target._id);
    }

    await tx.commit({ autoGenerateArrayKeys: true });
    deleted += batch.length;
    console.log(
      `Deleted batch ${Math.floor(i / DELETE_BATCH_SIZE) + 1}: ${batch.length}`,
    );
  }

  console.log(`\nRollback complete. Deleted ${deleted} templates.`);
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Rollback failed: ${message}`);
  process.exit(1);
});
