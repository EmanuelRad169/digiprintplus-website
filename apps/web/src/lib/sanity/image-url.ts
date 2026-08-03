import imageUrlBuilder from "@sanity/image-url";

/**
 * Browser-safe image URL builder.
 *
 * `lib/sanity/settings.ts` exports the same helper, but it builds from a live
 * `@sanity/client` instance — so importing `urlForImage` from there drags the
 * whole client (plus get-it and rxjs) into any client component that touches
 * it. The footer and navigation are in the root layout, so that happened on
 * every single page load and cost seconds of script evaluation.
 *
 * @sanity/image-url only needs the project id and dataset to build a URL. It
 * never makes a request, so there is nothing to gain from handing it a client.
 */
const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "as5tildt",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
});

export const urlForImage = (source: unknown) => {
  const src = source as { asset?: unknown } | null | undefined;
  if (!src || !src.asset) return null;
  return builder.image(src as never);
};
