// Navigation types for Sanity CMS-driven navigation

export interface NavigationLink {
  name: string
  href: string
  description?: string
  isVisible?: boolean
  isHighlighted?: boolean
  openInNewTab?: boolean
}

export interface MegaMenuSection {
  sectionTitle: string
  sectionDescription?: string
  links: NavigationLink[]
}

export interface NavigationItem {
  name: string
  href: string
  order: number
  isVisible?: boolean
  openInNewTab?: boolean
  submenu?: NavigationLink[]
  megaMenu?: MegaMenuSection[]
}

export interface NavigationMenu {
  _id: string
  title: string
  items: NavigationItem[]
}
