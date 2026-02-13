import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "エモい瞬間 | 安心して本音を共有できる場所",
  description: "批判のない、肯定だけの空間。エモいと感じた瞬間の写真や言葉を共有し、みんなで励ましあおう。安心して本音・弱音を発信できる居場所です。",
  keywords: ["エモい", "共感", "SNS", "掲示板", "肯定", "居場所", "本音", "安心"],
  openGraph: {
    title: "エモい瞬間 | 安心して本音を共有できる場所",
    description: "批判のない、肯定だけの空間。エモいと感じた瞬間を共有しよう。",
    type: "website",
    locale: "ja_JP",
    siteName: "エモい瞬間",
  },
  twitter: {
    card: "summary_large_image",
    title: "エモい瞬間 | 安心して本音を共有できる場所",
    description: "批判のない、肯定だけの空間。エモいと感じた瞬間を共有しよう。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
      <GoogleAnalytics gaId="G-N16NKJ69SD" />
    </html>
  );
}

