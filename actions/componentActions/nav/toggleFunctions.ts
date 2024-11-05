import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface toggleFunctionsProps {
  setShowLogoutPrompt: (showLogoutPrompt: boolean) => void;
  setShowSearch: (showSearch: boolean) => void;
  setShowCreatePost: (showCreatePost: boolean) => void;
  router: AppRouterInstance;
  userId: string | null;
  showLogoutPrompt: boolean;
  showSearch: boolean;
  showCreatePost: boolean;
}

export const handleLogOut = ({
  setShowLogoutPrompt,
  showLogoutPrompt,
}: toggleFunctionsProps) => {
  setShowLogoutPrompt(!showLogoutPrompt);
};
export const handleSearch = ({
  setShowSearch,
  setShowCreatePost,
  setShowLogoutPrompt,
  showSearch,
}: toggleFunctionsProps) => {
  setShowLogoutPrompt(false);
  setShowCreatePost(false);
  setShowSearch(!showSearch);
};

export const handleCreatePost = ({
  setShowCreatePost,
  setShowSearch,
  setShowLogoutPrompt,
  showCreatePost,
}: toggleFunctionsProps) => {
  setShowLogoutPrompt(false);
  setShowSearch(false);
  setShowCreatePost(!showCreatePost);
};

export const handleProfile = ({
  router,
  userId,
  setShowLogoutPrompt,
  setShowCreatePost,
  setShowSearch,
}: toggleFunctionsProps) => {
  setShowLogoutPrompt(false);
  setShowSearch(false);
  setShowCreatePost(false);
  router.push("/profile" + `?user=${userId}`);
};
