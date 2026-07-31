"use client";

import { ComponentProps } from "react";
import Image from "next/image";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import {
  getOptimizedImageProps,
  getResponsiveImageProps,
} from "../../lib/sanity/image";
import { generateBlurDataURL } from "../../lib/sanity/image-blur";

import sanityLoader from "../../lib/sanity/image-loader";

interface SanityImageProps extends Omit<ComponentProps<typeof Image>, "src"> {
  src: SanityImageSource;
  responsive?: boolean;
  maxWidth?: number;
  quality?: number;
  format?: "auto" | "webp" | "jpg" | "png";
}

export function SanityImage({
  src,
  alt,
  width,
  height,
  responsive = false,
  maxWidth = 1200,
  quality = 90,
  format = "auto",
  priority = false,
  className,
  sizes,
  ...props
}: SanityImageProps) {
  if (!src) {
    return null;
  }

  // Get base properties
  const imageProps = responsive
    ? getResponsiveImageProps(src, {
        maxWidth,
        quality,
        aspectRatio:
          typeof width === "number" && typeof height === "number"
            ? width / height
            : undefined,
      })
    : getOptimizedImageProps(src, {
        width: width as number,
        height: height as number,
        quality,
        format,
      });

  const blurDataURL = generateBlurDataURL(src);

  // Use custom loader for Sanity images to offload optimization
  // and avoid Next.js server entry cost
  const loaderProp = { loader: sanityLoader };

  // If responsive, ensure we use fill if width/height aren't explicit
  // But usually responsive implies handling sizes.
  // getResponsiveImageProps returns { src, srcSet, sizes }
  // Next.js Image doesn't use srcSet, so we strip it and rely on loader + sizes

  const { src: imageSrc } = imageProps;
  const defaultSizes = "sizes" in imageProps ? imageProps.sizes : undefined;

  return (
    <Image
      {...props}
      {...loaderProp}
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      sizes={sizes || (responsive ? defaultSizes : undefined)}
    />
  );
}

// Helper component for hero images with optimized loading
export function SanityHeroImage({
  src,
  alt,
  className = "w-full h-64 md:h-96 object-cover",
  ...props
}: Omit<SanityImageProps, "width" | "height">) {
  return (
    <SanityImage
      src={src}
      alt={alt}
      width={1920}
      height={1080}
      responsive
      priority
      quality={90}
      className={className}
      {...props}
    />
  );
}

/**
 * Product imagery.
 *
 * width/height are now overridable. They were hardcoded to 400x300, which is a
 * reasonable card thumbnail but far too small for the product page hero — a
 * 1254x1254 source was being fetched at 400px and stretched about 3x on a
 * retina display, which reads as a low-quality upload rather than a sizing bug.
 *
 * The default is also square rather than 4:3. Asking Sanity for 4:3 made it
 * apply a `rect` crop to the source (slicing the top and bottom off a square
 * image) before `object-cover` cropped it a second time in the browser.
 */
export function SanityProductImage({
  src,
  alt,
  className = "w-full h-48 object-cover",
  width = 800,
  height = 800,
  quality = 85,
  ...props
}: SanityImageProps) {
  return (
    <SanityImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={quality}
      className={className}
      {...props}
    />
  );
}
