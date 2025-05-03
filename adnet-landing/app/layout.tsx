import type React from "react"
import { Space_Grotesk } from "next/font/google"
import { useEffect } from "react"
import WalletProvider from "../providers/WalletProvider"
import "./globals.css"

// Initialize the Space Grotesk font
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
})

// Metadata needs to be in a separate variable since we're using 'use client'
const metadata = {
  title: "SoulBoard - Decentralized Advertising Protocol",
  description: "Connect real-world displays with digital advertisers through blockchain technology",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}
