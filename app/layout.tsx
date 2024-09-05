import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

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
      <body className={inter.className}>
        <header className="p-4">
          <div className="flex items-center justify-center">
            <Link href="/">
              <div className="mr-4">
                <Image
                  src="/sharkpuddle.png"
                  alt="Shark Puddle Logo"
                  width={100}
                  height={100}
                />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Welcome to Shark Puddle</h1>
                <p className="text-lg text-gray-600">
                  pitch your business plan to a friendly (or not) investor
                  <br />
                  Just like Shark Tank but way more fun and interactive
                </p>
              </div>
            </Link>
          </div>
        </header>

        <div className="flex justify-center w-full">{children}</div>
      </body>
    </html>
  );
}
