import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ThemeColor from "@/src/components/theme-color";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find the Impostor",
  description:
    "A multiplayer word association party game powered by AI. Find the impostors who don’t know the secret word.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#07090a" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
      >
        <ThemeColor />
        <NextIntlClientProvider> {children}</NextIntlClientProvider>
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
