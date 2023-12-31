"use client";
import { ExtendedPost } from "@/types/db.t";
import { FC, useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import axios from "axios";
import { useSession } from "next-auth/react";
import Post from "@/components/ui/posts/Post";
import { Session } from "next-auth";
import { User } from "@prisma/client";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  user?: User;
  session?: Session | null;
}

const UserPostFeed: FC<PostFeedProps> = ({ initialPosts, user, session }) => {
  const lastPostRef = useRef<HTMLElement>(null);

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data: sesion } = useSession();

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query = `/api/userposts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}&userid=${user?.id}`;

      const { data } = await axios.get(query);

      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => pages.length + 1,
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  //todo: add loading state when fetching more posts

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;
          return acc;
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId === sesion?.user.id
        );

        if (index == posts.length - 1) {
          //if post is last in viewport, add ref to post
          return (
            <li key={post.id} ref={ref}>
              <Post
                subredditName={post.subreddit.name}
                post={post}
                commentAmt={post.comments.length}
                currentVote={currentVote}
                votesAmt={votesAmt}
                session={session}
                isModerator={false}
              />
            </li>
          );
        } else {
          return (
            <Post
              key={post.id}
              subredditName={post.subreddit.name}
              post={post}
              commentAmt={post.comments.length}
              currentVote={currentVote}
              votesAmt={votesAmt}
              session={session}
              isModerator={false}
            />
          );
        }
      })}
    </ul>
  );
};

export default UserPostFeed;
