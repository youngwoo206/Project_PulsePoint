import { FC } from "react";
import { User } from "next-auth";
import { Avatar, AvatarFallback } from "../Avatar";
import Image from "next/image";
import { Icons } from "../Icons";
import { AvatarProps } from "@radix-ui/react-avatar";

interface UserAvatarProps extends AvatarProps {
  name: string | null | undefined;
  image: string | null | undefined;
}

const UserAvatar: FC<UserAvatarProps> = ({ name, image, ...props }) => {
  return (
    <Avatar {...props}>
      {image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            src={image}
            alt="profile pic"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{name}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
