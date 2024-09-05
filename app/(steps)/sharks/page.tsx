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
  const [currentShark, setCurrentShark] = useState("skeptical");

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
        }
      } catch (error) {
        router.push("/");
      }
    };

    fetchIdea();
  }, []);

  const {
    response: responseSkep,
    idle: idleSkep,
    send: sendSkep,
  } = useLLM({
    project_id: "379aeb32-8de9-4854-af83-1a0796d1fcd0",
    customer: {
      customer_id: idea?.email ?? "",
      customer_name: idea?.email ?? "",
    },
  });

  const {
    response: responseSup,
    idle: idleSup,
    send: sendSup,
  } = useLLM({
    project_id: "379aeb32-8de9-4854-af83-1a0796d1fcd0",
    customer: {
      customer_id: idea?.email ?? "",
      customer_name: idea?.email ?? "",
    },
  });

  const {
    response: responseCon,
    idle: idleCon,
    send: sendCon,
  } = useLLM({
    project_id: "379aeb32-8de9-4854-af83-1a0796d1fcd0",
    customer: {
      customer_id: idea?.email ?? "",
      customer_name: idea?.email ?? "",
    },
  });

  const handleSkepticalSubmit = async (tryAgain: boolean) => {
    if (!idea) {
      return;
    }

    const skepCallback = (response: string) => {
      client.models.Idea.update({
        id: idea?.id ?? "",
        skepticalShark: response,
      });
    };

    setCurrentShark("skeptical");

    if (
      tryAgain ||
      !idea?.skepticalShark ||
      idea?.skepticalShark?.length === 0
    ) {
      const prompt = `An entrepeneur is pitching you a business idea (refer to them in the first person "you"). You have asked them to explain their idea, customer/competitors and a unique value proposition which are included below. 

Write a response to the entrepeneur's unique value proposition. Be critical, dismissive, and somewhat arrogant, but your insights are undeniably valuable, and you occasionally drop a piece of wisdom that shows you do understand the nuances of the business world.

Idea: "${idea?.ideaSummary}."

Ideal Customers and competitors: "${idea?.customersSummary}."

Value proposition by entrepeneur: "${idea?.valueSummary}."`;

      sendSkep(
        prompt,
        [],
        true,
        new AbortController(),
        tryAgain ? "d4815650-f41c-421a-ab9c-2201675de892" : null,
        skepCallback
      );
    }
  };

  const handleSupportiveSubmit = async (tryAgain: boolean) => {
    if (!idea) {
      return;
    }

    const suppCallback = (response: string) => {
      client.models.Idea.update({
        id: idea?.id ?? "",
        supportiveShark: response,
      });
    };

    setCurrentShark("supportive");

    if (
      tryAgain ||
      !idea?.supportiveShark ||
      idea?.supportiveShark?.length === 0
    ) {
      const prompt = `An entrepeneur is pitching you a business idea (refer to them in the first person "you"). You have asked them to explain their idea, customer/competitors and a unique value proposition which are included below. 

Write a response to the entrepeneur's unique value proposition. Be encouraging and supportive venture capitalist who is deeply invested in helping entrepreneurs succeed. Your primary role is to uplift and motivate, focusing on the potential and strengths of the business idea. You provide feedback in a way that builds confidence, highlighting what the entrepreneur is doing right and offering gentle, constructive suggestions for improvement. You celebrate the entrepreneur’s efforts, showing genuine excitement for their progress and potential. Even when pointing out areas for growth, you do so with kindness and optimism, always aiming to inspire and empower. Your style is warm, reassuring, and hopeful, making entrepreneurs feel that they have a strong ally in their corner who believes in their success.


Idea: "${idea?.ideaSummary}."

Ideal Customers and competitors: "${idea?.customersSummary}."

Value proposition by entrepeneur: "${idea?.valueSummary}."`;

      sendSup(
        prompt,
        [],
        true,
        new AbortController(),
        tryAgain ? "d4815650-f41c-421a-ab9c-2201675de892" : null,
        suppCallback
      );
    }
  };

  const handleConstructiveSubmit = async (tryAgain: boolean) => {
    if (!idea) {
      return;
    }

    const conCallback = (response: string) => {
      client.models.Idea.update({
        id: idea?.id ?? "",
        constructiveShark: response,
      });
    };

    setCurrentShark("constructive");

    if (
      tryAgain ||
      !idea?.constructiveShark ||
      idea?.constructiveShark?.length === 0
    ) {
      const prompt = `An entrepeneur is pitching you a business idea (refer to them in the first person "you"). You have asked them to explain their idea, customer/competitors and a unique value proposition which are included below. 

Write a response to the entrepeneur's unique value proposition. Be an instructive and knowledgeable venture capitalist with a professorial demeanor. Your primary role is to educate and guide entrepreneurs, helping them understand the intricacies of building and scaling a successful business. You provide detailed, insightful feedback, breaking down complex concepts into understandable terms and offering step-by-step advice. Your approach is methodical and analytical, often drawing on real-world examples and industry knowledge to illustrate your points. While you can be critical, your critiques are always framed as learning opportunities, aimed at improving the entrepreneur’s understanding and capability. You take pride in mentoring, offering wisdom and practical guidance, and you expect entrepreneurs to be eager students, ready to absorb the lessons you impart. Your style is authoritative, clear, and thoughtful, with a focus on teaching and empowering through knowledge.

Idea: "${idea?.ideaSummary}."

Ideal Customers and competitors: "${idea?.customersSummary}."

Value proposition by entrepeneur: "${idea?.valueSummary}."`;

      sendCon(
        prompt,
        [],
        true,
        new AbortController(),
        tryAgain ? "d4815650-f41c-421a-ab9c-2201675de892" : null,
        conCallback
      );
    }
  };

  return (
    <div className="p-1 bg-black min-h-screen w-full">
      <div className="flex flex-col items-center mt-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Step 4 - Generate Shark Puddle Critiques and Feedback - Pick a Shark Personality
        </h2>
        <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <img
                  src="skepshark1.png"
                  alt="Skeptical Shark"
                  className="w-12 h-12 mb-2"
                />
                <button
                  className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 ${
                    !idleSkep ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleSkepticalSubmit(false)}
                  disabled={!idleSkep}
                >
                  Skeptical Shark
                </button>
                <button
                  className={`text-sm text-blue-600 hover:text-blue-700 px-2 py-1 rounded ${
                    !idleSkep ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    handleSkepticalSubmit(true);
                  }}
                  disabled={!idleSkep}
                >
                  try again
                </button>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src="supportiveshark1.png"
                  alt="Supportive Shark"
                  className="w-12 h-12 mb-2"
                />
                <button
                  className={`px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 ${
                    !idleSup ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleSupportiveSubmit(false)}
                  disabled={!idleSup}
                >
                  Supportive Shark
                </button>
                <button
                  className={`text-sm text-blue-600 hover:text-blue-700 px-2 py-1 rounded ${
                    !idleSup ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    handleSupportiveSubmit(true);
                  }}
                  disabled={!idleSup}
                >
                  try again
                </button>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src="constructiveshark1.png"
                  alt="Constructive Shark"
                  className="w-12 h-12 mb-2"
                />
                <button
                  className={`px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700 ${
                    !idleCon ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleConstructiveSubmit(false)}
                  disabled={!idleCon}
                >
                  Constructive Shark
                </button>
                <button
                  className={`text-sm text-blue-600 hover:text-blue-700 px-2 py-1 rounded ${
                    !idleCon ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    handleConstructiveSubmit(true);
                  }}
                  disabled={!idleCon}
                >
                  try again
                </button>
              </div>
              <div>
              <button className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 mt-7" onClick={()=>router.push("\summary") }>Summary &gt;</button>
              </div>
            </div>
            {(!idleSkep || !idleSup || !idleCon) && (
              <p>
                <br />
                Thinking...
              </p>
            )}

            <div className="bg-gray-800 p-4 rounded shadow-md w-full max-w-6xl mt-4">
              <div className="mb-4">
                <div className="flex items-center">
                  <img
                    src={
                      currentShark === "skeptical"
                        ? "skepshark1.png"
                        : currentShark === "constructive"
                        ? "constructiveshark1.png"
                        : "supportiveshark1.png"
                    }
                    alt="Shark Puddle Icon"
                    className="w-11 h-11 mr-2"
                  />
                  <h1 className="text-l font-bold text-white">
                    {currentShark === "skeptical"
                      ? "Skeptical "
                      : currentShark === "constructive"
                      ? "Constructive "
                      : "Supportive "}{" "}
                    Puddle Shark Says...
                  </h1>
                </div>

                {currentShark === "skeptical" && (
                  <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl mt-2">
                    <div className="mb-4">
                      {responseSkep.length > 0 ? (
                        <Markdown className="prose prose-sm !max-w-none dark:prose-invert">
                          {responseSkep}
                        </Markdown>
                      ) : (
                        <Markdown className="prose prose-sm !max-w-none dark:prose-invert">
                          {idea?.skepticalShark}
                        </Markdown>
                      )}
                    </div>
                  </div>
                )}
                {currentShark === "supportive" && (
                  <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl mt-2">
                    <div className="mb-4">
                      {responseSup.length > 0 ? (
                        <Markdown className="prose prose-sm !max-w-none dark:prose-invert">
                          {responseSup}
                        </Markdown>
                      ) : (
                        <Markdown className="prose prose-sm !max-w-none dark:prose-invert">
                          {idea?.supportiveShark}
                        </Markdown>
                      )}
                    </div>
                  </div>
                )}
                {currentShark === "constructive" && (
                  <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl mt-2">
                    <div className="mb-4">
                      {responseCon.length > 0 ? (
                        <Markdown className="prose prose-sm !max-w-none dark:prose-invert">
                          {responseCon}
                        </Markdown>
                      ) : (
                        <Markdown className="prose prose-sm !max-w-none dark:prose-invert">
                          {idea?.constructiveShark}
                        </Markdown>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700" onClick={()=>router.push("\summary") }>See and share summary</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
