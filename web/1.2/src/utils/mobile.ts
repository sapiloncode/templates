type MobileCommands = 'Logoff' | 'Alarm-Change' | 'Vibrate:sm' | 'Vibrate:md' | 'Vibrate:lg'

export function sendMobileHostCommand(command: MobileCommands) {
  // Check if running in SwiftUI WebView
  if (window.webkit?.messageHandlers?.iosListener) {
    window.webkit.messageHandlers.iosListener.postMessage(command)
    return true
  } else {
    return false
  }
}

export function vibrate(type: 'sm' | 'md' | 'lg') {
  // console.log('vibrate ...')
  // ! Todo: complete this
  if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200]) // Vibrate with a pattern
  } else {
    sendMobileHostCommand(('Vibrate:' + type) as MobileCommands)
  }
}
