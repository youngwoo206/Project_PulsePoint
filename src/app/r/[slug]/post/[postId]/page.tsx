import CommentsSection from "@/components/ui/comments/CommentsSection";
import EditorOutput from "@/components/ui/posts/EditorOutput";
import PostVoteServer from "@/components/ui/posts/voting/PostVoteServer";
import PostVoteShell from "@/components/ui/posts/voting/PostVoteShell";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { formatTimeToNow } from "@/lib/utils";
import { CachedPost } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: {
    postId: string;
  };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const Page = async ({ params }: PageProps) => {
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`
  )) as CachedPost;

  let post: (Post & { votes: Vote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  if (!post && !cachedPost) return notFound();

  return (
    <div>
      <div className="rounded-md bg-white shadow">
        <div className="px-6 py-4 flex justify-between">
          <Suspense fallback={<PostVoteShell />}>
            {/*@ts-expect-error*/}
            <PostVoteServer
              postId={post?.id ?? cachedPost.id}
              getData={async () => {
                return await db.post.findUnique({
                  where: {
                    id: params.postId,
                  },
                  include: {
                    votes: true,
                  },
                });
              }}
            />
          </Suspense>
          <div className="w-0 flex-1">
            <div className="max-h-40 mt-1 text-xs text-gray-500">
              <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
                Posted by{" "}
                <a
                  href={`/u/${post?.author.username}`}
                  className="underline hover:text-zinc-500 text-black"
                >
                  {post?.author.username}
                </a>{" "}
                {formatTimeToNow(
                  new Date(post?.createdAt ?? cachedPost.createdAt)
                )}
              </p>
              <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
                {post?.title ?? cachedPost.title}
              </h1>
              <EditorOutput content={post?.content ?? cachedPost.content} />
            </div>
          </div>
        </div>
        <div className="px-6 py-4">
          <Suspense
            fallback={
              <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
            }
          >
            {/*@ts-ignore */}
            <CommentsSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Page;
