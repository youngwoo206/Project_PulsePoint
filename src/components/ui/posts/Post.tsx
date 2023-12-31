"use client";
import { FC, ReactNode, useRef, useState } from "react";
import { Post, User, Vote } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import { LucideTrash, MessageSquare } from "lucide-react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./voting/PostVoteClient";
import { Session } from "next-auth";
import { Button } from "../Button";
import DeletePostModal from "./DeletePostModal";
import { useMutation } from "@tanstack/react-query";
import { PostDeletionRequest } from "@/lib/validators/post";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useRouter } from "next/navigation";

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
  isModerator: boolean;
}

const Post: FC<PostProps> = ({
  subredditName,
  post,
  commentAmt,
  votesAmt: votesAmt,
  currentVote,
  session,
  isModerator,
}) => {
  const postRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { loginToast } = useCustomToast();
  const [modal, setModal] = useState(false);

  const { mutate: deletePost, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: PostDeletionRequest = {
        id: post.id,
      };

      const { data } = await axios.post("/api/subreddit/post/delete", payload);
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
      }
      toast({
        title: "There was an error",
        description: "Could not delete post.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Post successfully deleted",
      });
    },
  });

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
            <span>
              Posted by{" "}
              <a
                href={`/u/${post.author.username}`}
                className="underline hover:text-zinc-500 text-black"
              >
                {post.author.username}
              </a>
            </span>
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
        {post.authorId === session?.user.id || isModerator ? (
          <Button
            size="sm"
            variant="subtle"
            onClick={() => {
              setModal(true);
            }}
          >
            <LucideTrash className="w-4 h-4" />
          </Button>
        ) : null}
      </div>
      {modal ? (
        <DeletePostModal
          setModal={setModal}
          deletePost={deletePost}
          router={router}
        />
      ) : null}
    </div>
  );
};

export default Post;
