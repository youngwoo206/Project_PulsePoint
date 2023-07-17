import { FC } from "react";

interface TagProps {
  name: string;
}

const Tag: FC<TagProps> = ({ name }) => {
  return (
    <div className="rounded-lg bg-zinc-200 shadow-sm min-w-min w-16 h-6 ">
      <p className="text-sm text-center px-2">{name}</p>
    </div>
  );
};

export default Tag;
