"use client";
import { useLLM } from "llmasaservice-client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const Page: React.FC = () => {
  const router = useRouter();
  const client = generateClient<Schema>();
  const [idea, setIdea] = useState<Schema["Idea"]["type"] | null>(null);

  useEffect(() => {
    const ideaid = localStorage.getItem("sp-idea-id") ?? "";
    if (!ideaid) {
      router.push("/");
      return;
    }
    const fetchIdea = async () => {
      try {
        const result = await client.models.Idea.get({ id: ideaid });
        console.log("result", result);
        if (!result || !result.data) {
          router.push("/");
        } else {
          setIdea(result.data as Schema["Idea"]["type"]);
        }
      } catch (error) {
        router.push("/");
      }
    };

    fetchIdea();
  }, []);

  const buildSummaryMarkdown = () => {
    if (!idea) {
      return "Iterate through the steps to generate a summary.";
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

  const handleShareLink = () => {
    const shareUrl =
      window.location.href.replace("summary", "share") + "/" + idea?.id;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  const handleShareLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      "https://shark-puddle.com/share/" + idea?.id
    )}`;
    window.open(shareUrl, "_blank");
  };

  const handleShareEmail = () => {
    const shareUrl = `mailto:?subject=Check out my Shark Puddle pitch&body=I just created a business pitch on Shark Puddle. Check it out: https://shark-puddle.com/share/${idea?.id}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <>
      <div className="p-1 bg-black min-h-screen w-full">
        <div className="flex flex-col items-center mt-8">
          <div className="mt-4 flex space-x-4 p-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleShareLink}
            >
              Share via Link
            </button>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleShareLinkedIn}
            >
              Share via LinkedIN
            </button>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleShareEmail}
            >
              Share via Email
            </button>
          </div>

          <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl">
            <p className="text-white">
              <Markdown className="prose prose-sm !max-w-none dark:prose-invert">
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
