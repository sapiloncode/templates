interface WebkitMessageHandlers {
  iosListener: {
    postMessage: (message: string) => void
  }
}

interface Webkit {
  messageHandlers: WebkitMessageHandlers
}

// Extend the global window object to include the webkit property
interface Window {
  webkit: Webkit
  Cypress?: unknown
  store: unknown
  getAppState: () => unknown
}
