"use client"
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession(); // 👈 get logged-in user from context

  async function formAction(formData: FormData) {
    const data = {
      name: formData.get("name") as string,
      url: formData.get("url") as string,
      user: session?.user.id as string, // 👈 include user ID
    };

    if (data.name && data.url) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/workspace`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error("Failed to create workspace");
        return;
      }

      const result = await res.json();
      toast.success("Workspace created!");
      router.push(`/dashboard/${result.url}/agents`);
    }
  }

  return (
    <div>
      <form action={formAction} className="w-full p-6">
        <h2 className="text-[2rem] font-semibold text-gray-800 mb-[1rem]">
          Create Workspace
        </h2>

        <div className="flex flex-col gap-[1rem]">
          <div className="flex flex-col gap-[.5rem]">
            <Label className="block text-[1.1rem] font-medium text-gray-600 mb-1">
              Workspace Name
            </Label>
            <Input type="text" placeholder="Name of your workspace" name="name" />
          </div>

          <div className="flex flex-col gap-[.5rem]">
            <Label className="block text-[1.1rem] font-medium text-gray-600 mb-1">
              Workspace URL
            </Label>
            <Input type="text" placeholder="URL of your workspace" name="url" />
          </div>

          <Button type="submit" className="w-full">
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
