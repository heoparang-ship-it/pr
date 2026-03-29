import type { Metadata } from "next"
import localFont from "next/font/local"
import { Toaster } from "sonner"
import "./globals.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Artful — 당신의 음악, 하나의 링크로",
  description:
    "뮤지션을 위한 포트폴리오 플랫폼. 작품을 업로드하고 링크 하나로 공유하세요.",
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
