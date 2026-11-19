import Auth from "@/components/wevibe/Auth";
import { redirect } from "next/navigation";
import { getSignedInUserId } from "@/actions/user/isLoggedIn/getSignedInUserId";

export default async function Page() {
  if (await getSignedInUserId()) redirect("/home");
  return <Auth mode="register" />;
}
