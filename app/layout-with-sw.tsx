import type React from "react"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { SupabaseProvider } from "@/components/supabase-provider"
import Navigation from "@/components/navigation"
import RegisterServiceWorker from "./register-sw"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SVG Generator",
  description: "Generate beautiful SVG images with AI",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SupabaseProvider>
            <main className="flex-1 pb-16">{children}</main>
            <Navigation />
            <Toaster />
            <RegisterServiceWorker />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

