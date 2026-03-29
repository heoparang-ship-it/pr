import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { Toaster } from "sonner"
import "./globals.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
}

export const metadata: Metadata = {
  title: {
    default: "Artful — 당신의 음악, 하나의 링크로",
    template: "%s | Artful",
  },
  description:
    "뮤지션을 위한 포트폴리오 플랫폼. 작품을 업로드하고 링크 하나로 공유하세요.",
  keywords: ["포트폴리오", "뮤지션", "음악", "아티스트", "링크트리", "linktree"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Artful",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="dark">
      <body className={`${geistSans.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Toaster theme="dark" position="bottom-center" />
      </body>
    </html>
  )
}
