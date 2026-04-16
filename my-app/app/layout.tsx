import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ELI5 - Explain Like I'm 5",
  description: "Understand any technical concept simply, from beginner to expert level",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className={`${inter.className} min-h-full antialiased bg-slate-50`}>
        {children}
      </body>
    </html>
  );
}
