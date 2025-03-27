"use client";

import { createCommunity } from "@/app/actions";
import { refreshCommunities } from "@/app/components/SearchCommunity";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

const initialState = {
  message: "",
  status: "",
};

export default function SubpostPage() {
  const [state, formAction] = useActionState(createCommunity, initialState);

  useEffect(() => {
    if (state.status === "error") {
      toast.error("Error", {
        description: state.message,
      });
    }
  }, [state]);

  return (
    <div className="max-w-[1000px] mx-auto flex flex-col mt-4">
      <form action={formAction}>
        <h1 className="text-3xl font-bold tracking-tight">Create Community</h1>
        <Separator className="my-4" />
        <Label className="text-lg">Name</Label>
        <p className="text-muted-foreground">
          Community names including capitalization cannot be changed!
        </p>

        <div className="relative mt-3">
          <p className="absolute left-0 w-8 flex items-center justify-center h-full text-muted-foreground">
            p/
          </p>
          <Input
            name="name"
            required
            className="pl-6"
            minLength={2}
            maxLength={30}
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              input.value = input.value.replace(/\s/g, "");
            }}
          />
        </div>

        <p className="mt-1 text-red-500">{state.message}</p>

        <div className="w-full flex mt-4 gap-x-3 justify-end">
          <Button variant="secondary" asChild>
            <Link href="/">Cancel</Link>
          </Button>
          <SubmitButton text="Submit" />
        </div>
      </form>
    </div>
  );
}
