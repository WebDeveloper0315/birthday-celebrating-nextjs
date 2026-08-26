import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Birthday Wish",
    template: "%s",
  },
  description: "Create a birthday wish and share it with a link.",
  applicationName: "Birthday Wish",
  authors: [{ name: "Blackghost", url: "https://github.com/WebDeveloper0315" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
