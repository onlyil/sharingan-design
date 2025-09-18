import type React from 'react'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { Suspense } from 'react'
import { Toaster } from '@/components/ui/sonner'
import Link from 'next/link'
import { Github } from 'lucide-react'

import './globals.css'

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
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <GitHubIcon />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
