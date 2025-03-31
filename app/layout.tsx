import type React from "react";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { SupabaseProvider } from "@/components/supabase-provider";
import Navigation from "@/components/navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SVG для тебе",
  description: "Створюй красиві анімовані SVG для себе",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
  worker,
}: {
  children: React.ReactNode;
  worker?: React.ReactNode;
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
            {worker}
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
