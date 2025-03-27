import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CopyLink } from "./CopyLink";
import { handleVote } from "../actions";
import { DownVote, UpVote } from "./SubmitButtons";
import { RenderToJson } from "./RendertoJson";
import { JSONContent } from "@tiptap/react";

interface AppProps {
  title: string;
  jsonContent: unknown;
  id: string;
  subName: string;
  userName: string;
  imageString: string | null;
  voteCount: number;
  commentAmount: number;
}

export function PostCard({
  title,
  jsonContent,
  id,
  subName,
  userName,
  imageString,
  voteCount,
  commentAmount,
}: AppProps) {
  return (
    <Card className="flex flex-row relative overflow-hidden items-start">
      <div className="flex flex-col items-center gap-y-2 bg-muted p-2 h-full">
        <form action={handleVote}>
          <input type="hidden" name="voteDirection" value="UP" />
          <input type="hidden" name="postId" value={id} />
          <UpVote />
        </form>

        {/* Votes counter */}
        {voteCount}

        <form action={handleVote}>
          <input type="hidden" name="voteDirection" value="DOWN" />
          <input type="hidden" name="postId" value={id} />
          <DownVote />
        </form>
      </div>

      <div>
        <div className="flex items-center gap-x-2 p-2">
          <Link href={`/p/${subName}`} className="font-semibold text-xs">
            p/{subName}
          </Link>
          <p className="text-xs text-muted-foreground">
            Posted by <span className="hover:text-primary">b/{userName}</span>
          </p>
        </div>

        <div className="px-2">
          <Link href={`/post/${id}`}>
            <h1 className="text-lg font-medium">{title}</h1>
          </Link>
        </div>

        <div className="max-h-[300px] overflow-hidden">
          {imageString ? (
            <Image
              src={imageString}
              alt="Post Image"
              width={600}
              height={300}
              className="w-full h-full"
            />
          ) : (
            <RenderToJson data={jsonContent as JSONContent} />
          )}
        </div>

        <div className="flex items-center gap-x-5 m-3">
          <div className="flex items-center gap-x-1">
            <Link href={`/post/${id}`} className="flex items-center gap-x-1">
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
              <p className="text-muted-foreground font-medium text-xs">
                {commentAmount} Comments
              </p>
            </Link>
          </div>

          <CopyLink id={id} />
        </div>
      </div>
    </Card>
  );
}
