"use client";

import Introduction from "../components/Introduction";
import { Amplify } from 'aws-amplify';
import config from '@/amplifyconfiguration.json';

export default function Home() {

  Amplify.configure(config);

  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      
      <div>
        <Introduction />
      </div>

    </main>
  );
}
