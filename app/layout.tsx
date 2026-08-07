import type { Metadata } from "next";
import { Manrope, Merienda } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const merienda = Merienda({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-merienda",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Harmonic",
  description: "Find your harmony in community",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${merienda.variable}`}>
      <body>
        <Header />
        {children}
        {modal}
        <Footer />
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
