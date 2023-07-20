import { FC } from "react";

interface TagProps {
  name: string;
  isModerator: boolean;
}

const Tag: FC<TagProps> = ({ name, isModerator }) => {
  return (
    <div className="rounded-lg bg-zinc-200 shadow-sm min-w-min w-16 h-6 ">
      <p className="text-sm text-center px-2">{name}</p>
      {isModerator ? <p>x</p> : null}
    </div>
  );
};

export default Tag;
