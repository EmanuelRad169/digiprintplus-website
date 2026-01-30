import productCategory from './productCategory'
import user from './user'
import quoteRequest from './quoteRequest'
import product from './product'
import navigationMenu from './navigationMenu'
import page from './page'
import media from './media'
import footer from './footer'
import siteSettings from './siteSettings'
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
import finishingPage from './finishingPage'
import post from './post'
import author from './author'
import category from './category'
import homepageSettings from './homepageSettings'
import faqCategory from './faqCategory'

export const schemaTypes = [
  // Documents
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
  finishingPage,
  homepageSettings,
  faqCategory,
  
  // Blog
  post,
  author,
  category,
  
  // Singletons/Components
  navigationMenu,
  media,
]