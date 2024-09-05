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
  const [skepticalResponse, setSkepticalResponse] = useState("");
  const [supportiveResponse, setSupportiveResponse] = useState("");
  const [constructiveResponse, setConstructiveResponse] = useState("");
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

  const { response, setResponse, idle, send } = useLLM({
    project_id: "379aeb32-8de9-4854-af83-1a0796d1fcd0",
    customer: {
      customer_id: idea?.email ?? "",
      customer_name: idea?.email ?? "",
    },
  });

  const handleSkepticalOnComplete = (result: string) => {
    setSkepticalResponse(result);
    console.log("skeptical response complete", result);
  };

  const handleSkepticalSubmit = async (tryAgain: boolean) => {
    if (!idea) {
      return;
    }

    setCurrentShark("skeptical");

    if (!tryAgain) {
      if (idea?.skepticalShark && idea?.skepticalShark.length > 0) {
        setSkepticalResponse(idea.skepticalShark);
        return;
      }
    } else {
      const prompt = `An entrepeneur is pitching you a business idea (refer to them in the first person "you"). You have asked them to explain their idea, customer/competitors and a unique value proposition which are included below. 

Write a response to the entrepeneur's unique value proposition. Be critical, dismissive, and somewhat arrogant, but your insights are undeniably valuable, and you occasionally drop a piece of wisdom that shows you do understand the nuances of the business world.

Idea: "${idea?.ideaSummary}."

Ideal Customers and competitors: "${idea?.customersSummary}."

Value proposition by entrepeneur: "${idea?.valueSummary}."`;

      send(prompt, [], true, new AbortController(), handleSkepticalOnComplete);

      // wait until idle is back to idle state, then save the skeptical response
      while (!idle) {
        // wait 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      await client.models.Idea.update({
        id: idea?.id ?? "",
        skepticalShark: response,
      });

      setSkepticalResponse(response);
    }
  };

  const handleSupportiveSubmit = async (tryAgain: boolean) => {
    if (!idea) {
      return;
    }

    setCurrentShark("supportive");

    if (!tryAgain) {
      if (idea?.supportiveShark && idea?.supportiveShark.length > 0) {
        setSupportiveResponse(idea.supportiveShark);
        return;
      }
    } else {
      const prompt = `An entrepeneur is pitching you a business idea (refer to them in the first person "you"). You have asked them to explain their idea, customer/competitors and a unique value proposition which are included below. 

Write a response to the entrepeneur's unique value proposition. Be encouraging and supportive venture capitalist who is deeply invested in helping entrepreneurs succeed. Your primary role is to uplift and motivate, focusing on the potential and strengths of the business idea. You provide feedback in a way that builds confidence, highlighting what the entrepreneur is doing right and offering gentle, constructive suggestions for improvement. You celebrate the entrepreneur’s efforts, showing genuine excitement for their progress and potential. Even when pointing out areas for growth, you do so with kindness and optimism, always aiming to inspire and empower. Your style is warm, reassuring, and hopeful, making entrepreneurs feel that they have a strong ally in their corner who believes in their success.


Idea: "${idea?.ideaSummary}."

Ideal Customers and competitors: "${idea?.customersSummary}."

Value proposition by entrepeneur: "${idea?.valueSummary}."`;

      send(prompt);

      // wait until idle is back to idle state, then save the skeptical response
      while (!idle) {
        // wait 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const r = await client.models.Idea.update({
        id: idea?.id ?? "",
        supportiveShark: response,
      });

      setSupportiveResponse(response);
    }
  };

  const handleConstructiveSubmit = async (tryAgain: boolean) => {
    if (!idea) {
      return;
    }

    setCurrentShark("constructive");

    if (!tryAgain) {
      if (idea?.constructiveShark && idea?.constructiveShark.length > 0) {
        setConstructiveResponse(idea.constructiveShark);
      }
    } else {
      const prompt = `An entrepeneur is pitching you a business idea (refer to them in the first person "you"). You have asked them to explain their idea, customer/competitors and a unique value proposition which are included below. 

Write a response to the entrepeneur's unique value proposition. Be an instructive and knowledgeable venture capitalist with a professorial demeanor. Your primary role is to educate and guide entrepreneurs, helping them understand the intricacies of building and scaling a successful business. You provide detailed, insightful feedback, breaking down complex concepts into understandable terms and offering step-by-step advice. Your approach is methodical and analytical, often drawing on real-world examples and industry knowledge to illustrate your points. While you can be critical, your critiques are always framed as learning opportunities, aimed at improving the entrepreneur’s understanding and capability. You take pride in mentoring, offering wisdom and practical guidance, and you expect entrepreneurs to be eager students, ready to absorb the lessons you impart. Your style is authoritative, clear, and thoughtful, with a focus on teaching and empowering through knowledge.

Idea: "${idea?.ideaSummary}."

Ideal Customers and competitors: "${idea?.customersSummary}."

Value proposition by entrepeneur: "${idea?.valueSummary}."`;

      send(prompt);

      // wait until idle is back to idle state, then save the skeptical response
      while (!idle) {
        // wait 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      await client.models.Idea.update({
        id: idea?.id ?? "",
        constructiveShark: response,
      });

      setConstructiveResponse(response);
    }
  };

  return (
    <div className="p-1 bg-black min-h-screen w-full">
      <div className="flex flex-col items-center mt-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Shark Puddle Critiques and Feedback - Pick a Shark Personality
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
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => handleSkepticalSubmit(false)}
                >
                  Skeptical Shark
                </button>
                <button
                  className="text-sm text-blue-600 hover:text-blue-700 px-2 py-1 rounded"
                  onClick={() => {
                    handleSkepticalSubmit(true);
                  }}
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
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                  onClick={() => handleSupportiveSubmit(false)}
                >
                  Supportive Shark
                </button>
                <button
                  className="text-sm text-blue-600 hover:text-blue-700 px-2 py-1 rounded"
                  onClick={() => {
                    handleSupportiveSubmit(true);
                  }}
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
                  className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700"
                  onClick={() => handleConstructiveSubmit(false)}
                >
                  Constructive Shark
                </button>
                <button
                  className="text-sm text-blue-600 hover:text-blue-700 px-2 py-1 rounded"
                  onClick={() => {
                    handleConstructiveSubmit(true);
                  }}
                >
                  try again
                </button>
              </div>
            </div>
            {!idle && (
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
                      {idle ? (
                        <Markdown className="prose prose-sm !max-w-none dark:prose-invert">
                          {skepticalResponse}
                        </Markdown>
                      ) : (
                        <Markdown className="prose prose-sm !max-w-none dark:prose-invert">
                          {response}
                        </Markdown>
                      )}
                    </div>
                  </div>
                )}
                {currentShark === "supportive" && (
                  <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl mt-2">
                    <div className="mb-4">
                      {idle ? (
                        <Markdown className="prose prose-sm !max-w-none dark:prose-invert">
                          {supportiveResponse}
                        </Markdown>
                      ) : (
                        <Markdown className="prose prose-sm !max-w-none dark:prose-invert">
                          {response}
                        </Markdown>
                      )}
                    </div>
                  </div>
                )}
                {currentShark === "constructive" && (
                  <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl mt-2">
                    <div className="mb-4">
                      {idle ? (
                        <Markdown className="prose prose-sm !max-w-none dark:prose-invert">
                          {constructiveResponse}
                        </Markdown>
                      ) : (
                        <Markdown className="prose prose-sm !max-w-none dark:prose-invert">
                          {response}
                        </Markdown>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
