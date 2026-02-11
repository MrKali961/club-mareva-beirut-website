import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: 'Club Mareva Beirut | Premium Cigar Lounge',
    template: '%s | Club Mareva Beirut'
  },
  description: 'A sanctuary that ignites the senses. Premium cigars, rare whiskies, and exclusive events in Jal El Dib, Beirut, Lebanon.',
  keywords: ['cigar lounge', 'beirut', 'lebanon', 'whisky tasting', 'premium cigars', 'habanos', 'club mareva', 'cigar bar'],
  authors: [{ name: 'Club Mareva Beirut' }],
  openGraph: {
    title: 'Club Mareva Beirut | Premium Cigar Lounge',
    description: 'A sanctuary that ignites the senses. Premium cigars, rare whiskies, and exclusive events.',
    url: 'https://clubmarevabeirut.com',
    siteName: 'Club Mareva Beirut',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Club Mareva Beirut',
    description: 'Premium Cigar Lounge & Whisky Bar in Beirut',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} antialiased bg-black text-white`}
      >
        <SmoothScroll />
        <div className="relative z-[1] bg-black min-h-screen lg:mb-[100vh]">
          <Navigation />
          <main>{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
