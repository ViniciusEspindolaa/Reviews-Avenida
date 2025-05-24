import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Toaster } from 'sonner'
import { Orbitron } from 'next/font/google'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['500', '700'], // pode ajustar os pesos que vai usar
})

export const metadata: Metadata = {
  title: "Avenida Reviews",
  description: "Reviews de Games",
  keywords: ["reviews", "games", "jogos", "avaliações"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`bg-black ${orbitron.className}`}>
        <Header />
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
