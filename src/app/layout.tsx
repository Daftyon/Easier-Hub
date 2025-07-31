import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EasierHub - The Easier Package Repository',
  description: 'Discover, share, and use packages for the Easier programming language. From mathematical algorithms to proof assistants.',
  keywords: ['easier', 'programming', 'packages', 'repository', 'daftyon', 'morocco'],
  authors: [{ name: 'Ahmed Hafdi' }],
  openGraph: {
    title: 'EasierHub - The Easier Package Repository',
    description: 'The official package repository for Easier programming language',
    url: 'https://easierhub.dev',
    siteName: 'EasierHub',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EasierHub - The Easier Package Repository',
    description: 'The official package repository for Easier programming language',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
