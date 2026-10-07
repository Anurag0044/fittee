import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fittee — Wear Your Culture With Pride | Tribal Roots, Modern Wear",
  description:
    "Contemporary apparel inspired by the tribal art and spirit of Jharkhand. Authentic Sohrai and Khovar folk art reimagined for modern streetwear.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans bg-[#0E130D] text-[#FAF7F2]">
        {children}
      </body>
    </html>
  );
}
