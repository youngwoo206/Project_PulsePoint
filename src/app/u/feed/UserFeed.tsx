import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import UserPostFeed from "./UserPostFeed";
import { User } from "@prisma/client";

interface UserFeedProps {
  user: User;
}

const UserFeed = async ({ user }: UserFeedProps) => {
  const posts = await db.post.findMany({
    where: {
      authorId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: 4,
  });
  return <UserPostFeed initialPosts={posts} />;
};

export default UserFeed;
