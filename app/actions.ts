"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "./lib/prisma";
import { Prisma, VoteType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { JSONContent } from "@tiptap/react";

export async function updateUsername(prevState: unknown, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const username = formData.get("username") as string;

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { userName: username },
    });

    revalidatePath("/");

    return {
      message: "Name updated successfully",
      status: "green",
      newUsername: username,
    };
  } catch (_e: unknown) {
    if (
      _e instanceof Prisma.PrismaClientKnownRequestError &&
      _e.code === "P2002"
    ) {
      return { message: "This username is already used", status: "error" };
    }
    throw _e;
  }
}

export async function createCommunity(prevState: unknown, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  try {
    const name = formData.get("name") as string;

    const { name: createdName } = await prisma.subpost.create({
      data: { name, userId: user.id },
      select: { name: true },
    });

    revalidatePath("/");
    return redirect(`/p/${createdName}`);
  } catch (_e: unknown) {
    if (
      _e instanceof Prisma.PrismaClientKnownRequestError &&
      _e.code === "P2002"
    ) {
      return { message: "This name is already used", status: "error" };
    }
    throw _e;
  }
}

export async function updateSubDescription(
  prevState: unknown,
  formData: FormData
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  try {
    const subName = formData.get("subName") as string;
    const description = formData.get("description") as string;

    await prisma.subpost.update({
      where: { name: subName },
      data: { description },
    });

    revalidatePath(`/p/${subName}`);
    return { status: "green", message: "Successfully updated the description" };
  } catch {
    return { status: "error", message: "Something went wrong" };
  }
}

export async function createPost(
  { jsonContent }: { jsonContent: JSONContent | null },
  formData: FormData
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const title = formData.get("title") as string;
  const imageUrl = formData.get("imageUrl") as string | null;
  const subName = formData.get("subName") as string;

  const { id } = await prisma.post.create({
    data: {
      title,
      imageString: imageUrl ?? undefined,
      subName,
      userId: user.id,
      textContent: jsonContent ?? undefined,
    },
    select: { id: true },
  });

  redirect(`/post/${id}`);
}

export async function handleVote(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const postId = formData.get("postId") as string;
  const voteDirection = formData.get("voteDirection") as VoteType;

  const vote = await prisma.vote.findFirst({
    where: { postId, userId: user.id },
  });

  if (vote) {
    if (vote.voteType === voteDirection) {
      await prisma.vote.delete({ where: { id: vote.id } });
    } else {
      await prisma.vote.update({
        where: { id: vote.id },
        data: { voteType: voteDirection },
      });
    }
    return revalidatePath("/");
  }

  await prisma.vote.create({
    data: { voteType: voteDirection, userId: user.id, postId },
  });

  return revalidatePath("/");
}

export async function createComment(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const comment = formData.get("comment") as string;
  const postId = formData.get("postId") as string;

  await prisma.comment.create({
    data: { text: comment, userId: user.id, postId },
  });

  revalidatePath(`/post/${postId}`);
}

export async function updateProfilePicture(prevState: unknown, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  try {
    const picture = formData.get("profilePicture") as File;
    
    if (!picture || !picture.type.startsWith("image/")) {
      return { 
        message: "Please upload a valid image file", 
        status: "error" 
      };
    }

    // Convert the file to base64 string
    const bytes = await picture.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const imageUrl = `data:${picture.type};base64,${base64Image}`;

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        imageUrl
      },
    });

    revalidatePath("/");
    return {
      message: "Profile picture updated successfully",
      status: "green",
      newPicture: imageUrl
    };
  } catch (error) {
    return { 
      message: "Failed to update profile picture", 
      status: "error" 
    };
  }
}
