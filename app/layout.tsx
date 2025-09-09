import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "DiscoverCooks",
  description: "DiscoverCooks - Where cooking meets community",
  generator: "DiscoverCooks",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="min-h-screen pb-16">{children}</div>
          <BottomNavigation />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
