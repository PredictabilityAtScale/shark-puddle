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
      router.refresh();
      router.push("/");
      return;
    }

    console.log("ideaid", ideaid);

    const fetchIdea = async () => {
      try {
        const result = await client.models.Idea.get({ id: ideaid });
        console.log("result", result);
        if (!result || !result.data) {
          router.refresh();
          router.push("/");
        } else {
          setIdea(result.data as Schema["Idea"]["type"]);
          setCustomersText(result.data.customers ?? "");
        }
      } catch (error) {
        router.refresh();
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
    console.log("idea", idea);

    const prompt = `An entrepreneur is pitching you a business idea (refer to them in the first person "you"). You have asked them to explain their idea and ideal customer segments which are included below. 
    
    1. Summarize and augment their customers.  
    2. Create a list of potential competitors.
    
    Do not add any other response other than summarizing and augmenting their customer segments and then the competitors list.

Idea: "${idea?.ideaSummary}."

Ideal Customers: "${customersText}."`;

    send(prompt);
  };

  const handleConfirm = async () => {
    await client.models.Idea.update({
      id: idea?.id ?? "",
      customers: customersText.length > 0 ? customersText : suggestResponse,
      customersSummary:
        response && response.length > 0 ? response : idea?.customersSummary,
    });

    router.push("/value");
  };

  const handleCreateCustomerSegments = async () => {
    setCustomersText("");

    suggestSend(
      `Analyze the following business idea and create customer segments that are ideal customers for the following proposed product or service. Use simple text formatting, no markdown or special characters.
      
      ${idea?.ideaSummary}`,
      [],
      true,
      true,
      null,
      new AbortController(),
      (response: string) => {
        setCustomersText(response);
      }
    );
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

              <p className="text-gray-300">
                <strong>Puddle Shark: </strong> OK, I'll attempt to expand on
                what you said, and also identify some competitors you should
                consider and research.
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
                <strong>You: </strong> Enter details about your ideal customer
                (segments) here...
              </p>
            </div>
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
              className={`px-3 py-1 mr-2 rounded hover:bg-blue-700 ${
                !idle || !suggestIdle || customersText.length === 0
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-yellow-700"
              }`}
              onClick={handleSubmit}
              disabled={!idle || !suggestIdle || customersText.length === 0}
            >
              Submit
            </button>
            <button
              className={`px-3 py-1 rounded ml-auto ${
                !idle || !suggestIdle
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-yellow-600 text-white hover:bg-yellow-700"
              }`}
              onClick={handleCreateCustomerSegments}
              disabled={!idle || !suggestIdle}
            >
              {idle || suggestIdle
                ? "Create customer segments for me"
                : "Thinking..."}
            </button>
          </div>
        </div>
        {(response.length > 0 ||
          (idea?.customersSummary && idea?.customersSummary.length > 0)) && (
          <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl mt-8">
            <div className="mb-4">
              <div className="mb-4 flex items-center">
                <img
                  src="sharkpuddle.png"
                  alt="Shark Puddle Icon"
                  className="w-11 h-11 mr-2"
                />

                <p className="text-gray-300">
                  <strong>Puddle Shark: </strong> OK, let me summarize what you
                  said. Did I understand you? I am also listing some competitors
                  you should consider.
                  <br />
                </p>
              </div>
              <div className="text-white">
                <Markdown className="prose prose-sm !max-w-none ">
                  {response.length > 0
                    ? response
                    : idea?.customersSummary &&
                      idea?.customersSummary.length > 0
                    ? idea?.customersSummary
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
