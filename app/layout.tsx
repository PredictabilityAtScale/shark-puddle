import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://shark-puddle.com"),
  title: "Shark Puddle",
  description:
    "Shark Puddle business idea pitch platform (demo app for LLMAsAService.io)",
  openGraph: {
    title: "Shark Puddle",
    description:
      "Shark Puddle business idea pitch platform (demo app for LLMAsAService.io)",
    type: "website",
    url: "https://shark-puddle.com",
    images: "/sharkpuddlescene.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark">
        <header className="flex flex-col items-center p-4">
          <a href="/">
            <div>
              <Image
                src="/sharkpuddlescene.png"
                alt="Shark Puddle Logo"
                width={600}
                height={400}
              />
            </div>
            <div className="flex flex-col items-center p-4">
              <h3 className="text-2xl font-bold">Welcome to Shark Puddle</h3>
              <div className="mt-4"><a href="https://www.producthunt.com/posts/shark-puddle?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-shark&#0045;puddle" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=489253&theme=neutral" alt="Shark&#0032;Puddle - Pitch&#0032;your&#0032;business&#0047;startup&#0032;idea&#0032;to&#0032;a&#0032;panel&#0032;of&#0032;Puddle&#0032;Sharks | Product Hunt"  style={{ width: '250px', height: '54px' }} width="250" height="54" /></a></div>
            </div>
          </a>
        </header>

        <div className="flex justify-center w-full">{children}</div>
        
      </body>
      <GoogleAnalytics gaId={`${process.env.NEXT_PUBLIC_GTAG}`} />
    </html>
  );
}
