import testDoc from './testDoc'
import productCategory from './productCategory'
import user from './user'
import quoteRequest from './quoteRequest'
import product from './product'
// import productMinimal from './product-minimal'
import navigationMenu from './navigationMenu'
import page from './page'
import media from './media'
// import components from './components'
// import about from './about'  // Temporarily disabled due to schema issues
import footer from './footer'
import siteSettings from './siteSettings'  // Re-enabled after fixing defineField issues
import template from './template'
import templateCategory from './templateCategory'
import heroSlide from './heroSlide'
import service from './service'
import aboutSection from './aboutSection'
import contactInfo from './contactInfo'
import faqItem from './faqItem'
import ctaSection from './ctaSection'
import quoteSettings from './quoteSettings'
import pageSettings from './pageSettings'
import aboutPage from './aboutPage'
import integrationSettings from './integrationSettings'

export const schemaTypes = [
  // Documents
  testDoc,
  product,
  productCategory,
  quoteRequest,
  user,
  page,
  footer,
  siteSettings,
  template,
  templateCategory,
  heroSlide,
  service,
  aboutSection,
  contactInfo,
  faqItem,
  ctaSection,
  quoteSettings,
  pageSettings,
  aboutPage,
  integrationSettings,
  
  // Singletons/Components
  navigationMenu,
  media,
  // components
]