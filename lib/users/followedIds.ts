import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { UserModel } from "@/models/user";

/* the ids the current visitor follows, so a people list can say "Following" on the first
   paint instead of fixing the button up after a second request */
export const followedIds = async () => {
  const viewerId = await checkUserLoggedIn();
  if (!viewerId) return new Set<string>();
  const viewer = await UserModel.findById(viewerId).select("following").lean().exec();
  return new Set<string>((viewer?.following ?? []).map((id) => String(id)));
};
