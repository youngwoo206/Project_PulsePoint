import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { notFound } from "next/navigation";
import MiniCreatePost from "@/components/ui/subreddit/MiniCreatePost";
import PostFeed from "@/components/ui/posts/PostFeed";
import Tag from "@/components/ui/subreddit/Tag";
import AddTag from "@/components/ui/subreddit/AddTag";

interface PageProps {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { slug } = params;

  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });

  const moderator = !session?.user
    ? undefined
    : await db.moderation.findFirst({
        where: {
          subreddit: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });
  const isModerator = !!moderator;

  if (!subreddit) {
    return notFound();
  }

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        r/{subreddit.name}
      </h1>
      <div className="flex gap-2">
        <Tag name="funnyyyyy" />
        <Tag name="fun" />
        {isModerator ? <AddTag /> : null}
      </div>
      <MiniCreatePost session={session} />
      <PostFeed
        initialPosts={subreddit.posts}
        subredditName={subreddit.name}
        session={session}
        isModerator={isModerator}
      />
    </>
  );
};

export default Page;
