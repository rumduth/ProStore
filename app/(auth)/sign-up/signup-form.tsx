"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpUser } from "@/lib/actions/user.actions";
import { signUpDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

export default function SignUpForm() {
  const [data, action, isPending] = useActionState(signUpUser, {
    success: false,
    message: "",
  });
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  return (
    <form className="space-y-3" action={action}>
      <input type="hidden" value={callbackUrl} name="callbackUrl" />
      <div className="space-y-2">
        <Label htmlFor="email">Name</Label>
        <Input
          type="text"
          placeholder="Enter your name"
          name="name"
          id="name"
          required
          defaultValue={signUpDefaultValues.name}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          placeholder="Enter your email"
          name="email"
          id="email"
          required
          autoComplete="email"
          defaultValue={signUpDefaultValues.email}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          placeholder="Enter your password"
          name="password"
          id="password"
          required
          autoComplete="password"
          defaultValue={signUpDefaultValues.password}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          type="password"
          placeholder="Enter your password again"
          name="confirmPassword"
          id="confirmPassword"
          required
          autoComplete="password"
          defaultValue={signUpDefaultValues.confirmPassword}
        />
      </div>
      <div>
        <Button className="w-full" variant="default" disabled={isPending}>
          {isPending ? "Submitting..." : "Sign Up"}
        </Button>
      </div>
      {data && !data.success && (
        <div className="text-center text-sm text-destructive">
          {data.message}
        </div>
      )}
      <div className="text-sm text-center text-muted-foreground ">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          target="_self"
          className="link text-green-400 font-bold"
        >
          Sign In
        </Link>
      </div>
    </form>
  );
}
