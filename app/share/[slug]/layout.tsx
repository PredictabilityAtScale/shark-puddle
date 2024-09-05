import type { Metadata } from "next";
import "../../globals.css";

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
      <div>{children}</div>
  );
}
