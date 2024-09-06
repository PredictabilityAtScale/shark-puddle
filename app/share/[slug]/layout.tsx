import type { Metadata } from "next";
import "../../globals.css";
import Head from "next/head";
import { GoogleAnalytics } from "@next/third-parties/google";

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
    <>
      <div className="flex justify-center w-full">{children}</div>
      <GoogleAnalytics gaId="G-VR7WPMDJXQ" />
    </>
  );
}
