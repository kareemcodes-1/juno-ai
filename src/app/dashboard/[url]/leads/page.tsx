"use client";

import { use, useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

type Lead = {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  source: string;
  device?: string;
  term?: string;
  createdAt: string;
};

export default function PageClient({ params }: { params: Promise<{ url: string }> }) {
  const { url } = use(params) // works fine here now
  const [data, setData] = useState<Lead[]>([]);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch(`/api/workspace/${url}/leads`);
        if (!res.ok) throw new Error("Failed to fetch leads");
        const leads = await res.json();
        setData(leads);
      } catch (err) {
        console.error("Error fetching leads:", err);
      }
    }
    fetchLeads();
  }, [url]);

  const columns: ColumnDef<Lead>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "notes", header: "Notes" },
    { accessorKey: "source", header: "Source" },
    { accessorKey: "device", header: "Device" },
    { accessorKey: "term", header: "Term" },
    { accessorKey: "createdAt", header: "Created At" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-[2.5rem] font-bold">Leads</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
