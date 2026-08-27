import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistPixelSquare } from "geist/font/pixel";
import "@fontsource-variable/google-sans";
import "./globals.css";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OpenMerge - AI PR Review Agents",
  description:
    "Parallel AI code review agents that inspect pull requests, flag issues, and prepare merge-ready summaries.",
  icons: {
    icon: "/openmerge/logo.png",
    shortcut: "/openmerge/logo.png",
    apple: "/openmerge/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(ibmPlexMono.variable, GeistSans.variable, GeistPixelSquare.variable)}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
