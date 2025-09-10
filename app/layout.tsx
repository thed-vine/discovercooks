import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Suspense } from "react"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
})

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
    <html lang="en" className={montserrat.className}>
      <body className="">
        <Suspense fallback={<div>Loading...</div>}>
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
          <div className="w-[432px] h-[936px] bg-white rounded-3xl shadow-2xl overflow-hidden relative">{children}</div>
          <BottomNavigation />
        </div>
        </Suspense>
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
