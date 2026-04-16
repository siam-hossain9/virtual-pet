import type { Metadata } from "next";
import { Fredoka, Nunito, Orbitron, Bubblegum_Sans } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bubblegum = Bubblegum_Sans({
  variable: "--font-bubblegum",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Petverse — Your Digital Companion Awaits",
  description:
    "An immersive 3D anime-style virtual pet companion. Adopt, nurture, and bond with your own digital friend. Watch them grow, evolve, and remember you.",
  keywords: "virtual pet, tamagotchi, digital companion, anime, interactive",
  openGraph: {
    title: "Petverse — Your Digital Companion Awaits",
    description:
      "Adopt and nurture your own anime-style virtual pet companion.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${nunito.variable} ${orbitron.variable} ${bubblegum.variable}`}
    >
      <head>
        <meta name="theme-color" content="#1A1625" />
      </head>
      <body className="min-h-screen">
        <div className="bg-starfield" />
        <div className="bg-gradient-overlay" />
        {children}
      </body>
    </html>
  );
}
