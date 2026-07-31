import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".ai",
  ".psd",
  ".indd",
  ".pptx",
  ".docx",
  ".zip",
  ".eps",
  ".jpg",
  ".jpeg",
]);

type FileEntry = {
  absolutePath: string;
  relativePath: string;
  fileName: string;
};

function loadEnv() {
  const studioEnv = path.resolve(process.cwd(), ".env.local");
  const webEnv = path.resolve(process.cwd(), "../web/.env.local");

  if (fs.existsSync(studioEnv)) {
    dotenv.config({ path: studioEnv });
  }

  if (fs.existsSync(webEnv)) {
    dotenv.config({ path: webEnv });
  }
}

async function collectFiles(
  rootDir: string,
  currentDir = rootDir,
): Promise<FileEntry[]> {
  const entries = await fs.promises.readdir(currentDir, {
    withFileTypes: true,
  });
  const files: FileEntry[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      const nested = await collectFiles(rootDir, absolutePath);
      files.push(...nested);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      continue;
    }

    files.push({
      absolutePath,
      relativePath: path.relative(rootDir, absolutePath),
      fileName: entry.name,
    });
  }

  return files;
}

function makeTitle(fileName: string): string {
  return path.basename(fileName, path.extname(fileName));
}

async function run() {
  loadEnv();

  const folderArg = process.argv[2];
  const dryRun = process.argv.includes("--dry-run");

  if (!folderArg) {
    console.error(
      "Usage: npx ts-node scripts/media/import-template-files.ts <folder-path> [--dry-run]",
    );
    process.exit(1);
  }

  const rootDir = path.resolve(folderArg);

  if (!fs.existsSync(rootDir) || !fs.statSync(rootDir).isDirectory()) {
    console.error(`Folder not found: ${rootDir}`);
    process.exit(1);
  }

  const files = await collectFiles(rootDir);

  if (files.length === 0) {
    console.log("No supported files found in folder.");
    return;
  }

  console.log(`Found ${files.length} files to import from: ${rootDir}`);

  if (dryRun) {
    for (const file of files) {
      console.log(`[DRY RUN] ${file.relativePath}`);
    }
    return;
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "as5tildt";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
  const token =
    process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;

  if (!token) {
    console.error("Missing SANITY_API_WRITE_TOKEN or SANITY_API_TOKEN in env.");
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    try {
      const existingId = await client.fetch<string | null>(
        `*[_type == "media" && category == "template-files" && file.asset->originalFilename == $fileName][0]._id`,
        { fileName: file.fileName },
      );

      if (existingId) {
        skipped += 1;
        console.log(`Skipped (already exists): ${file.relativePath}`);
        continue;
      }

      const uploadedAsset = await client.assets.upload(
        "file",
        fs.createReadStream(file.absolutePath),
        { filename: file.fileName },
      );

      await client.create({
        _type: "media",
        title: makeTitle(file.fileName),
        description: `Imported from ${rootDir}`,
        category: "template-files",
        tags: ["template-file"],
        file: {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: uploadedAsset._id,
          },
        },
      });

      imported += 1;
      console.log(`Imported: ${file.relativePath}`);
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed: ${file.relativePath} -> ${message}`);
    }
  }

  console.log("\nImport complete");
  console.log(`Imported: ${imported}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Fatal error: ${message}`);
  process.exit(1);
});
