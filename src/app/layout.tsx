import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider, CartDrawer } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Yeniliko - 3D Tasarım & Üretim",
    template: "%s | Yeniliko"
  },
  description: "3D yazıcı teknolojisi ile kaliteli ürünler. Özel tasarım ve hızlı üretim hizmetleri. Aksesuarlar, dekorasyon, ofis ürünleri ve daha fazlası.",
  keywords: ["3D baskı", "3D tasarım", "özel üretim", "aksesuarlar", "dekorasyon", "ofis ürünleri"],
  authors: [{ name: "Yeniliko" }],
  creator: "Yeniliko",
  publisher: "Yeniliko",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://yeniliko.com",
    title: "Yeniliko - 3D Tasarım & Üretim",
    description: "3D yazıcı teknolojisi ile kaliteli ürünler. Özel tasarım ve hızlı üretim hizmetleri.",
    siteName: "Yeniliko",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yeniliko - 3D Tasarım & Üretim",
    description: "3D yazıcı teknolojisi ile kaliteli ürünler. Özel tasarım ve hızlı üretim hizmetleri.",
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
