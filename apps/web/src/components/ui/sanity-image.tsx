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
  quality = 75,
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
      quality={75}
      className={className}
      {...props}
    />
  );
}

// Helper component for product images
export function SanityProductImage({
  src,
  alt,
  className = "w-full h-48 object-cover",
  ...props
}: Omit<SanityImageProps, "width" | "height">) {
  return (
    <SanityImage
      src={src}
      alt={alt}
      width={400}
      height={300}
      quality={70}
      className={className}
      {...props}
    />
  );
}
