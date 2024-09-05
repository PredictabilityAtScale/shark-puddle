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
  const [customersText, setCustomersText] = useState("");

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
          setCustomersText(result.data.customers ?? "");
        }
      } catch (error) {
        router.push("/");
      }
    };

    fetchIdea();
    
  }, []);

  const { response, idle, send } = useLLM({
    project_id: "379aeb32-8de9-4854-af83-1a0796d1fcd0",
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
    project_id: "379aeb32-8de9-4854-af83-1a0796d1fcd0",
    customer: {
      customer_id: idea?.email ?? "",
      customer_name: idea?.email ?? "",
    },
  });

  const handleCustomersTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCustomersText(event.target.value);
  };

  const handleSubmit = () => {
    const prompt = `An entrepeneur is pitching you a business idea (refer to them in the first person "you"). You have asked them to explain their idea and ideal customer segments which are included below. 
    
    1. Summarize and augment their customers.  
    2. Create a list of potential competitors.
    
    Do not add any other response other than summarizing and augmenting their customer segments and then the competitors list.

Idea: "${idea?.ideaSummary}."

Ideal Customers: "${customersText}."`;

    send(prompt);
  };

  const handleConfirm = () => {
    client.models.Idea.update({
      id: idea?.id ?? "",
      customers: customersText.length > 0 ? customersText : suggestResponse,
      customersSummary: response && response.length > 0 ? response : idea?.customersSummary,
    });

    router.push("/value");
  };

  const handleCreateCustomerSegments = async () => {
    setCustomersText("");

    suggestSend(
      `Analyze the following business idea and create customer segments that are ideal customers for the following prposed product or service. Use simple text formatting, no markdown or special characters.
      
      ${idea?.ideaSummary}`
    );

    while (!suggestIdle) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCustomersText(suggestResponse);
    }

    setCustomersText(suggestResponse);
  };

  return (
    <div className="p-1 bg-black min-h-screen w-full">
      <div className="flex flex-col items-center mt-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Step 2 - Tell Puddle Shark About Customers and Competitors
        </h2>
        <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl">
          <div className="mb-4">
            <div className="flex items-center">
              <img
                src="sharkpuddle.png"
                alt="Shark Puddle Icon"
                className="w-11 h-11 mr-2"
              />
              <h1 className="text-l font-bold text-white">Puddle Shark</h1>
            </div>
            <p className="text-gray-300">
              OK, I get what you are doing, tell me about your ideal customers,
              who will be looking for your idea to solve their problem and why.
            </p>
          </div>
          <div className="mb-4">
            <h1 className="text-l font-bold text-white">Small Fish (you)</h1>
            <textarea
              className="w-full p-4 border border-gray-600 rounded bg-gray-700 text-white"
              rows={5}
              value={customersText !== "" ? customersText : suggestResponse}
              onChange={handleCustomersTextChange}
              placeholder="Enter your ideal customer profiles here..."
            />
          </div>
          <div className="flex justify-between">
            <button
              className={`px-6 py-3 rounded hover:bg-blue-700 ${
                (!idle || !suggestIdle)
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-yellow-700"
              }`}
              onClick={handleSubmit}
              disabled={!idle || !suggestIdle}
            >
              Submit
            </button>
            <button
              className={`px-6 py-3 rounded ml-auto ${
                (!idle || !suggestIdle)
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-yellow-600 text-white hover:bg-yellow-700"
              }`}
              onClick={handleCreateCustomerSegments}
              disabled={!idle || !suggestIdle}
            >
              {idle || suggestIdle ? "Create customer segments for me" : "Thinking..."}
            </button>
          </div>
        </div>
        {(response.length > 0 ||
          (idea?.customersSummary && idea?.customersSummary.length > 0)) && (
          <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl mt-8">
            <div className="mb-4">
            <div className="flex items-center">
              <img
                src="sharkpuddle.png"
                alt="Shark Puddle Icon"
                className="w-11 h-11 mr-2"
              />
              <h1 className="text-l font-bold text-white">Puddle Shark</h1>
            </div>
              <p className="text-gray-300">
                OK, let me summarize what you said. Did I understand you? I am
                also listing some competitors you should consider.<br />
              </p>
              <p className="text-white">
                <Markdown className="prose prose-sm !max-w-none dark:prose-invert">
                  {response.length > 0
                    ? response
                    : idea?.customersSummary &&
                      idea?.customersSummary.length > 0
                    ? idea?.customersSummary
                    : ""}
                </Markdown>
              </p>
            </div>

            <div className="flex justify-between">
              <button
                className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
                onClick={handleConfirm}
              >
                Yes, that&apos;s it
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
