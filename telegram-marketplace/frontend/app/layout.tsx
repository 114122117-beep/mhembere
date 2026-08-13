import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Telegram Marketplace',
  description: 'Real-time messaging with integrated marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
