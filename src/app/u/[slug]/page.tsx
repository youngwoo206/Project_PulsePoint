import UserFeed from "@/app/u/feed/UserFeed";
import UserAvatar from "@/components/ui/navbar/UserAvatar";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

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
            <div className="bg-emerald-100 px-6 py-4 rounded-lg">
              <UserAvatar user={user} />
              <p className="font-semibold py-3">u/{user?.username}</p>
              {session?.user.id == user?.id ? <div>this is me</div> : null}
            </div>
            <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6 ">
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-zinc-500">
                  Your personal PulsePoint homepage. Come here to check in with
                  your favorite communities
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
