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

  return <div className="max-w-4-xl mx-auto">{user?.username}</div>;
};

export default UserPage;
