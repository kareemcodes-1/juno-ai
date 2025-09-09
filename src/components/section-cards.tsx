"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "./ui/switch";
import { Code, CodeXml, Edit, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface Agent {
  _id: string;
  name: string;
  role: string;
}

export function SectionCards({ workspace }: { workspace: string }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteAgentId, setDeleteAgentId] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [openEmbed, setOpenEmbed] = useState<boolean>(false);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/workspace/${workspace}/agent`
        );
        const data = await res.json();
        setAgents(data);
      } catch (err) {
        console.error("Failed to load agents:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAgents();
  }, [workspace]);

  async function handleDelete() {
    if (!deleteAgentId) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/workspace/${workspace}/agent/${deleteAgentId}`,
        { method: "DELETE" }
      );
      setAgents((prev) => prev.filter((agent) => agent._id !== deleteAgentId));
      setDeleteAgentId(null);
    } catch (err) {
      console.error("Failed to delete agent:", err);
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <Card key={i} className="@container/card p-4">
              <CardHeader>
                <CardDescription>
                  <Skeleton width={100} height={16} />
                </CardDescription>
                <CardTitle className="text-2xl font-semibold">
                  <Skeleton width={140} height={24} />
                </CardTitle>
                <CardAction>
                  <Skeleton circle width={24} height={24} />
                </CardAction>
              </CardHeader>
              <CardFooter className="flex flex-col items-start gap-[1rem] justify-between text-sm">
                <div className="flex gap-[.5rem]">
                  <Skeleton width={50} height={20} />
                  <Skeleton width={50} height={20} />
                  <Skeleton width={50} height={20} />
                </div>
                <div className="flex gap-[.5rem]">
                  <Skeleton circle width={24} height={24} />
                  <Skeleton circle width={24} height={24} />
                </div>
              </CardFooter>
            </Card>
          ))}
      </div>
    );
  }

  return (
    <>
      <Dialog open={openEmbed} onOpenChange={() => setOpenEmbed(!openEmbed)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Embed AI agent as a chatbot</DialogTitle>
            <DialogDescription>
              Copy and paste this snippet into the <code>HEAD</code> element on
              every webpage where you want to embed the Juno AI agent.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Embed Code
              </Label>
              <Textarea
                id="link"
                value={`<script>
  (function() {
    var s = document.createElement("script");
    s.src = "${process.env.NEXT_PUBLIC_URL}/widget.js";
    s.async = true;
    s.setAttribute("data-workspace-url", "${workspace}");
    s.setAttribute("data-agent-id", "${agentId}");
    document.body.appendChild(s);
  })();
</script>`}
                readOnly
                className="font-mono text-sm h-40"
              />
            </div>
          </div>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteAgentId}
        onOpenChange={() => setDeleteAgentId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              agent and remove its data from the workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteAgentId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {agents.map((agent) => (
          <Card key={agent._id} className="@container/card">
            <CardHeader>
              <CardDescription>{agent.role}</CardDescription>
              <CardTitle
                className="
    text-[1.5rem] 
    sm:text-lg 
    md:text-xl 
    lg:text-2xl 
    xl:text-2xl 
    font-semibold 
    tabular-nums
  "
              >
                {agent.name}
              </CardTitle>

              <CardAction>
                <Switch className="cursor-pointer" />
              </CardAction>
            </CardHeader>
            <CardFooter className="flex flex-col items-start gap-[1rem] justify-between text-sm">
              <div className="flex gap-[.5rem]">
                <Badge className="cursor-pointer">Train</Badge>
                <Badge className="cursor-pointer">Tools</Badge>
                <Badge className="cursor-pointer">Test</Badge>
              </div>

              <div className="flex gap-[.5rem]">
                <Edit
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/dashboard/${workspace}/agents/${agent._id}/edit`
                    )
                  }
                />
                <CodeXml
                  className="cursor-pointer"
                  onClick={() => {
                    setOpenEmbed(true), setAgentId(agent._id);
                  }}
                />
                <Trash
                  className="cursor-pointer"
                  onClick={() => setDeleteAgentId(agent._id)}
                />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
