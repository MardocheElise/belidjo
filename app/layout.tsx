import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import SessionProvider from "@/components/SessionProvider";
import { Toaster } from "@/components/ui/sonner";

// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
// });

// const jetbrainsMono = JetBrains_Mono({
//   variable: "--font-jetbrains-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "🛒 Belidjo", 
//   description: "Belidjo",
// };


export const metadata: Metadata = {
  title: "🛒Belidjo", 
  description: "Belidjo",
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${inter.variable} antialiased`}
      >
        <CartProvider>
          <SessionProvider>
          {children}
          <Toaster />
          </SessionProvider>
        </CartProvider>
      </body>
    </html>
  );
}