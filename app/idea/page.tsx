"use client";
import { useLLM } from "llmasaservice-client";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useRouter } from "next/navigation";

const Page: React.FC = () => {
  const router = useRouter();
  const [ideaText, setIdeaText] = useState("");

  const [ideaSummary, setIdeaSummary] = useState("");

  const [email, setEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("sp-email") ?? "";
    if (!email) {
      router.push("/");
    }

    setEmail(email);

    const ideaText = localStorage.getItem("sp-idea");
    setIdeaText(ideaText ?? "");

    const ideaSummary = localStorage.getItem("sp-ideaSummary");
    setIdeaSummary(ideaSummary ?? "");
  }, [router]);

  const { response, idle, send } = useLLM({
    project_id: "379aeb32-8de9-4854-af83-1a0796d1fcd0",
    customer: {
      customer_id: email,
      customer_name: email,
    },
  });

  const handleIdeaTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setIdeaText(event.target.value);
  };

  const handleSubmit = () => {
    const prompt = `An entrepeneur is pitching you a business idea (refer to them in the first person) You have asked them to explain their idea which is included below. Summarize their idea in 1-3 sentences and end with a "You are like [product or company] but for [new idea purpose]." (if one wasn&#39;t given to you).  Do not add any other response other than summarizing and restating their idea.
    
    "${ideaText}."`;

    send(prompt);
  };

  const handleConfirm = () => {
    localStorage.setItem("sp-idea", ideaText);
    localStorage.setItem("sp-ideaSummary", response);
    router.push("/customers");
  };

  const handleSillyIdea = async () => {
    const idea = await send(
      "Create a single sentence comical business idea",
      [],
      false
    );
    console.log("idea:", idea);
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
            <div className="flex items-center">
              <img
                src="sharkpuddle.png"
                alt="Shark Puddle Icon"
                className="w-11 h-11 mr-2"
              />
              <h1 className="text-l font-bold text-white">Puddle Shark</h1>
            </div>
            <p className="text-gray-300">
              Nice to meet you. Tell me your idea?
            </p>
          </div>
          <div className="mb-4">
            <h1 className="text-l font-bold text-white">Small Fish (you)</h1>
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
              className={`px-6 py-3 rounded hover:bg-blue-700 ${
                !idle
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-yellow-700"
              }`}
              onClick={handleSubmit}
              disabled={!idle}
            >
              Submit
            </button>
            <button
              className={`px-6 py-3 rounded ml-auto ${
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
        {(response.length > 0 || ideaSummary.length > 0) && (
          <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl mt-8">
            <div className="mb-4">
              <h1 className="text-l font-bold text-white">Puddle Shark</h1>
              <p className="text-gray-300">
                OK, let me summarize what you said. Did I understand you?
              </p>
              <p className="text-white">
                <Markdown className="prose prose-sm !max-w-none dark:prose-invert">
                  {response.length > 0 ? response : ideaSummary}
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
              No, let me try again (edit you idea above and click Submit again)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
