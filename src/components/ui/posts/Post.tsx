import { FC, ReactNode, useRef } from "react";
import { Post, User, Vote } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import { LucideTrash, MessageSquare } from "lucide-react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./voting/PostVoteClient";
import { Session } from "next-auth";
import { Button } from "../Button";

type PartialVote = Pick<Vote, "type">;

interface PostProps {
  subredditName: String;
  commentAmt: ReactNode;
  post: Post & {
    author: User;
    votes: Vote[];
  };
  votesAmt: number;
  currentVote?: PartialVote;
  session?: Session | null;
}

const Post: FC<PostProps> = ({
  subredditName,
  post,
  commentAmt,
  votesAmt: votesAmt,
  currentVote,
  session,
}) => {
  const postRef = useRef<HTMLDivElement>(null);

  return (
    <div className="rounded-md bg-white shadow">
      <div className="px-6 py-4 flex justify-between">
        <PostVoteClient
          initialVotesAmt={votesAmt}
          postId={post.id}
          initialVote={currentVote?.type}
        />

        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {subredditName ? (
              <>
                <a
                  href={`/r/${subredditName}`}
                  className="underline text-zinc-900 text-sm underline-offset-2"
                >
                  r/{subredditName}
                </a>
                <span className="px-1">-</span>
              </>
            ) : null}
            <span>Posted by {post.author.username}</span>
            {"  "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>

          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>

          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={postRef}
          >
            <EditorOutput content={post.content} />
            {postRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 z-20 text-sm p-4 sm:px-6 flex justify-between">
        <a
          href={`/r/${subredditName}/post/${post.id}`}
          className="w-fit flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          {commentAmt} comments
        </a>
        {post.authorId === session?.user.id ? (
          <Button size="sm" variant="subtle">
            <LucideTrash className="w-4 h-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default Post;
