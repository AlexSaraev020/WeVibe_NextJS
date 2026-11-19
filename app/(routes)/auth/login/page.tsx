import Auth from "@/components/wevibe/Auth";
import { redirect } from "next/navigation";
import { getSignedInUserId } from "@/actions/user/isLoggedIn/getSignedInUserId";

export default async function Page() {
  /* a cookie alone is not a session: an expired or deleted-account token used to bounce
     every visitor from this page straight to /home */
  if (await getSignedInUserId()) redirect("/home");
  return <Auth mode="signin" />;
}
