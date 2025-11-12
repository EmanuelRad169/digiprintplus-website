
export interface HeroSlide {
  _id: string
  title: string
  subtitle: string
  description: string
  ctaText: string
  ctaLink: string
  stats: { number: string; text: string }
  features: string[]
  order: number
  isActive: boolean
  image?: {
    asset?: { url: string }
    alt?: string
  }
}
