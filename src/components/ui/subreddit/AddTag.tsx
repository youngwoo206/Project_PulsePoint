"use client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../navbar/Command";
import { FC, useState, useCallback } from "react";
import debounce from "lodash.debounce";

interface AddTagProps {}

const AddTag: FC<AddTagProps> = ({}) => {
  const [input, setInput] = useState("");

  const request = debounce(() => {
    // refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  return (
    <div className="rounded-lg bg-zinc-200 shadow-sm min-w-min w-60 h-10 flex">
      <Command
        // ref={commandRef}
        className="relative rounded-lg border max-w-lg z-50 overflow-visible"
      >
        <CommandInput
          value={input}
          isLoading={false}
          onValueChange={(text) => {
            setInput(text);
            debounceRequest();
          }}
          className="outline-none border-none focus:border-none focus:outline-none ring-0"
          placeholder="tag name..."
        ></CommandInput>
      </Command>
      <p className="text-sm text-center px-2">+ Tag</p>
    </div>
  );
};

export default AddTag;
