"use client"
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Page = () => {

    const router = useRouter();

   async function formAction(formData: FormData){
      const data = {
        name: formData.get('name') as string,
        url: formData.get('url') as string,
      };

      if(data.name.length || data.url.length !== 0){
         const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/workspace`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
         });

         const result = await res.json();
         toast.success('Workspace created!');
         router.push(`/dashboard/${result.url}/agents`)
      }
   }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form action={formAction} className="w-full max-w-md space-y-4 bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800">
          Create Workspace
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Workspace Name
          </label>
          <Input type="text" placeholder="Name of your workspace" name="name"/>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Workspace URL
          </label>
          <Input type="text" placeholder="URL of your workspace" name="url" />
        </div>

        <Button type="submit" className="w-full">
          Create
        </Button>
      </form>
    </div>
  );
};

export default Page;
