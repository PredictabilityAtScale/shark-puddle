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

        <div className="flex justify-center w-full">
          <div className="flex justify-center w-full max-w-6xl">
            <nav className="w-1/4 p-4 bg-black text-white">
              <br />
              <br />
              <h4 className="text-lg mb-4">Shark Puddle Arena Steps</h4>
              <ul className="list-none">
                <li className="mb-2">
                  <Link
                    href="/idea"
                    className="text-gray-400 hover:text-white"
                  >
                    1. The Idea
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    href="/customers"
                    className="text-gray-400 hover:text-white"
                  >
                    2. Customers & competitors
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    href="/value"
                    className="text-gray-400 hover:text-white"
                  >
                    3. Unique value prop
                  </Link>
                </li>
               
                <li className="mb-2">
                  <Link
                    href="/sharks"
                    className="text-gray-400 hover:text-white"
                  >
                    4. Shark critiques
                  </Link>
                </li>

                <li className="mb-2">
                  <Link
                    href="/summary"
                    className="text-gray-400 hover:text-white"
                  >
                    5. Summary & Share your pitch
                  </Link>
                </li>
              </ul>

              <h4 className="text-lg mt-4 mb-4">About this site</h4>
              <Link href="https://llmasaservice.io" className="text-gray-400 hover:text-white">Built using...</Link>
            </nav>
            <div className="w-2/3 p-4">{children}</div>
          </div>
        </div>

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
