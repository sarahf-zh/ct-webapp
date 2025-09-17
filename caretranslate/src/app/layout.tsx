import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import { GeistSans } from 'geist/font/sans'; // 1. Import from the 'geist' package
import { GeistMono } from 'geist/font/mono'; // 2. Import from the 'geist' package
import "./globals.css";

/*
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
*/


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
