import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Image from "next/image";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";

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
    <>
      <body className={inter.className}>
        <a href="/">
          <header className="p-4">
            <div className="flex items-center justify-center">
              <div className="mr-4">
                <Image
                  src="/sharkpuddlescene.png"
                  alt="Shark Puddle Logo"
                  width={200}
                  height={100}
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Welcome to Shark Puddle</h3>
                <p className="text-lg text-gray-600">
                  pitch your business idea to friendly (or not) investors
                  <br />
                  Just like Shark Tank but way more fun and interactive
                </p>
              </div>
            </div>
          </header>
        </a>

        <div className="flex justify-center w-full">
          <div className="flex justify-center w-full ">
            <nav className="hidden md:block w-1/4 p-4 bg-black text-white">
              <br />
              <br />
              <ul className="list-none">
                <li className="mb-2">
                  <a href="/" className="text-gray-400 hover:text-white">
                    Home (start new pitch)
                  </a>
                </li>
              </ul>
              <h4 className="text-lg mb-4">Shark Puddle Arena Steps</h4>
              <ul className="list-none">
                <li className="mb-2">
                  <Link href="/idea" className="text-gray-400 hover:text-white">
                    1. The Idea
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="/plan" className="text-gray-400 hover:text-white">
                    2. The Pitch
                  </Link>
                </li>

                <li className="mb-2">
                  <Link
                    href="/sharks"
                    className="text-gray-400 hover:text-white"
                  >
                    3. Shark Puddle Arena
                  </Link>
                </li>

                <li className="mb-2">
                  <Link
                    href="/summary"
                    className="text-gray-400 hover:text-white"
                  >
                    4. Summary & Share your pitch
                  </Link>
                </li>
              </ul>

              <h4 className="text-lg mt-4 mb-4">About</h4>
              <ul className="list-none">
                <li className="mb-2">
                  <Link
                    href="/howthisworks"
                    className="text-gray-400 hover:text-white"
                  >
                    How this works...
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    href="https://llmasaservice.io"
                    className="text-gray-400 hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Try LLMAsAService.io
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    href="mailto:help@heycasey.io"
                    className="text-gray-400 hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact us
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    href="https://github.com/PredictabilityAtScale/shark-puddle"
                    className="text-gray-400 hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source code (Github repo)
                  </Link>
                </li>
                <li className="mb-2">
                  <div className="flex space-x-4">
                    <div>Share via: </div>
                    <Link
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        "https://shark-puddle.com"
                      )}`}
                      className="text-gray-400 hover:text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        width={22}
                        height={22}
                        src="/linkedinlogowhite.png"
                        alt="Share via LinkedIN"
                      />
                    </Link>

                    <Link
                      href="mailto:?subject=Check out Shark Puddle - Business Idea Feedback Tool&body=Check out shark-puddle.com: https://shark-puddle.com"
                      className="text-gray-400 hover:text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        width={22}
                        height={22}
                        src="/emailiconwhite2.png"
                        alt="Share via email"
                      />
                    </Link>
                  </div>
                </li>{" "}
                <li className="mb-2">
                  <div className="mt-4">
                    <a
                      href="https://www.producthunt.com/posts/shark-puddle?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-shark&#0045;puddle"
                      target="_blank"
                    >
                      <img
                        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=489253&theme=neutral"
                        alt="Shark&#0032;Puddle - Pitch&#0032;your&#0032;business&#0047;startup&#0032;idea&#0032;to&#0032;a&#0032;panel&#0032;of&#0032;Puddle&#0032;Sharks | Product Hunt"
                        style={{ width: "250px", height: "54px" }}
                        width="250"
                        height="54"
                      />
                    </a>
                  </div>
                </li>
              </ul>
            </nav>
            <div className="w-full md:w-2/3 p-4">{children}</div>
          </div>
        </div>
      </body>
      <GoogleAnalytics gaId={`${process.env.NEXT_PUBLIC_GTAG}`} />
    </>
  );
}
