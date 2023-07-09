import { buttonVariants } from "@/components/ui/Button";
import ToFeedButton from "@/components/ui/ToFeedButton";
import UserAvatar from "@/components/ui/navbar/UserAvatar";
import SubscribeToggle from "@/components/ui/subreddit/SubscribeToggle";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

const Layout = async ({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) => {
  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subreddit: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = !!subscription;

  if (!subreddit) return notFound();

  const memberCount = await db.subscription.count({
    where: {
      subreddit: {
        name: slug,
      },
    },
  });

  const memberArr = await db.user.findMany({
    include: {
      Subscription: {
        where: {
          subreddit: {
            name: slug,
          },
        },
      },
    },
  });

  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div>
        <ToFeedButton />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <ul className="flex flex-col col-span-2 space-y-6">{children}</ul>

          <div>
            {/* subreddit info */}
            <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
              <div className="px-6 py-4">
                <p className="font-semibold py-3">About r/{subreddit.name}</p>
              </div>

              <dl className="divide-y divide-grey-100 px-6 py-4 text-sm leading-6 bg-white">
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Created</dt>
                  <dt className="text-gray-700">
                    <time dateTime={subreddit.createdAt.toDateString()}>
                      {format(subreddit.createdAt, "MMMM d, yyyy")}
                    </time>
                  </dt>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Members</dt>
                  <dt className="text-gray-700">
                    <div className="text-gray-900">{memberCount}</div>
                  </dt>
                </div>
                {subreddit.creatorId === session?.user.id ? (
                  <div className="flex justify-between gap-x-4 py-3">
                    <p className="text-gray-500">
                      You are the creator of this community
                    </p>
                  </div>
                ) : null}

                {subreddit.creatorId !== session?.user.id ? (
                  <SubscribeToggle
                    subredditId={subreddit.id}
                    subredditName={subreddit.name}
                    isSubscribed={isSubscribed}
                  />
                ) : null}

                <Link
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full mb-6",
                  })}
                  href={`r/${slug}/submit`}
                >
                  Create Post
                </Link>
              </dl>
            </div>
            {/* see subreddit members */}
            {/* <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last mt-9">
              <div className="px-6 py-4">
                <p className="font-semibold py-3">r/{subreddit.name} Members</p>
              </div>
              <dl className="divide-y divide-grey-100 px-6 py-4 text-sm leading-6 bg-white">
                <div> */}
            {/* @ts-ignore */}
            {/* {memberArr.map((user) => {
                    return <p key={user.id}>{user.username}</p>;
                  })}
                </div>
              </dl>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Layout;
