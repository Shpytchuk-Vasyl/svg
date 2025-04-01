import type React from "react";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { SupabaseProvider } from "@/components/supabase-provider";
import Navigation from "@/components/navigation";
import "./globals.css";
import RegisterServiceWorker from "./register-sw";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "Love You",
  description: "Створюй красиві анімовані SVG",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.svg",
  },
  authors: [{ name: "Vasyl", url: "https://github.com/Shpytchuk-Vasyl" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-background`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SupabaseProvider>
            <main className="flex-1 pb-16">
              <div className="flex flex-col flex-1 h-[calc(100vh-4rem)] container mx-auto px-4 py-6">
                {children}
              </div>
            </main>
            <Navigation />
            <Toaster />
            <RegisterServiceWorker />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
