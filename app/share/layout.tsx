import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shark Puddle",
  description:
    "Shark Puddle business idea pitch platform (demo app for LLMAsAService.io)",
};

export default function ShareLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Link href="/">
        <header className="p-4">
          <div className="flex items-center justify-center">
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
          </div>
        </header>
        </Link>

    <div>{children}</div>

        <footer className="fixed bottom-0 left-0 right-0">
          <div className="flex items-center justify-center">
            <a
              href="https://LLMAsAService.io"
              className="text-blue-500 text-center"
            >
              Built using LLMAsAService.io as an example of how to deploy LLM
              driven applications easily, securely, and cost-effectively
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
