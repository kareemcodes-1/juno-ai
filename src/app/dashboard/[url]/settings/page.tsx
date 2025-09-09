"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function WorkspaceSettingsPage() {
  const { url } = useParams() as { url: string };
  const router = useRouter();

  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceUrl, setWorkspaceUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch workspace info
  useEffect(() => {
    async function fetchWorkspace() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/workspace/${url}`);
        if (!res.ok) throw new Error("Failed to fetch workspace");
        const data = await res.json();
        setWorkspaceName(data.name);
        setWorkspaceUrl(data.url);
      } catch (err) {
        console.error(err);
        toast.error("Could not load workspace data");
      }
    }
    fetchWorkspace();
  }, [url]);

  // Update workspace
  async function submitForm() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/workspace/${url}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: workspaceName, url: workspaceUrl }),
      });
      if (res.ok) {
        toast.success("Workspace updated!");
        router.push(`/dashboard/${workspaceUrl}/agents`);
      } else {
        toast.error("Failed to update workspace");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating workspace");
    } finally {
      setLoading(false);
    }
  }

  // Delete workspace
  async function deleteWorkspace() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/workspace/${url}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Workspace deleted!");
        router.push("/dashboard/workspace/create");
      } else {
        toast.error("Failed to delete workspace");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting workspace");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="lg:text-[2.5rem] text-[2rem] font-bold">Workspace Settings</h1>

      <div className="flex flex-col gap-[.5rem]">
        <Label>Workspace Name</Label>
        <Input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
      </div>

      <div className="flex flex-col gap-[.5rem]">
        <Label>Workspace URL</Label>
        <Input value={workspaceUrl} onChange={(e) => setWorkspaceUrl(e.target.value)} />
      </div>

      <Button onClick={submitForm} disabled={loading} className="w-[8rem]">
        {loading ? "Saving..." : "Save Workspace"}
      </Button>

    <h1 className="lg:text-[2.5rem] text-[2rem] font-bold">Delete Workspace</h1>

      {/* Delete Workspace with AlertDialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-[8rem]">
            Delete Workspace
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete {workspaceName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The workspace and all related data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteWorkspace}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
