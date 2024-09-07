import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shark Puddle",
  description:
    "Shark Puddle business idea pitch platform (demo app for LLMAsAService.io)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <Head>
        <title>Shark Puddle - Construct Your Plan</title>
        <meta
          name="description"
          content="Construct your own whimsical plan at Shark Puddle. Built using LLMAsAService.io."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="Shark Puddle - Construct Your Plan"
        />
        <meta
          property="og:description"
          content="Construct your own whimsical plan at Shark Puddle. Built using LLMAsAService.io."
        />
        <meta property="og:url" content="//shark-puddle.com" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="//shark-puddle.com/sharkpuddlescene.png"
        />
      </Head>
      <body className="dark">

        <a href="/">
          <header className="flex flex-col items-center p-4">
            
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
                
              </div>
            
          </header>
        </a>

        <div className="flex justify-center w-full">{children}</div>
      </body>
      <GoogleAnalytics gaId="G-VR7WPMDJXQ" />
    </html>
  );
}
