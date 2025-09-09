"use client";

import AgentForm from "@/components/forms/agent-form";
import { useParams } from "next/navigation";

export default function Page() {
    const {id} = useParams();

  return (

        <div className="flex flex-1 flex-col gap-[3rem] p-[1rem]">
        <AgentForm id={id as string} />
        </div>
  );
}


