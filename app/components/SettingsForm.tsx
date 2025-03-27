"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { updateUsername } from "../actions";
import { SubmitButton } from "./SubmitButtons";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

interface UpdateState {
  message: string;
  status: "green" | "error" | "";
  newUsername?: string;
}

const initialState: UpdateState = {
  message: "",
  status: "",
  newUsername: "",
};

export function SettingsForm({
  username: initialUsername,
}: {
  username: string | null | undefined;
}) {
  const [state, formAction] = useActionState(updateUsername, initialState);
  const [username, setUsername] = useState(initialUsername ?? "");

  useEffect(() => {
    if (state?.status === "green" && state.newUsername) {
      toast.success("Successfully updated", {
        description: state.message,
      });
      setUsername(state.newUsername);
    } else if (state?.status === "error") {
      toast.error("Error", {
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <form
      action={async (formData) => {
        const newUsername = formData.get("username") as string;
        await formAction(formData);
        setUsername(newUsername);
      }}
    >
      <h1 className="text-4xl font-extrabold tracking-tight">Settings</h1>

      <Separator className="my-4" />
      <Label className="text-lg">Username</Label>
      <p className="text-muted-foreground">
        You are able to change your username here
      </p>

      <Input
        defaultValue={username ?? undefined}
        onChange={(e) => setUsername(e.target.value)}
        name="username"
        required
        className="mt-2"
        min={2}
        maxLength={21}
      />

      {state?.status === "error" && (
        <p className="text-red-400 mt-1">{state.message}</p>
      )}

      <div className="w-full flex mt-5 gap-x-5 justify-end">
        <Button variant="secondary" asChild>
          <Link href="/">Cancel</Link>
        </Button>
        <SubmitButton text="Change Username" />
      </div>
    </form>
  );
}
