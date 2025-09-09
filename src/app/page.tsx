"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Navbar } from "@/components/navbar";
import { Workspace } from "../../types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import HeroText from "../components/hero-text"

export default function Home() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

   const { data: session } = useSession();
    const router = useRouter();
  
    const handleRedirect = async () => {
      if (!workspaces || workspaces.length === 0) {
          router.push("/dashboard/workspace/create");
      } else {
         const firstWorkspace = workspaces[0];
         router.push(`/dashboard/${firstWorkspace.url}/agents`);
       }
    }

  useEffect(() => {
    async function checkWorkspaces() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/workspace`);
        if (!res.ok) throw new Error("Failed to fetch workspaces");

        const workspaces = await res.json();
        setWorkspaces(workspaces);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load workspaces");
      }
    }

    checkWorkspaces();
  }, []);

  return (
    <div className="min-h-screen">

      <Navbar workspaces={workspaces} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 mt-28 sm:mt-20 flex flex-col items-center justify-center text-center">
          <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
            <p className="text-sm font-semibold text-gray-700">
              Juno is now live!
            </p>
          </div>

          <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl leading-tight">
  Build your first AI agent for <HeroText /> in seconds with Juno
</h1>


          <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
            Turn conversations into conversions with AI agents built for your
            business needs. <br />
            Build AI agents that work faster, smarter, and always on.
          </p>

          {session ? (
            <Button onClick={handleRedirect} variant="default" size="lg" className="mt-[2rem]">
             Get Started
          </Button>
          ): (
            <Button variant="default" size="lg" className="mt-[2rem]">
            <Link href={'/auth/login'}>Sign In</Link>
          </Button>
          )}

          <div>
            <div className="relative isolate">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              >
                <div
                  style={{
                    clipPath:
                      "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                  }}
                  className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                />
              </div>

              <div className="mx-auto mb-32 max-w-5xl px-6 lg:px-8 mt-[5rem]">
                <div className="-m-2 rounded-xl  bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
 <div className="w-full aspect-video">
    <video
      src="/JunoDemo.mp4"
      className="w-full h-full object-cover rounded-xl"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
    />
  </div>


                </div>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
              <div
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
                className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-10 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
              />
            </div>
          </div>
        </div>

<section className="relative py-20 bg-gray-50">
  <div className="container mx-auto px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
        How It Works
      </h2>
      <p className="mt-4 text-lg text-gray-600">
        Build your AI agent in just a few simple steps.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {/* Step 1 */}
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-6">
          <span className="text-2xl font-bold">1</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Create Workspace</h3>
        <p className="mt-3 text-gray-600">
          Set up a workspace for your business and manage your agents in one place.
        </p>
      </div>

      {/* Step 2 */}
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-6">
          <span className="text-2xl font-bold">2</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Customize Your Agent</h3>
        <p className="mt-3 text-gray-600">
          Define your AI agent’s role, tone, and behavior to match your brand.
        </p>
      </div>

      {/* Step 3 */}
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-6">
          <span className="text-2xl font-bold">3</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Embed & Launch</h3>
        <p className="mt-3 text-gray-600">
          Copy the widget code and embed it on your website to start chatting instantly.
        </p>
      </div>
    </div>
  </div>
</section>

      </main>
    </div>
  );
}
