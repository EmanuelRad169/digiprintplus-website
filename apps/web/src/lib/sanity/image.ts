import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client as sanityClient } from './contentFetchers'

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Optimized image helper for Next.js with WebP/AVIF support
export function getOptimizedImageProps(
  source: SanityImageSource,
  {
    width,
    height,
    quality = 75,
    format = 'webp',
  }: {
    width?: number
    height?: number
    quality?: number
    format?: 'auto' | 'webp' | 'jpg' | 'png'
  } = {}
) {
  let imageBuilder = urlFor(source).auto('format').fit('max').quality(quality)
  
  if (width) imageBuilder = imageBuilder.width(width)
  if (height) imageBuilder = imageBuilder.height(height)
  if (format !== 'auto') imageBuilder = imageBuilder.format(format)
  
  return {
    src: imageBuilder.url(),
    width,
    height,
  }
}

// Get responsive image URLs for different screen sizes
export function getResponsiveImageProps(
  source: SanityImageSource,
  {
    maxWidth = 1200,
    quality = 75,
    aspectRatio,
  }: {
    maxWidth?: number
    quality?: number
    aspectRatio?: number
  } = {}
) {
  const breakpoints = [480, 768, 1024, 1280, 1600]
  const widths = breakpoints.filter(w => w <= maxWidth)
  
  const srcSet = widths
    .map(width => {
      const height = aspectRatio ? Math.round(width / aspectRatio) : undefined
      let builder = urlFor(source)
        .width(width)
        .auto('format')
        .fit('max')
        .quality(quality)
      
      if (height) builder = builder.height(height)
      
      return `${builder.url()} ${width}w`
    })
    .join(', ')
  
  return {
    src: urlFor(source).width(maxWidth).auto('format').fit('max').quality(quality).url(),
    srcSet,
    sizes: `(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw`,
  }
}
