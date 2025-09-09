"use client";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { registerUser } from "@/actions/registerUser";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { IconInnerShadowTop } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SubmitBtn = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending}
      type="submit"
      variant={'default'}
      className=" cursor-pointer w-full"
    >
      {pending ? "Loading" : "Create an account"}
    </Button>
  );
};

const Register = () => {
  const router = useRouter();

  const formAction = async (formData: FormData) => {
    const userInfo = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const data = await registerUser(userInfo);

      if (data) {
        const res = await signIn("credentials", {
          redirect: false,
          email: userInfo.email,
          password: userInfo.password,
        });

        if (res?.ok) {
          router.push(`dashboard/workspace/create`);
        } else {
          console.log("Login after register failed", res);
        }
      }
    } catch (error) {
      console.error("Registration failed", error);
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
          <h2 className="mt-10 text-center text-[1.3rem] font-semibold text-black">
            Sign Up To Account
          </h2>
        </div> */}

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action={formAction}>
            <div>
              <Label htmlFor="name">Name</Label>
              <div className="mt-2">
                <Input type="text" name="name" id="name" />
              </div>
            </div>

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
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-black underline">
              Login
            </Link>
          </p>
        </div>
      </div>
{/* 
      <div className="hidden lg:block lg:w-1/2">
        <Image
          src="/test2.webp"
          alt="Right side illustration"
          className="h-[100vh] w-full object-cover"
          width={100}
          height={100}
          quality={100}
        />
      </div> */}
    </div>
  );
};

export default Register;
