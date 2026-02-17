import { createClient } from "@sanity/client";

const DRY_RUN = process.env.DRY_RUN !== "false";
const MODE = process.env.MODE || "mapping";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "as5tildt",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2023-05-03",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

function mergeBlocks(primary, secondary) {
  if (Array.isArray(primary) && Array.isArray(secondary)) {
    return [...primary, ...secondary];
  }
  return primary || secondary || undefined;
}

function mapQuoteOptions(options) {
  if (!Array.isArray(options)) return undefined;
  return options.map((option) => ({
    name: option.name || option.title || "Option",
    value: option.description || (option.required ? "Required" : "") || "",
  }));
}

function stripUnsafeCharacters(value) {
  if (!value) return "";
  return value
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateToLength(value, maxLength) {
  if (value.length <= maxLength) return value;
  return value
    .slice(0, maxLength)
    .replace(/\s+\S*$/, "")
    .trim();
}

function buildMetaTitle(product, usedTitles) {
  const baseTitle = `${product.title} | High-Quality Printing | DigiPrintPlus`;
  const fallbackTitle = `${product.title} | DigiPrintPlus`;
  const categoryTitle = product.category?.title
    ? `${product.title} | ${product.category.title} | DigiPrintPlus`
    : null;

  const candidates = [baseTitle, categoryTitle, fallbackTitle].filter(Boolean);

  for (const candidate of candidates) {
    const cleaned = stripUnsafeCharacters(candidate);
    const truncated = truncateToLength(cleaned, 60);
    const key = truncated.toLowerCase();
    if (!usedTitles.has(key) && truncated.length >= 10) {
      usedTitles.add(key);
      return truncated;
    }
  }

  const shortenedTitle = truncateToLength(
    stripUnsafeCharacters(product.title),
    30,
  );
  const finalTitle = truncateToLength(`${shortenedTitle} | DigiPrintPlus`, 60);
  usedTitles.add(finalTitle.toLowerCase());
  return finalTitle;
}

function buildMetaDescription(product, usedDescriptions) {
  const shortDescription = stripUnsafeCharacters(
    product.shortDescription || product.description || "",
  );
  const specList = Array.isArray(product.quickSpecs)
    ? product.quickSpecs
    : Array.isArray(product.specifications)
      ? product.specifications
      : [];
  const specValues = specList
    .map((spec) => spec.value || spec.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");

  const specPhrase = specValues ? `Featuring ${specValues}. ` : "";
  let description = `${product.title} printing`;
  if (shortDescription) {
    description += ` - ${shortDescription}`;
  }
  description += `. ${specPhrase}Premium quality, custom print options, and fast turnaround for professional results.`;

  description = stripUnsafeCharacters(description);
  description = truncateToLength(description, 155);

  if (description.length < 120) {
    description = `${description} Custom print solutions with reliable service.`;
    description = truncateToLength(description, 155);
  }

  let uniqueDescription = description;
  let attempts = 0;
  while (
    usedDescriptions.has(uniqueDescription.toLowerCase()) &&
    attempts < 3
  ) {
    const suffix =
      attempts === 0
        ? " Ideal for business needs."
        : " Built for standout marketing.";
    uniqueDescription = truncateToLength(`${description} ${suffix}`, 155);
    attempts += 1;
  }
  usedDescriptions.add(uniqueDescription.toLowerCase());
  return uniqueDescription;
}

async function run() {
  const products = await client.fetch(`*[_type == "product"]{
    _id,
    title,
    shortDescription,
    description,
    category->{ title },
    mainImage,
    image,
    content,
    productDetails,
    detailedSpecs,
    quickSpecs,
    specifications,
    flags,
    featured,
    popular,
    newProduct,
    fastDelivery,
    qualityGuarantee,
    awardWinning,
    quote,
    inStock,
    leadTime,
    quoteOptions,
    seo{
      metaTitle,
      metaDescription
    },
    template{
      file,
      downloadFile,
      previewHtml,
      htmlEmbed
    }
  }`);

  const patches = [];
  const usedTitles = new Set();
  const usedDescriptions = new Set();

  products.forEach((product) => {
    if (product.seo?.metaTitle) {
      usedTitles.add(
        stripUnsafeCharacters(product.seo.metaTitle).toLowerCase(),
      );
    }
    if (product.seo?.metaDescription) {
      usedDescriptions.add(
        stripUnsafeCharacters(product.seo.metaDescription).toLowerCase(),
      );
    }
  });

  for (const product of products) {
    const patch = {};
    const seoPatch = {};

    if (MODE === "seo") {
      if (!product.seo?.metaTitle) {
        seoPatch["seo.metaTitle"] = buildMetaTitle(product, usedTitles);
      }
      if (!product.seo?.metaDescription) {
        seoPatch["seo.metaDescription"] = buildMetaDescription(
          product,
          usedDescriptions,
        );
      }
      if (Object.keys(seoPatch).length > 0) {
        patches.push({ id: product._id, patch: seoPatch });
      }
      continue;
    }

    if (!product.shortDescription && product.description) {
      patch.shortDescription = product.description;
    }

    if (!product.mainImage && product.image) {
      patch.mainImage = product.image;
    }

    if (!product.content) {
      const mergedContent = mergeBlocks(
        product.productDetails,
        product.detailedSpecs,
      );
      if (mergedContent) patch.content = mergedContent;
    }

    if (!product.quickSpecs && Array.isArray(product.specifications)) {
      patch.quickSpecs = product.specifications.map((spec) => ({
        name: spec.name,
        value: spec.value,
      }));
    }

    if (!product.flags) {
      patch.flags = {
        featured: !!product.featured,
        popular: !!product.popular,
        new: !!product.newProduct,
        fastDelivery: !!product.fastDelivery,
        qualityGuarantee: !!product.qualityGuarantee,
        awardWinning: !!product.awardWinning,
      };
    }

    if (!product.quote) {
      patch.quote = {
        enabled: !!product.inStock,
        leadTime: product.leadTime,
        options: mapQuoteOptions(product.quoteOptions),
      };
    }

    if (product.template) {
      const templatePatch = {};
      if (!product.template.file && product.template.downloadFile) {
        templatePatch.file = product.template.downloadFile;
      }
      if (!product.template.previewHtml && product.template.htmlEmbed) {
        templatePatch.previewHtml = product.template.htmlEmbed;
      }
      if (Object.keys(templatePatch).length > 0) {
        patch.template = { ...product.template, ...templatePatch };
      }
    }

    if (Object.keys(patch).length > 0) {
      patches.push({ id: product._id, patch });
    }
  }

  if (patches.length === 0) {
    console.log("No updates needed.");
    return;
  }

  console.log(
    `Prepared ${patches.length} patches. MODE=${MODE} DRY_RUN=${DRY_RUN}`,
  );

  if (DRY_RUN) {
    patches.slice(0, 10).forEach(({ id, patch }) => {
      console.log(id, JSON.stringify(patch, null, 2));
    });
    console.log("Set DRY_RUN=false to apply patches.");
    return;
  }

  for (const { id, patch } of patches) {
    await client.patch(id).set(patch).commit();
    console.log(`Updated ${id}`);
  }

  if (MODE === "seo") {
    const titlesCreated = patches.filter(
      (p) => p.patch["seo.metaTitle"],
    ).length;
    const descriptionsCreated = patches.filter(
      (p) => p.patch["seo.metaDescription"],
    ).length;
    const totalScanned = products.length;
    const missingSeo = products
      .filter(
        (product) => !product.seo?.metaTitle || !product.seo?.metaDescription,
      )
      .map((product) => product.title);

    console.log("SEO Summary:");
    console.log(`Total products scanned: ${totalScanned}`);
    console.log(`Meta titles created: ${titlesCreated}`);
    console.log(`Meta descriptions created: ${descriptionsCreated}`);
    if (missingSeo.length > 0) {
      console.log("Products still missing SEO:");
      missingSeo.forEach((title) => console.log(`- ${title}`));
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
