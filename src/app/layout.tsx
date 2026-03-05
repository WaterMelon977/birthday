import type { Metadata } from "next";
import { Great_Vibes, Playfair_Display, Lora, Montserrat } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-name",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-body",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Aura's 1st Birthday 🎀",
  description:
    "A cinematic storybook celebrating Aura's first year — every smile, every milestone, every precious family memory.",
  openGraph: {
    title: "Aura's 1st Birthday 🎀",
    description: "Celebrate one magical year with Aura.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${greatVibes.variable} ${playfair.variable} ${lora.variable} ${montserrat.variable} antialiased font-body`}>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
