"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const Introduction: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [subscribe, setSubscribe] = useState(false);

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

  const handleSubscribeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSubscribe(event.target.checked);
  };

  const handleSubmit = async () => {
    localStorage.setItem("sp-email", email);

    // create a new idea
    const idea = await client.models.Idea.create({
      email,
      consent: subscribe,
      consentDate: subscribe ? new Date().toISOString() : "",
    });

    localStorage.setItem("sp-idea-id", idea.data?.id ?? "");

    router.push("/idea");
  };

  return (
    <div className="text-center">
      <p className="">
        Hone Your Business Idea and Perfect Your Pitch Before Diving into the
        Deep End.
        <br /> At Shark Puddle, we help you shape your business concept and
        refine your investor pitch so you&#39;re ready to impress when it&#39;s
        time to face the sharks.
        <br />
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

        <div className="flex items-center justify-center mt-4">
          <input
            type="checkbox"
            checked={subscribe}
            onChange={handleSubscribeChange}
            className="mr-2"
          />
          <label htmlFor="subscribe" className="text-gray-400">
            Subscribe to occasional product news?<br/>(we won&#39;t spam or sell your email)
          </label>
        </div>

        <button
          className={`mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
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
