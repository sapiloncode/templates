// Fallback notification icon as inline SVG data URL to avoid asset resolution issues in library builds
const logoSvg =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#4f46e5"/>
          <stop offset="100%" stop-color="#22c55e"/>
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="12" fill="url(#g)"/>
      <path d="M32 12c-7 0-12 5-12 12v6c0 1-.4 2-1 3l-2 3h30l-2-3c-.6-1-1-2-1-3v-6c0-7-5-12-12-12zm0 36a6 6 0 0 1-6-6h12a6 6 0 0 1-6 6z" fill="#fff"/>
    </svg>`
  )

export interface NotifyArgs {
  title: string
  message: string
}

export function sendNotification(args: NotifyArgs) {
  if (!('Notification' in window)) return
  else if (Notification.permission === 'granted') send(args)
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        send(args)
      }
    })
  }
}

function send({ message, title }: NotifyArgs) {
  new Notification(title, {
    body: message,
    icon: logoSvg,
    // vibrate: [200, 100, 200],
  })
}
