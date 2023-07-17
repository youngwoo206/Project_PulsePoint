"use client";
import { FC, useRef, useState, useCallback, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../navbar/Command";
import debounce from "lodash.debounce";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Moderation, Subreddit, Subscription, User } from "@prisma/client";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { User2 } from "lucide-react";
import { usePathname } from "next/navigation";
import AddModerator from "./AddModerator";

interface MemberSearchbarProps {
  subredditId: string;
}

const MemberSearchbar: FC<MemberSearchbarProps> = ({ subredditId }) => {
  const [input, setInput] = useState<string>("");
  const commandRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];

      const { data } = await axios.get(
        `/api/search/members?q=${input}&s=${subredditId}`
      );

      return data as (Subscription & {
        user: User;
        subreddit: Subreddit & {
          Moderation: Moderation;
        };
      })[];
    },
    queryKey: ["members-search-query"],
    enabled: false,
  });

  const request = debounce(() => {
    refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  useOnClickOutside(commandRef, () => {
    setInput("");
  });

  useEffect(() => {
    setInput("");
  }, [pathname]);

  return (
    <Command
      className="relative rounded-lg border max-w-lg overflow-visible mr-5"
      ref={commandRef}
    >
      <CommandInput
        isLoading={isFetching}
        value={input}
        onValueChange={(text) => {
          setInput(text);
          debounceRequest();
        }}
        placeholder="Search members"
        className="outline-none border-none focus:border-none focus:outline-none ring-0 h-5"
      />
      {input.length > 0 && (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched && <CommandEmpty>No results found</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="Users">
              {queryResults?.map((user) => (
                <CommandItem
                  key={user.userId}
                  value={user.userName || undefined}
                  className="flex justify-between"
                >
                  <div className="flex">
                    <User2 className="mr-2 h-4 w-4" />
                    <a href={`/u/${user.userName}`} className="hover:underline">
                      {user.userName}
                    </a>
                  </div>
                  {user.subreddit.Moderation.userId ? (
                    <AddModerator user={user} />
                  ) : (
                    "👑"
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      )}
    </Command>
  );
};

export default MemberSearchbar;
