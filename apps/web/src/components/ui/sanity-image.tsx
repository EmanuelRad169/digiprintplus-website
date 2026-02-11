'use client'

import { ComponentProps } from 'react'
import Image from 'next/image'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { getOptimizedImageProps, getResponsiveImageProps } from '@/lib/sanity/image'

interface SanityImageProps extends Omit<ComponentProps<typeof Image>, 'src'> {
  src: SanityImageSource
  responsive?: boolean
  maxWidth?: number
  quality?: number
  format?: 'auto' | 'webp' | 'jpg' | 'png'
}

export function SanityImage({
  src,
  alt,
  width,
  height,
  responsive = false,
  maxWidth = 1200,
  quality = 75,
  format = 'auto',
  priority = false,
  className,
  ...props
}: SanityImageProps) {
  if (!src) {
    return null
  }

  if (responsive) {
    const imageProps = getResponsiveImageProps(src, {
      maxWidth,
      quality,
      aspectRatio: typeof width === 'number' && typeof height === 'number' ? width / height : undefined,
    })
    
    return (
      <Image
        {...imageProps}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={className}
        {...props}
      />
    )
  }

  const imageProps = getOptimizedImageProps(src, {
    width: width as number,
    height: height as number,
    quality,
    format,
  })

  return (
    <Image
      {...imageProps}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      {...props}
    />
  )
}

// Helper component for hero images with optimized loading
export function SanityHeroImage({
  src,
  alt,
  className = "w-full h-64 md:h-96 object-cover",
  ...props
}: Omit<SanityImageProps, 'width' | 'height'>) {
  return (
    <SanityImage
      src={src}
      alt={alt}
      width={1920}
      height={1080}
      responsive
      priority
      quality={80}
      className={className}
      {...props}
    />
  )
}

// Helper component for product images
export function SanityProductImage({
  src,
  alt,
  className = "w-full h-48 object-cover",
  ...props
}: Omit<SanityImageProps, 'width' | 'height'>) {
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
  )
}
