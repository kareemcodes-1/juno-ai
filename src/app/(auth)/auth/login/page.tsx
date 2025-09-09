"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {toast} from "react-hot-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconInnerShadowTop } from "@tabler/icons-react";

const SubmitBtn = () => {
  const { pending } = useFormStatus();
  return (
     <Button
      disabled={pending}
      type="submit"
      variant={'default'}
      className=" cursor-pointer w-full"
    >
      {pending ? "Loading" : "Login"}
    </Button>
  );
};

const Login = () => {
  const router = useRouter();

  const formAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      router.push("/");
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex flex-col justify-center w-full px-6 py-12 lg:px-8">

         <Link href={''} className="flex items-center justify-center gap-[.5rem]">
                <IconInnerShadowTop className="!size-8" />
                <span className="text-[2rem] font-semibold">Juno</span>
          </Link>
        {/* <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-[1.3rem] font-semibold text-black bebas">
            Sign In To Account
          </h2>
        </div> */}

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action={formAction}>
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-2">
                <Input type="email" name="email" id="email" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <div className="text-[.8rem]">
                  <a
                    href="#"
                    className="font-semibold text-muted-foreground bebas"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <Input type="password" name="password" id="password" />
              </div>
            </div>

            <div>
              <SubmitBtn />
            </div>
          </form>

          <p className="mt-10 text-center text-[.825rem] text-muted-foreground font-[200]">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-semibold text-black underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
