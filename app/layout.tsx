import type React from 'react'
import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { Suspense } from 'react'
import { Toaster } from '@/components/ui/sonner'
import Link from 'next/link'
import { Github } from 'lucide-react'
import StructuredData from './structured-data'
import { SITE_URL } from '@/constants/urls'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Sharingan Designer - Create Mangekyo Sharingan Eye Patterns',
    template: '%s | Sharingan Designer',
  },
  description:
    'Create custom Mangekyo Sharingan eye patterns inspired by Naruto anime. Free online design tool with bezier curve editor, symmetry controls, and real-time preview.',
  keywords: [
    'sharingan designer',
    'mangekyo sharingan',
    'naruto eye designer',
    'anime eye creator',
    'sharingan generator',
    'uchiha sharingan',
    'naruto shippuden',
    'anime character creator',
    'eye pattern design',
    'symmetrical design tool',
    'bezier curve editor',
    'online drawing tool',
    'anime art generator',
  ],
  authors: [{ name: 'onlyil', url: 'https://github.com/onlyil' }],
  creator: 'onlyil',
  publisher: 'onlyil',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Sharingan Designer',
    title: 'Sharingan Designer - Create Mangekyo Sharingan Eye Patterns',
    description:
      'Create custom Mangekyo Sharingan eye patterns inspired by Naruto anime. Free online design tool with bezier curve editor, symmetry controls, and real-time preview.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sharingan Designer - Create Mangekyo Sharingan Eye Patterns',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sharingan Designer - Create Mangekyo Sharingan Eye Patterns',
    description:
      'Create custom Mangekyo Sharingan eye patterns inspired by Naruto anime. Free online design tool.',
    images: ['/og-image.png'],
    creator: '@onlyil_dev',
    site: '@onlyil_dev',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: 'technology',
  classification: 'Design Tool',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  colorScheme: 'dark light',
}

function GitHubIcon() {
  return (
    <Link
      href="https://github.com/onlyil/sharingan-design"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-4 left-4 z-50 p-3 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/30 hover:border-white/20 transition-all duration-300 hover:scale-110 group">
      <Github
        size={14}
        className="text-white/80 group-hover:text-white transition-colors duration-300"
      />
      <span className="sr-only">View on GitHub</span>
    </Link>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className="dark"
      itemScope
      itemType="https://schema.org/WebApplication">
      <head>
        <StructuredData />
      </head>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}
        itemProp="mainContentOfPage">
        <GitHubIcon />
        <main>
          <Suspense fallback={null}>{children}</Suspense>
        </main>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
