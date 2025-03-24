import type React from "react"
import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/hooks/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"

const outfit = Outfit({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "ArtCampus - Платформа студенческих проектов",
  description: "Публикация и обсуждение культурных и художественных проектов студентов",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={outfit.className}>
        <ThemeProvider defaultTheme="light">
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'