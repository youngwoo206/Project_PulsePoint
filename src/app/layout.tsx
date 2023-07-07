import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/ui/navbar/Navbar";
import { Toaster } from "@/components/ui/Toaster";
import Providers from "@/components/ui/Providers";

export const metadata = {
  title: "PulsePoint",
  description: "A Reddit clone built with Next.js and TypeScript",
};

const font = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        font.className
      )}
    >
      <body className="min-h-screen pt-12 bg-lightGrey antialiased">
        <Providers>
          {/* @ts-expect-error Server Component */}
          <Navbar />
          {authModal}
          <div className="container max-w-7xl mx-auto h-full ">{children}</div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
