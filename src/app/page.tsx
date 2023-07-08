import { buttonVariants } from "@/components/ui/Button";
import CustomFeed from "@/components/ui/feeds/CustomFeed";
import GeneralFeed from "@/components/ui/feeds/GeneralFeed";
import { getAuthSession } from "@/lib/auth";
import { Flame, HomeIcon, LucideUser } from "lucide-react";
import { db } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  async function feed() {
    const session = await getAuthSession();
    const followedCommunities = await db.subscription.count({
      where: {
        userId: session?.user.id,
      },
    });

    if (session && followedCommunities) {
      /*@ts-expect-error*/
      return <CustomFeed />;
    } else {
      /*@ts-expect-error*/
      return <GeneralFeed />;
    }
  }

  const topCommunities = await db.subreddit.findMany({
    take: 3,
    orderBy: {
      subscribers: {
        _count: "desc",
      },
    },
    include: {
      _count: {
        select: { subscribers: true },
      },
    },
  });

  return (
    <div className="pt-12">
      <h1 className="font-bold text-3xl md:text-4xl">Your Feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* todo: add categories or tags to posts for general feed filter? */}
        {feed()}
        <div className="overflow-hidden h-fit  order-first md:order-last">
          {/*subreddit info */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="bg-emerald-100 px-6 py-4 rounded-lg">
              <p className="font-semibold py-3 flex items-center gap-1.5">
                <HomeIcon className="w-4 h-4" />
                Home
              </p>
            </div>

            <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6 ">
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-zinc-500">
                  Your personal PulsePoint homepage. Come here to check in with
                  your favorite communities
                </p>
              </div>
              <Link
                className={buttonVariants({ className: "w-full mt-4 mb-6" })}
                href="/r/create"
              >
                Create Community
              </Link>
            </div>
          </div>
          {/*Recommended Communities */}
          <div className="rounded-lg border border-gray-200 mt-6 bg-white">
            <div className="bg-pink px-6 py-4 rounded-lg">
              <p className="font-semibold py-3 flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                Top Communities
              </p>
            </div>
            <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-zinc-500">
                  Find the hottest new communities here!
                </p>
              </div>
            </div>
            <div className="mb-6">
              {topCommunities.map((subreddit) => {
                return (
                  <a
                    href={`r/${subreddit.name}`}
                    key={subreddit.id}
                    className="border border-gray-200 rounded-lg mx-4 my-2 flex justify-between items-center hover:bg-gray-50"
                  >
                    <p className="text-zinc-500 text-sm pl-4 py-1">
                      r/{subreddit.name}
                    </p>
                    <p className="text-zinc-500 text-sm pr-3 flex">
                      <LucideUser className="h-4 w-4 mx-2" />
                      {subreddit._count.subscribers}
                    </p>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
