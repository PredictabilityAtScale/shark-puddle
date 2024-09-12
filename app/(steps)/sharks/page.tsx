"use client";
import { useLLM } from "llmasaservice-client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import Image from "next/image";

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

    /*
    if (!idea?.constructiveShark || idea?.constructiveShark?.length > 0) {
      handleConstructiveSubmit(false);
    }

    if (!idea?.supportiveShark || idea?.supportiveShark?.length > 0) {
      handleSupportiveSubmit(false);
    }*/

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
      if (!idea?.supportiveShark || idea?.supportiveShark?.length > 0) {
        handleSupportiveSubmit(false);
      }

      await client.models.Idea.update({
        id: idea?.id ?? "",
        skepticalShark: response,
      });
    };

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
      if (!idea?.constructiveShark || idea?.constructiveShark?.length > 0) {
        handleConstructiveSubmit(false);
      }

      await client.models.Idea.update({
        id: idea?.id ?? "",
        supportiveShark: response,
      });
    };

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
          Step 3 - Shark Puddle Arena
        </h2>
        <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl">
          <div className="mb-4">
            {(!idleSkep || !idleSup || !idleCon) && (
              <p>
                <br />
                Thinking...
              </p>
            )}

            <div className="bg-gray-800 p-4 rounded shadow-md w-full max-w-6xl mt-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Image
                    src="/skepshark1.png"
                    alt="Shark Puddle Icon"
                    width={100}
                    height={100}
                  />
                  <div>
                    <h1 className="text-l ml-4 font-bold text-white">
                      Skeptical Puddle Shark Says...
                    </h1>
                    <button
                      className={`text-sm text-blue-600 hover:text-blue-700 rounded ml-4 ${
                        !idleCon ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => {
                        handleSkepticalSubmit(true);
                      }}
                      disabled={!idleCon}
                    >
                      Regenerate (using stronger model)
                    </button>
                  </div>
                </div>
                <button
                  className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
                  onClick={() => router.push("summary")}
                  disabled={!idleSkep || !idleCon || !idleSup}
                >
                  See full summary and share
                </button>
              </div>

              {responseSkep.length > 0 ? (
                <Markdown className="prose prose-sm !max-w-none ">
                  {responseSkep}
                </Markdown>
              ) : (
                <Markdown className="prose prose-sm !max-w-none ">
                  {idea?.skepticalShark}
                </Markdown>
              )}
            </div>

            <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl mt-2">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Image
                    src="/supportiveshark1.png"
                    alt="Shark Puddle Icon"
                    width={100}
                    height={1000}
                  />
                  <div>
                    <h1 className="text-l ml-4 font-bold text-white">
                      Supportive Puddle Shark Says...
                    </h1>
                    <button
                      className={`text-sm text-blue-600 hover:text-blue-700 rounded ml-4 ${
                        !idleCon ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => {
                        handleSupportiveSubmit(true);
                      }}
                      disabled={!idleCon}
                    >
                      Regenerate (using stronger model)
                    </button>
                  </div>
                </div>
                <button
                  className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
                  onClick={() => router.push("summary")}
                  disabled={!idleSkep || !idleCon || !idleSup}
                >
                  See full summary and share
                </button>
              </div>
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

            <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-6xl mt-2">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Image
                    src="/constructiveshark1.png"
                    alt="Shark Puddle Icon"
                    width={100}
                    height={1000}
                  />
                  <div>
                    <h1 className="text-l ml-4 font-bold text-white">
                      Constructive Puddle Shark Says...
                      <br />
                    </h1>

                    <button
                      className={`text-sm text-blue-600 hover:text-blue-700 rounded ml-4 ${
                        !idleCon ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => {
                        handleConstructiveSubmit(true);
                      }}
                      disabled={!idleCon}
                    >
                      Regenerate (using stronger model)
                    </button>
                  </div>
                </div>
                <button
                  className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
                  onClick={() => router.push("summary")}
                  disabled={!idleSkep || !idleCon || !idleSup}
                >
                  See full summary and share
                </button>
              </div>
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
          <button
            className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
            onClick={() => router.push("summary")}
            disabled={!idleSkep || !idleCon || !idleSup}
          >
            See full summary and share
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
