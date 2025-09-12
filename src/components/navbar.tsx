import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconInnerShadowTop } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Workspace } from "../../types";


export function Navbar({workspaces}: {workspaces: Workspace[]}) {
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

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-[1rem]">
      <div className="container flex h-16 items-center justify-between">
        {/* <div className="flex items-center gap-6"> */}
           <Link href={`/`} className="flex items-center justify-center gap-[.3rem]">
                <IconInnerShadowTop className="!size-6" />
                <span className="text-[1.3rem] font-semibold">Juno</span>
          </Link>

          <div className="hidden md:flex items-center justify-center gap-[3rem] ">
            <Link
              href="/"
              className="text-[1rem] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-[1rem] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Enterprises
            </Link>

            <Link
              href="/contact"
              className="text-[1rem] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </div>


        <div className="flex items-center gap-4">
          {session ? (
             <Button size="sm" onClick={handleRedirect}>Dashboard</Button>
          ): (
            <>
            <Button variant="ghost" size="sm">
            <Link href={'/auth/login'}>Sign In</Link>
          </Button>
          <Button size="sm"><Link href={'/auth/register'}>Try for free</Link></Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
