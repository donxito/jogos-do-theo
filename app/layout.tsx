import type { Metadata } from "next";
import { Nunito, Baloo_2 } from "next/font/google";
import { LangProvider } from "@/lib/LangContext";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const baloo2 = Baloo_2({
  variable: "--font-baloo2",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Jogos do Theo",
  description: "Jogos do Theo - Game hub feito com amor pelo Papi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </head>
      <body
        className={`${nunito.variable} ${baloo2.variable}`}
        suppressHydrationWarning
      >
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
