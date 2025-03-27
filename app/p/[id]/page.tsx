import Pagination from "@/app/components/Pagination";
import { PostCard } from "@/app/components/PostCard";
import { SubDescriptionForm } from "@/app/components/SubDescriptionForm";
import { prisma } from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Calendar, FileQuestion, ImageDown, Link2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import pfp from "../../../public/pfp.png";
import { Input } from "@/components/ui/input";
import { unstable_noStore as noStore } from "next/cache";

async function getData(name: string, searchParam: string) {
  noStore();
  const [count, data] = await prisma.$transaction([
    prisma.post.count({
      where: {
        subName: name,
      },
    }),

    prisma.subpost.findUnique({
      where: {
        name: name,
      },
      select: {
        name: true,
        createdAt: true,
        description: true,
        userId: true,
        posts: {
          take: 5,
          skip: searchParam ? (Number(searchParam) - 1) * 5 : 0,
          select: {
            comment: {
              select: {
                id: true,
              },
            },
            title: true,
            imageString: true,
            id: true,
            textContent: true,
            vote: {
              select: {
                userId: true,
                voteType: true,
              },
            },
            User: {
              select: {
                userName: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return { data, count };
}

export default async function SubpostRoute({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page: string };
}) {
  const { id } = params;
  const { page } = searchParams;
  const { data, count } = await getData(id, page ?? "1");
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className="max-w-[1000px] mx-auto flex gap-x-10 mt-4 mb-10">
      <div className="w-[65%] flex flex-col gap-y-5">
        <Card className="px-4 py-3 flex flex-row items-center gap-x-4">
          <Image src={pfp} alt="pfp" className="h-12 w-fit" />

          <Link
            href={user?.id ? `/p/${data?.name}/create` : "/api/auth/login"}
            className="w-full"
          >
            <Input placeholder="Create your post" />
          </Link>

          <div className="flex items-center gap-x-2">
            <Button variant="outline" size="icon" asChild>
              <Link
                href={user?.id ? `/p/${data?.name}/create` : "/api/auth/login"}
              >
                <ImageDown className="w-4 h-4" />
              </Link>
            </Button>

            <Button variant="outline" size="icon" asChild>
              <Link
                href={user?.id ? `/p/${data?.name}/create` : "/api/auth/login"}
              >
                <Link2 className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </Card>

        {data?.posts.length === 0 ? (
          <div className="flex min-h-[300px] flex-col justify-center items-center rounded-md border border-dashed p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <FileQuestion className="h-10 w-10 text-primary" />
            </div>

            <h2 className="mt-6 text-xl font-semibold">No post yet</h2>
          </div>
        ) : (
          <>
            {data?.posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                imageString={post.imageString}
                title={post.title}
                commentAmount={post.comment.length}
                subName={data.name}
                userName={post.User?.userName as string}
                jsonContent={post.textContent}
                voteCount={post.vote.reduce((acc, vote) => {
                  if (vote.voteType === "UP") return acc + 1;
                  if (vote.voteType === "DOWN") return acc - 1;

                  return acc;
                }, 0)}
              />
            ))}

            <Pagination totalPages={Math.ceil(count / 5)} />
          </>
        )}
      </div>

      <div className="w-[35%]">
        <Card>
          <div className="bg-muted p-4 font-semibold">About Community</div>
          <div className="p-4">
            <div className="flex items-center gap-x-3">
              <Image
                src={`https://avatar.vercel.sh/${data?.name}`}
                alt="Image of subpost"
                width={60}
                height={60}
                className="rounded-full h-16 w-16"
              />
              <Link href={`/p/${data?.name}`} className="font-medium">
                p/{data?.name}
              </Link>
            </div>
            {user?.id === data?.userId ? (
              <SubDescriptionForm
                description={data?.description}
                subName={id}
              />
            ) : (
              <p className="text-sm font-normal text-secondary-foreground mt-3">
                {data?.description}
              </p>
            )}

            <div className="flex gap-x-2 mt-3 items-center">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <p className="font-medium text-sm text-muted-foreground">
                Created at{" "}
                {new Date(data?.createdAt as Date).toLocaleDateString("en-id", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
              </p>
            </div>

            <Separator className="mt-3 mb-5" />

            <Button asChild className="w-full" size="lg">
              <Link
                href={user?.id ? `/p/${data?.name}/create` : "/api/auth/login"}
              >
                Create Post
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
