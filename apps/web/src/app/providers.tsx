'use client'

import { ReactNode, createContext, useContext, useState, useEffect } from 'react'
import { SanityProvider } from '@/lib/sanityProvider'

// Create a theme context with a default value
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
})

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext)

interface ProvidersProps {
  children: ReactNode
}

// Export as default for modern imports
export default function Providers({ children }: ProvidersProps) {
  // Use state to track the theme preference
  const [theme, setTheme] = useState('light')
  
  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('digiprintplus-theme', newTheme)
      // Apply theme to document
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }
  }
  
  // Initialize theme from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('digiprintplus-theme') || 'light'
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }
  }, [])

  try {
    return (
      <SanityProvider>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          {children}
        </ThemeContext.Provider>
      </SanityProvider>
    )
  } catch (error) {
    console.error('Error in Providers:', error)
    // Return a fallback UI without providers
    return <div className="p-4 text-red-600">
      <h2>Configuration Error</h2>
      <p>Please check your environment variables and try again.</p>
      {children}
    </div>
  }
}

// Also export as named export for backward compatibility
export { Providers }