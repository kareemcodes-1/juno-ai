"use client"

import * as React from "react"
import {
  IconDashboard,
  IconMailbox,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

import { useParams, useRouter } from "next/navigation"
import { useWorkspaceStore } from "../lib/store"
import Link from "next/link"

type Workspace = {
  _id: string
  name: string
  slug: string
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { url } = useParams()
  const router = useRouter()
  const { setWorkspace, currentWorkspace } = useWorkspaceStore()

  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([])
  const [current, setCurrent] = React.useState<Workspace | null>(null)

  // keep workspace in global store
  React.useEffect(() => {
    if (url) setWorkspace(url as string)
  }, [url, setWorkspace])

  // fetch workspaces
  React.useEffect(() => {
    async function fetchWorkspaces() {
      try {
        const res = await fetch("/api/workspace", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch workspaces")
        const data = await res.json()
        setWorkspaces(data)

        const active = data.find((ws: Workspace) => ws.slug === url)
        setCurrent(active || null)
      } catch (err) {
        console.error(err)
      }
    }
    fetchWorkspaces()
  }, [url])

  const workspaceSlug = (url as string) || currentWorkspace || ""

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "AI Agents",
        url: `/dashboard/${workspaceSlug}/agents`,
        icon: IconDashboard,
      },
      {
        title: "Leads",
        url: `/dashboard/${workspaceSlug}/leads`,
        icon: IconMailbox,
      },
      {
        title: "Workspace Settings",
        url: `/dashboard/${workspaceSlug}/settings`,
        icon: IconFolder,
      },
    ],
    navSecondary: [
      {
        title: "Get Help",
        url: "/help",
        icon: IconHelp,
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
     <SidebarHeader>
  <SidebarMenu>
    <SidebarMenuItem className="flex items-center gap-2 px-2">
      {/* Juno link */}
      <Link
        href={`/`}
        className="flex items-center gap-2 text-base font-semibold"
      >
        <IconInnerShadowTop className="!size-5" />
        <span>Juno</span>
      </Link>

      {/* Current workspace name */}
      <span className="text-muted-foreground">
        {current?.name || ""}
      </span>

      {/* Chevron dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="p-0 h-6 w-6"
          >
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          {workspaces.map((ws) => (
            <DropdownMenuItem
              key={ws._id}
              onClick={() => router.push(`/dashboard/${ws.slug}`)}
            >
              {ws.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/workspace")}
            className="text-blue-600 font-medium"
          >
            + Create New Workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</SidebarHeader>


      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
