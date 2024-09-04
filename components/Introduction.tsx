"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Introduction: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("sp-email") ?? "";
    setEmail(email);
  }, [router]);

  useEffect(() => {
    setIsEmailValid(validateEmail(email));
  }, [email]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = event.target.value;
    setEmail(emailValue);
    setIsEmailValid(validateEmail(emailValue));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    localStorage.setItem("sp-email", email);
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
        Let&#39;s get started! First I need an email address to send you the
        results of your pitch.
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
          Submit
        </button>
      </div>
    </div>
  );
};

export default Introduction;
