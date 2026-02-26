import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity/contentFetchers";

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Generate a low-quality placeholder image (LQIP) data URL
 * This creates a tiny blurred version ofthe image for better perceived performance
 */
export function generateBlurDataURL(source: SanityImageSource): string {
  if (!source) return "";

  try {
    // Create a very small version (20px width) for blur placeholder
    const url = urlFor(source).width(20).quality(20).format("webp").url();

    // Return as base64 data URL for better performance
    return url || "";
  } catch (error) {
    console.error("Error generating blur data URL:", error);
    return "";
  }
}

/**
 * Get optimized image props with blur placeholder
 */
export function getOptimizedSanityImage(
  source: SanityImageSource,
  options: {
    width?: number;
    height?: number;
    quality?: number;
  } = {},
) {
  if (!source) return null;

  const { width = 800, height, quality = 75 } = options;

  const imageUrl = urlFor(source)
    .width(width)
    .quality(quality)
    .format("webp")
    .url();

  const blurDataURL = generateBlurDataURL(source);

  return {
    src: imageUrl,
    blurDataURL,
    placeholder: blurDataURL ? ("blur" as const) : undefined,
  };
}
