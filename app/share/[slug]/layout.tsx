
import { Metadata, ResolvingMetadata } from "next";
import "../../globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";


 
export const generateMetadata = async (
  { params }: { params: { slug: string } },
): Promise<Metadata> => {
  const id = params.slug;

  return {
    metadataBase: new URL('https://shark-puddle.com'),
    title: "Shark Puddle",
    description:
      "Shark Puddle business idea pitch platform (demo app for LLMAsAService.io)",
      openGraph: {
        title: "Shark Puddle",
        description:
          "Shark Puddle business idea pitch platform (demo app for LLMAsAService.io)",
        type: "website",
        url: `https://shark-puddle.com/${id}`,
        images: 
          "https://shark-puddle.com/sharkpuddlescene.png"
      },
  }
}


export default function Layout({
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
