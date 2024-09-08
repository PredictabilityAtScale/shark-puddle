import type { Metadata } from "next";
import "../../globals.css";
import Head from "next/head";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  metadataBase: new URL('https://shark-puddle.com'),
  title: "Shark Puddle",
  description:
    "Shark Puddle business idea pitch platform (demo app for LLMAsAService.io)",
    openGraph: {
      title: "Shark Puddle",
      description:
        "Shark Puddle business idea pitch platform (demo app for LLMAsAService.io)",
      type: "website",
      url: "https://shark-puddle.com",
      images: 
        "/sharkpuddlescene.png"
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex justify-center w-full">{children}</div>
      <GoogleAnalytics gaId="G-VR7WPMDJXQ" />
    </>
  );
}
