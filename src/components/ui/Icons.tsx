import { LucideProps } from "lucide-react";

export const Icons = {
  logo: (props: LucideProps) => (
    <svg
      {...props}
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="#000000"
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="miter"
    >
      <rect x="2" y="2" width="20" height="20" rx="0"></rect>
      <polyline points="6 12 8 12 10 16 14 7 16 12 18 12"></polyline>
    </svg>
  ),
};
