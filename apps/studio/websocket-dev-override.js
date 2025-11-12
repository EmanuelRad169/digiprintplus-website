// Development-specific configuration to suppress WebSocket warnings
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Override WebSocket constructor to handle connection issues gracefully
  const OriginalWebSocket = window.WebSocket
  
  window.WebSocket = class extends OriginalWebSocket {
    constructor(url, protocols) {
      super(url, protocols)
      
      // Add error handling for WebSocket connections
      this.addEventListener('error', (event) => {
        console.info('ℹ️ WebSocket connection issue (non-critical for studio functionality)')
        // Prevent the error from bubbling up
        event.stopPropagation()
      })
      
      this.addEventListener('close', (event) => {
        if (event.code !== 1000) { // 1000 is normal closure
          console.info('ℹ️ WebSocket connection closed (studio will continue to function normally)')
        }
      })
    }
  }
  
  // Suppress specific console warnings
  const originalConsoleWarn = console.warn
  console.warn = (...args) => {
    const message = args.join(' ')
    if (
      message.includes('WebSocket connection to') ||
      message.includes('socket/development') ||
      message.includes('WebSocket is closed before the connection is established')
    ) {
      // Replace with a less alarming message
      console.info('ℹ️ Real-time collaboration features temporarily unavailable (studio fully functional)')
      return
    }
    originalConsoleWarn.apply(console, args)
  }
}
