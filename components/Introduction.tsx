"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const Introduction: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const router = useRouter();

  const [ideasForEmail, setIdeasForEmail] = useState<Schema["Idea"]["type"][]>(
    []
  );

  const client = generateClient<Schema>();

  useEffect(() => {
    const email = localStorage.getItem("sp-email") ?? "";
    setEmail(email);

    const fetchIdeas = async () => {
      try {
        const result = await client.models.Idea.listIdeaByEmail({
          email: email,
        });

        setIdeasForEmail(result.data);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchIdeas();
  }, [router]);

  useEffect(() => {
    setIsEmailValid(validateEmail(email));
  }, [email]);

  const handleEmailChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const emailValue = event.target.value;
    setEmail(emailValue);

    const valid = validateEmail(emailValue);
    if (valid) {
      const result = await client.models.Idea.listIdeaByEmail({
        email: emailValue,
      });

      setIdeasForEmail(result.data);
    } else {
      setIdeasForEmail([]);
    }

    setIsEmailValid(valid);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    localStorage.setItem("sp-email", email);

    // create a new idea
    const idea = await client.models.Idea.create({
      email,
    });

    localStorage.setItem("sp-idea-id", idea.data?.id ?? "");

    router.push("/idea");
  };

  return (
    <div className="text-center">
      <p>
        Welcome. We will pregressively help you defined your business plan and
        practice your investor pitch...all in a fun and interactive way.
      </p>
      <p>
        Our intention is to add value (for you) and test our LLM as a Service
        platform (for us).
      </p>
      <p>
        <br />
        Let&#39;s get started! First I need an email address to associate with
        your business plan.
      </p>

      <div>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email address"
          className="text-black border-2 border-gray-300 rounded-lg p-2 m-2 w-1/2"
        />

        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
            !isEmailValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSubmit}
          disabled={!isEmailValid}
        >
          Create new idea...
        </button>
      </div>
      <div className="p-10">
        {ideasForEmail?.length > 0 && <h2>or, Continue an Existing Idea</h2>}
        <ul>
          {ideasForEmail?.map((idea) => (
            <li key={idea.id} className="p-5">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  localStorage.setItem("sp-idea-id", idea.id);
                  router.push("/idea");
                }}
              >
                {idea.ideaSummary} created{" "}
                {new Date(idea.createdAt).toLocaleDateString()}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Introduction;
