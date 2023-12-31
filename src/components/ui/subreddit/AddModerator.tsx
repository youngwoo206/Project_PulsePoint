"use client";

import { AddModeratorPayload } from "@/lib/validators/subreddit";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { Loader2 } from "lucide-react";
import { Button } from "../Button";

interface UserProps {
  user: {
    userId: string;
    userName: string | null;
    subredditId: string;
  };
}

const AddModerator = ({ user }: UserProps) => {
  const { loginToast } = useCustomToast();

  const { mutate: addModerator, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: AddModeratorPayload = {
        subredditId: user.subredditId,
        userId: user.userId,
      };

      const { data } = await axios.post("/api/subreddit/moderator", payload);
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 410) {
          return toast({
            title: "There was an error",
            description: "User is already a moderator!",
            variant: "destructive",
          });
        }
        if (error.response?.status === 401) {
          return loginToast();
        }
      }
      toast({
        title: "There was an error",
        description: "Unable to assign role at this time.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "User now has moderator privileges",
      });
    },
  });

  return (
    <Button
      onClick={() => addModerator()}
      isLoading={isLoading}
      size="xs"
      variant="outline"
      className="h-5 my-auto w-12 flex justify-center"
    >
      {isLoading ? null : "+Mod"}
    </Button>
  );
};

export default AddModerator;
