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
  const [valueText, setValueText] = useState("");

  useEffect(() => {
    const ideaid = localStorage.getItem("sp-idea-id") ?? "";
    if (!ideaid) {
      router.push("/");
      return;
    }

    console.log("ideaid", ideaid);

    const fetchIdea = async () => {
      try {
        const result = await client.models.Idea.get({ id: ideaid });
        console.log("result", result);
        if (!result || !result.data) {
          router.push("/");
        } else {
          setIdea(result.data as Schema["Idea"]["type"]);
          setValueText(result.data.value ?? "");
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

  const {
    response: suggestResponse,
    idle: suggestIdle,
    send: suggestSend,
  } = useLLM({
    project_id: process.env.NEXT_PUBLIC_PROJECT_ID,
    customer: {
      customer_id: idea?.email ?? "",
      customer_name: idea?.email ?? "",
    },
  });

  const handleValueTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setValueText(event.target.value);
  };

  const handleSubmit = () => {
    const prompt = `An entrepreneur is pitching you a business idea (refer to them in the first person "you"). You have asked them to explain their idea, customer/competitors and a starting unique value proposition which are included below. 
    
    1. Summarize and augment their unique value proposition.  
    2. Create a list of assumptions that these value propositions are compelling and important to the customers.
    
    Do not add any other response other than summarizing and augmenting their value proposition and then the assumption list.

Idea: "${idea?.ideaSummary}."

Ideal Customers and competitors: "${idea?.customersSummary}."

Value proposition by entrepreneur: "${valueText}."`;

    send(prompt);
  };

  const handleConfirm = async () => {
    await client.models.Idea.update({
      id: idea?.id ?? "",
      value: valueText.length > 0 ? valueText : suggestResponse,
      valueSummary:
        response && response.length > 0 ? response : idea?.valueSummary,
    });

    router.push("/sharks");
  };

  const handleCreateValueProp = async () => {
    setValueText("");

    suggestSend(
      `Analyze the following business idea, customers and competitors and create unique value propositions for the idea. Use simple text formatting, no markdown or special characters.
      
Idea: "${idea?.ideaSummary}."

Ideal Customers and competitors: "${idea?.customersSummary}."`,
      [],
      true,
      true,
      null,
      new AbortController(),
      (response: string) => {
        setValueText(response);
      }
    );
  };

  return (
    <div className="p-1 bg-black min-h-screen w-full">
      <div className="flex flex-col items-center mt-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Step 3 - Tell Puddle Shark About Your Unique Value Proposition
        </h2>
        <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl">
          <div className="mb-4">
            <div className="flex items-center">
              <img
                src="sharkpuddle.png"
                alt="Shark Puddle Icon"
                className="w-11 h-11 mr-2"
              />

              <p className="text-gray-300">
                <strong>Puddle Shark: </strong> OK, given your customers and
                competitors, tell me what YOUR unique value proposition is. What
                will make you more valuable than your competitors to your
                customers?
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
                <strong>You: </strong> Enter your ideas unique value proposition here...Why will your customers choose you over your competitors?
              </p>
            </div>
            <textarea
              className="w-full p-4 border border-gray-600 rounded bg-gray-700 text-white"
              rows={5}
              value={valueText !== "" ? valueText : suggestResponse}
              onChange={handleValueTextChange}
              placeholder="Enter your unique value proposition here..."
            />
          </div>
          <div className="flex justify-between">
            <button
              className={`px-3 py-1 mr-2 rounded hover:bg-blue-700 ${
                !idle || !suggestIdle || valueText.length === 0
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-yellow-700"
              }`}
              onClick={handleSubmit}
              disabled={!idle || !suggestIdle || valueText.length === 0}
            >
              Submit
            </button>
            <button
              className={`px-3 py-1 rounded ml-auto ${
                !idle || !suggestIdle
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-yellow-600 text-white hover:bg-yellow-700"
              }`}
              onClick={handleCreateValueProp}
              disabled={!idle || !suggestIdle}
            >
              {idle || suggestIdle
                ? "Create unique value prop for me"
                : "Thinking..."}
            </button>
          </div>
        </div>
        {(response.length > 0 ||
          (idea?.valueSummary && idea?.valueSummary.length > 0)) && (
          <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl mt-8">
            <div className="mb-4">
              <div className="mb-4 flex items-center">
                <img
                  src="sharkpuddle.png"
                  alt="Shark Puddle Icon"
                  className="w-11 h-11 mr-2"
                />
                <p className="text-gray-300">
                  <strong>Puddle Shark: </strong>OK, let me summarize what you
                  said. Did I understand you? I am also listing some assumption
                  you should consider.
                  <br />
                </p>{" "}
              </div>
              <div className="text-white">
                <Markdown className="prose prose-sm !max-w-none ">
                  {response.length > 0
                    ? response
                    : idea?.valueSummary && idea?.valueSummary.length > 0
                    ? idea?.valueSummary
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
              No? let me try again (edit you text above and click Submit again)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
