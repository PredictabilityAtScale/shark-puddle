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
  const [planText, setPlanText] = useState("");

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
          setPlanText(result.data.plan ?? "");
        }
      } catch (error) {
        router.refresh();
        router.push("/");
      }
    };

    fetchIdea();
  }, []);

  useEffect(() => {
    if (!idea) {
      return;
    }

    if (!idea.plan || idea.plan.length === 0) {
      doPlan();
    }
  }, [idea]);

  const { response, idle, send } = useLLM({
    project_id: process.env.NEXT_PUBLIC_PROJECT_ID,
    customer: {
      customer_id: idea?.email ?? "",
      customer_name: idea?.email ?? "",
    },
  });

  const handlePlanTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPlanText(event.target.value);
  };

  const doPlan = async () => {
    const prompt = `An entrepreneur is pitching you a business idea (refer to them in the first person "you"). 
    You have a summary of their idea (given below), and are now going to suggest a short plan of 3 parts in plain text (no markdown formatting). 
    
    1. Make a list of 5 customer segments this idea might appeal to (in order of likely revenue) with a short unique value proposition for each segment.
    2. Make a list of 5 potential competitors.
    3. Make a list of 5 assumptions that need to be true for this idea to be successful
    
    Answer in plain text (no markdown) in the following format:

    Customers and Unique Value Propositions:
    1. [Customer Segment 1]: 
       [Value Proposition 1]
    2. [Customer Segment 2]: 
       [Value Proposition 2]
    ...

    Competitors:
    1. [Competitor 1]
    2. [Competitor 2]
    ...

    Assumptions:
    1. [Assumption 1]
    2. [Assumption 2]
    ...

Entrepreneur's Idea: "${idea?.ideaSummary}."
`;

    send(prompt, [],);
  };

  const handleConfirm = async () => {
    await client.models.Idea.update({
      id: idea?.id ?? "",
      plan: planText.length > 0 ? planText : response,
    });

    router.push("/sharks");
  };

  return (
    <div className="p-1 bg-black min-h-screen w-full">
      <div className="flex flex-col items-center mt-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Step 2 - Flesh Out Your Plan
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
                <strong>Puddle Shark: </strong> OK, Based on your idea, I'll
                create you a first draft plan that you can refine and pitch to
                the sharks.
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
                <strong>You: </strong> Make any changes you think are
                important...
              </p>
            </div>

            {!idle && <div className="mb-4">working...</div>}
            <textarea
              className="w-full p-4 border border-gray-600 rounded bg-gray-700 text-white"
              rows={15}
              value={planText !== "" ? planText : response}
              onChange={handlePlanTextChange}
            />
          </div>
          <div className="flex justify-between">
            <button
              className={`px-3 py-1 mr-2 rounded hover:bg-blue-700 ${
                !idle || (planText.length === 0 && response.length === 0)
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-yellow-700"
              }`}
              onClick={handleConfirm}
              disabled={!idle || (planText.length === 0 && response.length === 0)}
            >
              Submit
            </button>
            <button
              className={`px-3 py-1 mr-2 rounded hover:bg-blue-700 ${
                !idle
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-yellow-700"
              }`}
              onClick={() => {
                setPlanText("");
                doPlan();
              }}
              disabled={!idle}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
