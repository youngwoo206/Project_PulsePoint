import UserFeed from "@/app/u/feed/UserFeed";
import UserAvatar from "@/components/ui/navbar/UserAvatar";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { LucideSettings } from "lucide-react";
import Link from "next/link";

interface UserPageProps {
  params: {
    slug: string;
  };
}

const UserPage = async ({ params }: UserPageProps) => {
  const { slug } = params;
  const session = await getAuthSession();

  const user = await db.user.findFirst({
    where: {
      username: slug,
    },
  });

  const postCount = await db.post.count({
    where: {
      authorId: user?.id,
    },
  });

  const commentCount = await db.comment.count({
    where: {
      authorId: user?.id,
    },
  });

  const subCount = await db.subscription.count({
    where: {
      userId: user?.id,
    },
  });

  return (
    <div className="pt-12">
      <h1 className="font-bold text-3xl md:text-4xl">{`${user?.username}'s posts`}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        <div className="md:col-span-2">
          {/* filters */}
          {/* <div className="rounded-md bg-white shadow">recent</div> */}
          {/* posts feed */}
          {/* @ts-expect-error */}
          <UserFeed user={user} />
        </div>
        <div className="overflow-hidden h-fit  order-first md:order-last">
          {/*User info */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="bg-pink px-6 py-4 rounded-lg flex justify-between">
              <div>
                <UserAvatar name={user?.name} image={user?.image} />
                <p className="font-semibold py-3">u/{user?.username}</p>
              </div>
              {session?.user.id == user?.id ? (
                <Link href={"/settings"}>
                  <LucideSettings
                    strokeWidth={1.5}
                    className="w-5 h-5 hover:rotate-45 duration-300"
                  />
                </Link>
              ) : null}
            </div>
            <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6 ">
              <p className="text-zinc-500">Stats:</p>
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-zinc-500">Posts: {postCount}</p>
                <p className="text-zinc-500">Comments: {commentCount}</p>
                <p className="text-zinc-500">Subscriptions: {subCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
