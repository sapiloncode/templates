import '@/styles/globals.scss'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: 'Your Website',
  description: 'A simple and modern website template',
  viewport: { width: 'device-width', initialScale: 1 },
  openGraph: {
    type: 'website',
  },
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
