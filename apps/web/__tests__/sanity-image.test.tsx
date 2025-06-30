import { render, screen } from '@testing-library/react'
import { SanityImage, SanityHeroImage, SanityProductImage } from '@/components/ui/sanity-image'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage(props: any) {
    return <img {...props} />
  },
}))

// Mock Sanity image URL builder
jest.mock('@/lib/sanity/image', () => ({
  getOptimizedImageProps: jest.fn(() => ({
    src: 'https://example.com/image.webp',
    width: 400,
    height: 300,
  })),
  getResponsiveImageProps: jest.fn(() => ({
    src: 'https://example.com/image.webp',
    srcSet: 'https://example.com/image-480.webp 480w, https://example.com/image-768.webp 768w',
    sizes: '(max-width: 768px) 100vw, 50vw',
  })),
}))

const mockSanityImage = {
  asset: {
    _id: 'image-123',
    url: 'https://cdn.sanity.io/images/abc123/production/image.jpg',
  },
  alt: 'Test image',
}

describe('SanityImage Components', () => {
  describe('SanityImage', () => {
    it('renders with basic props', () => {
      render(
        <SanityImage
          src={mockSanityImage}
          alt="Test image"
          width={400}
          height={300}
        />
      )
      
      const image = screen.getByAltText('Test image')
      expect(image).toBeInTheDocument()
    })

    it('renders nothing when src is empty', () => {
      const { container } = render(
        <SanityImage
          src={null as any}
          alt="Test image"
          width={400}
          height={300}
        />
      )
      
      expect(container.firstChild).toBeNull()
    })

    it('applies custom className', () => {
      render(
        <SanityImage
          src={mockSanityImage}
          alt="Test image"
          width={400}
          height={300}
          className="custom-class"
        />
      )
      
      const image = screen.getByAltText('Test image')
      expect(image).toHaveClass('custom-class')
    })
  })

  describe('SanityHeroImage', () => {
    it('renders with priority and responsive settings', () => {
      render(
        <SanityHeroImage
          src={mockSanityImage}
          alt="Hero image"
        />
      )
      
      const image = screen.getByAltText('Hero image')
      expect(image).toBeInTheDocument()
    })
  })

  describe('SanityProductImage', () => {
    it('renders with product-specific dimensions', () => {
      render(
        <SanityProductImage
          src={mockSanityImage}
          alt="Product image"
        />
      )
      
      const image = screen.getByAltText('Product image')
      expect(image).toBeInTheDocument()
    })
  })
})
