import UsernameForm from "@/components/ui/settings/UsernameForm";
import { authOptions, getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Settings",
  description: "manage account and website settings",
};

const Settings = async ({}) => {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(authOptions.pages?.signIn || "/sign-in");
  }

  return (
    <div className="max-w-4-xl mx-auto py-12">
      <div className="grid items-start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl">Settings</h1>
      </div>

      <div className="grid gap-10 mt-3">
        <UsernameForm
          user={{ id: session.user.id, username: session.user.username || "" }}
        />
      </div>
    </div>
  );
};

export default Settings;
