import UserAvatar from "@/components/ui/navbar/UserAvatar";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

const UserLayout = async ({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) => {
  const session = await getAuthSession();

  const user = await db.user.findFirst({
    where: {
      username: slug,
    },
  });

  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <ul className="flex flex-col col-span-2 space-y-6">{children}</ul>

          <div>
            {/* subreddit info */}
            <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
              <div className="px-6 py-4">
                <UserAvatar user={user} />
                <p className="font-semibold py-3">u/{user?.username}</p>
                {session?.user.id == user?.id ? <div>this is me</div> : null}
              </div>

              <dl className="divide-y divide-grey-100 px-6 py-4 text-sm leading-6 bg-white">
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Created</dt>
                  <dt className="text-gray-700">
                    <p>hello</p>
                  </dt>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserLayout;
