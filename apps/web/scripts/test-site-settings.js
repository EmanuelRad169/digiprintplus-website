#!/usr/bin/env node

// Test site settings fetcher
import { getSiteSettings } from '../lib/sanity/fetchers.js'

async function testSiteSettings() {
  try {
    console.log('Testing site settings fetcher...')
    const settings = await getSiteSettings()
    
    if (settings) {
      console.log('✅ Site settings fetched successfully!')
      console.log('Title:', settings.title)
      console.log('Description:', settings.description)
      console.log('Logo URL:', settings.logo?.asset?.url)
      console.log('Phone:', settings.contact?.phone)
      console.log('Email:', settings.contact?.email)
      console.log('Address:', settings.contact?.address)
    } else {
      console.log('❌ No site settings found')
    }
  } catch (error) {
    console.error('❌ Error fetching site settings:', error)
  }
}

testSiteSettings()
