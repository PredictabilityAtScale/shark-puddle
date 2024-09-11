"use client";
import { useLLM } from "llmasaservice-client";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useRouter } from "next/navigation";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const Page: React.FC = () => {
  const router = useRouter();
  const client = generateClient<Schema>();

  const [ideaText, setIdeaText] = useState("");
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
        if (!result || !result.data) {
          router.push("/");
        } else {
          setIdea(result.data as Schema["Idea"]["type"]);
          setIdeaText(result.data.idea ?? "");
        }
      } catch (error) {
        router.push("/");
      }
    };

    fetchIdea();


  }, []);

  const { response, idle, send } = useLLM({
    project_id: process.env.NEXT_PUBLIC_PROJECT_ID,
    customer: {
      customer_id: idea?.email ?? "",
      customer_name: idea?.email ?? "",
    },
  });

  const handleIdeaTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setIdeaText(event.target.value);
  };

  const handleSubmit = () => {
    const prompt = `An entrepreneur is pitching you a business idea (refer to them in the first person "you"). You have asked them to explain their idea which is included below. 
    Summarize their idea in 1-3 sentences and end with a "You are like [product or company] but for [new idea purpose]." (if one wasn&#39;t given to you). 
    Do not add any preamble, or other response; JUST summarize and restate their idea.
    
    Idea: "${ideaText}."`;

    send(prompt);
  };

  const handleConfirm = async () => {
    await client.models.Idea.update({
      id: idea?.id ?? "",
      idea: ideaText,
      ideaSummary:
        response && response.length > 0 ? response : idea?.ideaSummary,
    });

    router.push("/plan");
  };

  const handleSillyIdea = async () => {
    const idea = await send(
      "{{create_silly_idea}}",
      [],
      false,
      false
    );
    setIdeaText(idea);
  };

  return (
    <div className="p-1 bg-black min-h-screen w-full">
      <div className="flex flex-col items-center mt-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Step 1 - Tell Puddle Shark About Your Idea
        </h2>
        <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl">
          <div className="mb-4">
            <div className="flex items-center mb-4">
              <img
                src="sharkpuddle.png"
                alt="Shark Puddle Icon"
                className="w-11 h-11 mr-2"
              />

              <p className="text-gray-300">
                <strong>Puddle Shark: </strong> Nice to meet you. Tell me your
                idea?
              </p>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center mb-4">
              <img
                src="goldfish.png"
                alt="Goldfish Icon"
                className="w-11 h-11 mr-2"
              />{" "}
              <p className="text-gray-300">
                <strong>You: </strong> Enter your idea here...
              </p>
            </div>
            <textarea
              className="w-full p-4 border border-gray-600 rounded bg-gray-700 text-white"
              rows={3}
              value={ideaText}
              onChange={handleIdeaTextChange}
              placeholder="Enter your idea here..."
            />
          </div>
          <div className="flex justify-between">
            <button
              className={`px-3 py-1 mr-2 rounded hover:bg-blue-700 ${
                !idle || ideaText.length === 0
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-yellow-700"
              }`}
              onClick={handleSubmit}
              disabled={!idle || ideaText.length === 0}
            >
              Submit
            </button>
            <button
              className={`px-3 py-1 rounded ml-auto ${
                !idle
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-yellow-600 text-white hover:bg-yellow-700"
              }`}
              onClick={handleSillyIdea}
              disabled={!idle}
            >
              {idle ? "Silly random idea" : "Thinking..."}
            </button>
          </div>
        </div>
        {(response.length > 0 ||
          (idea?.ideaSummary && idea?.ideaSummary.length > 0)) && (
          <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl mt-8">
            <div className="mb-4">
              <div className="mb-4 flex items-center">
                <img
                  src="sharkpuddle.png"
                  alt="Shark Puddle Icon"
                  className="w-11 h-11 mr-2"
                />

                <p className="text-gray-300">
                  <strong>Puddle Shark:</strong> OK, let me summarize what you
                  said. Did I understand you?
                  <br />
                </p>
              </div>
              <div className="text-white">
                <Markdown className="prose prose-sm !max-w-none">
                  {response.length > 0
                    ? response
                    : idea?.ideaSummary && idea?.ideaSummary.length > 0
                    ? idea?.ideaSummary
                    : ""}
                </Markdown>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2"
                onClick={handleConfirm}
              >
                Yes, that&apos;s it &gt;
              </button>
              No, let me try again (edit you idea above and click Submit again)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
