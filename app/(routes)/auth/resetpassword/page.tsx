import Auth from "@/components/wevibe/Auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSignedInUserId } from "@/actions/user/isLoggedIn/getSignedInUserId";

export default async function Page() {
  if (await getSignedInUserId()) redirect("/home");
  // the API sets these two cookies when the reset mail is sent, so the page can open on the code step
  const store = await cookies();
  const codeAlreadySent = Boolean(store.get("resetCode") && store.get("encryptedMail"));
  return <Auth mode="recover" codeAlreadySent={codeAlreadySent} />;
}
