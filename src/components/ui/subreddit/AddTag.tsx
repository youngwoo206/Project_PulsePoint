"use client";
import { FC } from "react";

interface AddTagProps {}

const AddTag: FC<AddTagProps> = ({}) => {
  return (
    <div className="rounded-lg bg-zinc-200 shadow-sm min-w-min w-16 h-6 ">
      <p className="text-sm text-center px-2">+ Tag</p>
    </div>
  );
};

export default AddTag;
