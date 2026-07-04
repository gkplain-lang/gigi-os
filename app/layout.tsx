import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import { AppShell } from "@/components/ui/AppShell";
import { GigiProvider } from "@/components/providers/GigiProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { PRODUCT_NAME, PRODUCT_TAGLINE, PRODUCT_DESCRIPTION } from "@/lib/branding";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: `${PRODUCT_NAME} — ${PRODUCT_TAGLINE}`,
  description: PRODUCT_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full">
        <GigiProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </GigiProvider>
      </body>
    </html>
  );
}
