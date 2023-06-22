import { FC } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import Link from "next/link";
import Login from "@/components/ui/Login";
import { ChevronLeft } from "lucide-react";

const page: FC = ({}) => {
  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
        <Link
          href="/"
          className={
            (cn(buttonVariants({ variant: "ghost" })), "self-start -mt-20")
          }
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          <p className="">Home</p>
        </Link>
        <Login />
      </div>
    </div>
  );
};

export default page;
