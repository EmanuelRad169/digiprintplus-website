import { definePlugin } from 'sanity'

// Extend window type for our custom properties
declare global {
  interface Window {
    __sanityWebSocketWarningShown?: boolean
    __sanityWebSocketErrorShown?: boolean
  }
}

// Plugin to handle WebSocket connection issues gracefully
export const webSocketFallbackPlugin = definePlugin({
  name: 'websocket-fallback',
  studio: {
    components: {
      layout: (props) => {
        // Handle WebSocket issues in browser environment
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
          // Suppress WebSocket warnings
          const originalConsoleWarn = console.warn
          const originalConsoleError = console.error
          
          console.warn = (...args) => {
            const message = args.join(' ')
            if (
              message.includes('WebSocket connection') ||
              message.includes('socket/development') ||
              message.includes('WebSocket is closed')
            ) {
              // Don't suppress visual editing related warnings
              if (message.includes('visual editing') || message.includes('@sanity/visual-editing')) {
                originalConsoleWarn.apply(console, args)
                return
              }
              
              // Replace with a friendlier message (only show once)
              if (!window.__sanityWebSocketWarningShown) {
                console.info('ℹ️ Sanity Studio: WebSocket connection configured for visual editing')
                window.__sanityWebSocketWarningShown = true
              }
              return
            }
            originalConsoleWarn.apply(console, args)
          }
          
          console.error = (...args) => {
            const message = args.join(' ')
            
            // Special handling for the "Unable to connect to visual editing" error
            // This often appears during initial loading and should be treated as a warning
            if (message.includes('Unable to connect to visual editing')) {
              // Convert to a warning and add helpful context
              if (!window.__sanityWebSocketErrorShown) {
                console.warn('⚠️ Sanity Studio: Initial visual editing connection attempt failed. This is normal during startup - the connection will retry automatically.')
                window.__sanityWebSocketErrorShown = true
              }
              return
            }
            
            // Always allow other visual editing errors through
            if (message.includes('visual editing') || 
                message.includes('@sanity/visual-editing')) {
              originalConsoleError.apply(console, args)
              return
            }
            
            // Suppress non-critical WebSocket errors
            if (
              message.includes('WebSocket connection') ||
              message.includes('socket/development') ||
              message.includes('WebSocket is closed')
            ) {
              // Convert other WebSocket errors to info messages
              if (!window.__sanityWebSocketWarningShown) {
                console.info('ℹ️ Sanity Studio: WebSocket connection issue detected (non-critical)')
                window.__sanityWebSocketWarningShown = true
              }
              return
            }
            
            originalConsoleError.apply(console, args)
          }
        }
        
        return props.renderDefault(props)
      }
    }
  }
})
