import { handleVote } from "@/app/actions";
import { CommentForm } from "@/app/components/CommentForm";
import { CopyLink } from "@/app/components/CopyLink";
import { RenderToJson } from "@/app/components/RendertoJson";
import { DownVote, UpVote } from "@/app/components/SubmitButtons";
import { prisma } from "@/app/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getData(id: string) {
  const data = await prisma.post.findUnique({
    where: {
      id: id,
    },
    select: {
      createdAt: true,
      title: true,
      imageString: true,
      textContent: true,
      subName: true,
      id: true,
      vote: {
        select: {
          voteType: true,
        },
      },
      comment: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          text: true,
          User: {
            select: {
              imageUrl: true,
              userName: true,
            },
          },
        },
      },
      Subpost: {
        select: {
          name: true,
          createdAt: true,
          description: true,
        },
      },
      User: {
        select: {
          userName: true,
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const data = await getData(id);

  return (
    <div className="max-w-[1200px] mx-auto flex gap-x-10 mt-4 mb-10">
      <div className="w-[70%] flex flex-col gap-y-5">
        <Card className="p-2 flex items-start flex-row">
          <div className="flex flex-col items-center gap-y-2 p-2">
            <form action={handleVote}>
              <input type="hidden" name="voteDirection" value="UP" />
              <input type="hidden" name="postId" value={data.id} />
              <UpVote />
            </form>

            {/* Votes counter */}
            {data.vote.reduce((acc, vote) => {
              if (vote.voteType === "UP") return acc + 1;
              if (vote.voteType === "DOWN") return acc - 1;

              return acc;
            }, 0)}

            <form action={handleVote}>
              <input type="hidden" name="voteDirection" value="DOWN" />
              <input type="hidden" name="postId" value={data.id} />
              <DownVote />
            </form>
          </div>

          <div className=" p-2 w-full">
            <p className="text-xs text-muted-foreground">
              Posted by b/{data.User?.userName}
            </p>
            <h1 className="font-medium mt-1 text-lg">{data.title}</h1>

            {data.imageString && (
              <Image
                src={data.imageString}
                alt="Post image"
                width={500}
                height={400}
                className="w-full h-auto object-contain mt-2"
              />
            )}

            {data.textContent && <RenderToJson data={data.textContent} />}

            <Separator className="my-5" />

            <div className="flex gap-x-5 items-center mt-3">
              <div className="flex gap-x-1 items-center">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground text-xs font-medium">
                  {data.comment.length} Comments
                </p>
              </div>

              <CopyLink id={id} />
            </div>

            <CommentForm postId={id} />

            <Separator className="my-5" />

            <div className="flex flex-col gap-y-7">
              {data.comment.map((item) => (
                <div key={item.id} className="flex flex-col">
                  <div className="flex items-center gap-x-3">
                    <img
                      src={
                        item.User?.imageUrl
                          ? item.User.imageUrl
                          : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
                      }
                      alt="User image"
                      className="w-7 h-7 rounded-full"
                    />

                    <h3 className="text-sm font-medium">
                      {item.User?.userName}
                    </h3>
                  </div>

                  <p className="ml-10 text-secondary-foreground text-sm tracking-wide">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      <div className="w-[30%]">
        <Card>
          <div className="bg-muted p-4 font-semibold">About Community</div>
          <div className="p-4">
            <div className="flex items-center gap-x-3">
              <Image
                src={`https://avatar.vercel.sh/${data?.subName}`}
                alt="Image of subpost"
                width={60}
                height={60}
                className="rounded-full h-16 w-16"
              />
              <Link href={`/p/${data?.subName}`} className="font-medium">
                r/{data?.subName}
              </Link>
            </div>

            <p className="text-sm font-normal text-secondary-foreground mt-3">
              {data?.Subpost?.description}
            </p>

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
              <Link href={`/p/${data?.subName}/create`}>Create Post</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
