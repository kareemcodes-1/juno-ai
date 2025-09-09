"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

const Page = () => {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-[2.5rem] font-bold">Workspace Settings</h1>

      <div className="flex flex-col gap-[.5rem]">
        <Label>Workspace Name</Label>
        <Input />
      </div>

      <div className="flex flex-col gap-[.5rem]">
        <Label>Workspace URL</Label>
        <Input  />
      </div>

      {/* <Button onClick={submitForm} disabled={loading} className="w-[8rem]">
        {loading ? "Saving..." : "Save Workspace"}
      </Button> */}

    <h1 className="text-[2.5rem] font-bold">Delete Workspace</h1>

      {/* Delete Workspace with AlertDialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-[8rem]">
            Delete Workspace
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The workspace and all related data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction >Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Page