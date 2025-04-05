"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { updateUsername, updateProfilePicture } from "../actions";
import { SubmitButton } from "./SubmitButtons";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

interface UpdateState {
  message: string;
  status: "green" | "error" | "";
  newUsername?: string;
  newPicture?: string;
}

const initialState: UpdateState = {
  message: "",
  status: "",
  newUsername: "",
  newPicture: "",
};

export function SettingsForm({
  username: initialUsername,
  imageUrl: initialImageUrl,
}: {
  username: string | null | undefined;
  imageUrl: string | null | undefined;
}) {
  const [state, formAction] = useActionState(updateUsername, initialState);
  const [pictureState, pictureFormAction] = useActionState(updateProfilePicture, initialState);
  const [username, setUsername] = useState(initialUsername ?? "");
  const [imageUrl, setImageUrl] = useState(initialImageUrl ?? "");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
  }, [state]);

  useEffect(() => {
    if (pictureState?.status === "green" && pictureState.newPicture) {
      toast.success("Successfully updated", {
        description: pictureState.message,
      });
      setImageUrl(pictureState.newPicture);
      setPreviewUrl(null);
    } else if (pictureState?.status === "error") {
      toast.error("Error", {
        description: pictureState.message,
      });
    }
  }, [pictureState]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
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

      <form action={pictureFormAction}>
        <Separator className="my-4" />
        <Label className="text-lg">Profile Picture</Label>
        <p className="text-muted-foreground">
          You are able to change your profile picture here
        </p>

        <div className="mt-4 space-y-5">
          <div className="relative w-32 h-32">
            <Image
              src={previewUrl || imageUrl || "/default.png"}
              alt="Profile picture"
              fill
              className="rounded-full object-cover"
            />
          </div>

          <div className="flex justify-between items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              name="profilePicture"
              onChange={handleImageChange}
              className="max-w-[250px]"
            />
            <SubmitButton text="Update Picture" />
          </div>

          {pictureState?.status === "error" && (
            <p className="text-red-400 mt-1 text-center">{pictureState.message}</p>
          )}
        </div>
      </form>
    </div>
  );
}
