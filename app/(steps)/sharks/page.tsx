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

  useEffect(() => {
    if (!idea) return;
    //if (localStorage.getItem("sp-idea-id") ?? "" === idea.id) return;

    if (!idea?.skepticalShark || idea?.skepticalShark?.length > 0) {
      handleSkepticalSubmit(false);
    }
  }, [idea]);

  const {
    response: responseSkep,
    idle: idleSkep,
    send: sendSkep,
  } = useLLM({
    project_id: process.env.NEXT_PUBLIC_PROJECT_ID,
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
    project_id: process.env.NEXT_PUBLIC_PROJECT_ID,
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
    project_id: process.env.NEXT_PUBLIC_PROJECT_ID,
    customer: {
      customer_id: idea?.email ?? "",
      customer_name: idea?.email ?? "",
    },
  });

  const handleSkepticalSubmit = async (tryAgain: boolean) => {
    if (!idea) {
      return;
    }

    const skepCallback = async (response: string) => {
      await client.models.Idea.update({
        id: idea?.id ?? "",
        skepticalShark: response,
      });
    };

    setCurrentShark("skeptical");

    if (!tryAgain && responseSkep.length > 0) {
      return;
    }

    if (
      tryAgain ||
      !idea?.skepticalShark ||
      idea?.skepticalShark?.length === 0
    ) {
      const prompt = `{{shark_critique_task}}  

{{skeptical_shark_persona}}

Idea: "${idea?.ideaSummary}."

Plan: "${idea?.plan}."`;

      sendSkep(
        prompt,
        [],
        true,
        !tryAgain,
        tryAgain ? process.env.NEXT_PUBLIC_PREMIUM_GROUP_ID : null,
        new AbortController(),
        skepCallback
      );
    }
  };

  const handleSupportiveSubmit = async (tryAgain: boolean) => {
    if (!idea) {
      return;
    }

    const suppCallback = async (response: string) => {
      await client.models.Idea.update({
        id: idea?.id ?? "",
        supportiveShark: response,
      });
    };

    setCurrentShark("supportive");

    if (!tryAgain && responseSup.length > 0) {
      return;
    }

    if (
      tryAgain ||
      !idea?.supportiveShark ||
      idea?.supportiveShark?.length === 0
    ) {
      const prompt = `{{shark_critique_task}}  
      
{{supportive_shark_persona}}

Idea: "${idea?.ideaSummary}."

Plan: "${idea?.plan}."`;

      sendSup(
        prompt,
        [],
        true,
        !tryAgain,
        tryAgain ? process.env.NEXT_PUBLIC_PREMIUM_GROUP_ID : null,
        new AbortController(),
        suppCallback
      );
    }
  };

  const handleConstructiveSubmit = async (tryAgain: boolean) => {
    if (!idea) {
      return;
    }

    const conCallback = async (response: string) => {
      await client.models.Idea.update({
        id: idea?.id ?? "",
        constructiveShark: response,
      });
    };

    setCurrentShark("constructive");

    if (!tryAgain && responseCon.length > 0) {
      return;
    }

    if (
      tryAgain ||
      !idea?.constructiveShark ||
      idea?.constructiveShark?.length === 0
    ) {
      const prompt = `{{shark_critique_task}} 

{{constructive_shark_persona}}

Idea: "${idea?.ideaSummary}."

Plan: "${idea?.plan}."`;

      sendCon(
        prompt,
        [],
        true,
        !tryAgain,
        tryAgain ? process.env.NEXT_PUBLIC_PREMIUM_GROUP_ID : null,
        new AbortController(),
        conCallback
      );
    }
  };

  return (
    <div className="p-1 bg-black min-h-screen w-full">
      <div className="flex flex-col items-center mt-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Step 3 - Generate Shark Puddle Critiques and Feedback - Pick a Shark
          Personality
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
                  className={`px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 ${
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
                  className={`px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 ${
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
                  className={`px-2 py-1 rounded bg-yellow-600 text-white hover:bg-yellow-700 ${
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
                <button
                  className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 mt-7 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
                  onClick={() => router.push("summary")}
                  disabled={
                    (!idea?.skepticalShark && responseSkep.length <= 0) ||
                    (!idea?.supportiveShark && responseSup.length <= 0) ||
                    (!idea?.constructiveShark && responseCon.length <= 0)
                  }
                >
                  {(!idea?.skepticalShark && responseSkep.length <= 0) ||
                  (!idea?.supportiveShark && responseSup.length <= 0) ||
                  (!idea?.constructiveShark && responseCon.length <= 0)
                    ? "more sharks to hear from"
                    : "Summary >"}
                </button>
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
                      <>
                        {console.log(
                          "Rendering skeptical response:",
                          responseSkep.length
                        )}
                        {responseSkep.length > 0 ? (
                          <Markdown className="prose prose-sm !max-w-none ">
                            {responseSkep}
                          </Markdown>
                        ) : (
                          <Markdown className="prose prose-sm !max-w-none ">
                            {idea?.skepticalShark}
                          </Markdown>
                        )}
                      </>
                    </div>
                  </div>
                )}
                {currentShark === "supportive" && (
                  <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl mt-2">
                    <div className="mb-4">
                      {responseSup.length > 0 ? (
                        <Markdown className="prose prose-sm !max-w-none ">
                          {responseSup}
                        </Markdown>
                      ) : (
                        <Markdown className="prose prose-sm !max-w-none ">
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
                        <Markdown className="prose prose-sm !max-w-none ">
                          {responseCon}
                        </Markdown>
                      ) : (
                        <Markdown className="prose prose-sm !max-w-none ">
                          {idea?.constructiveShark}
                        </Markdown>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="m-4">
              Tip: Try all three sharks to get a better understanding of your
              idea....
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <img
                  src="skepshark1.png"
                  alt="Skeptical Shark"
                  className="w-12 h-12 mb-2"
                />
                <button
                  className={`px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 ${
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
                  className={`px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 ${
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
                  className={`px-2 py-1 rounded bg-yellow-600 text-white hover:bg-yellow-700 ${
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
                <button
                  className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 mt-7 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
                  onClick={() => router.push("summary")}
                  disabled={
                    (!idea?.skepticalShark && responseSkep.length <= 0) ||
                    (!idea?.supportiveShark && responseSup.length <= 0) ||
                    (!idea?.constructiveShark && responseCon.length <= 0)
                  }
                >
                  {(!idea?.skepticalShark && responseSkep.length <= 0) ||
                  (!idea?.supportiveShark && responseSup.length <= 0) ||
                  (!idea?.constructiveShark && responseCon.length <= 0)
                    ? "more sharks to hear from"
                    : "Summary >"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
