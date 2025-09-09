"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { useSession, signOut } from "next-auth/react";

const Page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name as string);
      setEmail(session.user.email as string);
    }
  }, [session]);

  async function handleSubmit() {
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/${session?.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      if (res.ok) {
        toast.success(newPassword ? "Password updated!" : "Profile updated!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to update account");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating account");
    } finally {
      setLoading(false);
    }
  }

  // Delete user
  async function deleteAccount() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/${session?.user.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Account deleted!");
        await signOut({ redirect: true, callbackUrl: "/" });
      } else {
        toast.error("Failed to delete account");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-[2.5rem] font-bold">Account Settings</h1>

      {/* Name */}
      <div className="flex flex-col gap-[.5rem]">
        <Label>Display Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-[.5rem]">
        <Label>Email</Label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      {/* Change Password */}
      <div className="flex flex-col gap-[.5rem] mt-6">
        <h2 className="text-[1.5rem] font-semibold">Change Password</h2>

        <Label>Current Password</Label>
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <Label>New Password</Label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <Label>Confirm New Password</Label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <Button onClick={handleSubmit} disabled={loading} className="w-[10rem]">
        {loading ? "Saving..." : "Save Changes"}
      </Button>

      {/* Delete Account */}
      <h1 className="text-[2.5rem] font-bold mt-8">Delete Account</h1>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-[10rem]">
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete {name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Your account and all related data
              will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteAccount}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Page;
