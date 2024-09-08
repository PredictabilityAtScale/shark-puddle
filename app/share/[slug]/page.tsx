"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import Head from "next/head";
import type { Metadata, ResolvingMetadata } from 'next'

/*
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
*/

const Page: React.FC<{ params: { slug: string } }> = ({ params }) => {
  Amplify.configure(outputs);

  const router = useRouter();
  const client = generateClient<Schema>();
  const [idea, setIdea] = useState<Schema["Idea"]["type"] | null>(null);

  useEffect(() => {
    if (!params.slug) {
      router.push("/");
      return;
    }

    const ideaid = params.slug;

    if (!ideaid) {
      router.push("/");
      return;
    }

    const fetchIdea = async () => {
      try {
        const result = await client.models.Idea.get({ id: ideaid });
        if (!result || !result.data) {
          router.push("/");
        } else {
          setIdea(result.data as Schema["Idea"]["type"]);
        }
      } catch (error) {
        console.error("error", error);
        router.push("/");
      }
    };

    fetchIdea();
  }, [router]);

  const buildSummaryMarkdown = () => {
    if (!idea) {
      return "loading...";
    }

    return `# Shark Puddle Business Idea Summary
    
## Idea Summary
${idea.ideaSummary}
    
## Customers and Competitors
${idea.customersSummary}

## Value Proposition
${idea.valueSummary}

## Shark Critiques

### Skeptical Shark Says
${idea.skepticalShark}

### Supportive Shark Says
${idea.supportiveShark}

### Constructive Shark Says
${idea.constructiveShark}

---
Construct your own whimsical plan at [Shark Puddle](https://shark-puddle.com).
Built using LLMAsAService.io. [Learn more](https://llmasaservice.io)`;
  };

  return (
    <>
          <Head>
        <title>Shark Puddle</title>
        <meta name="description" content="xxx" />
        <meta property="og:title" content="xxx" />
        <meta property="og:description" content="xxxlatform (demo app for LLMAsAService.io)" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={"//shark-puddle.com/share/" + idea?.id} />
        <meta property="og:image" content="https://shark-puddle.com/sharkpuddlescene.png" />
      </Head>
    <div className="p-1 bg-black min-h-screen w-full">
      <div className="flex flex-col items-center mt-8">
        <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl">
          <p className="text-white">
            <Markdown className="prose prose-sm !max-w-none ">
              {buildSummaryMarkdown()}
            </Markdown>
          </p>
        </div>
      </div>
    </div>
  </>
  );
};

export default Page;


//         <meta property="og:url" content={"//shark-puddle.com/share/" + idea?.id} />
