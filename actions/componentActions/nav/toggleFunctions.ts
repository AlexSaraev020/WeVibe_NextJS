import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface toggleFunctionsProps {
  setShowLogoutPrompt: (showLogoutPrompt: boolean) => void;
  setShowSearch: (showSearch: boolean) => void;
  setShowCreatePost: (showCreatePost: boolean) => void;
  router: AppRouterInstance;
  userId: string;
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
  showSearch,
}: toggleFunctionsProps) => {
  setShowSearch(!showSearch);
};

export const handleCreatePost = ({
  setShowCreatePost,
  showCreatePost,
}: toggleFunctionsProps) => {
  setShowCreatePost(!showCreatePost);
};

export const handleProfile = ({ router, userId }: toggleFunctionsProps) => {
  router.push("/profile" + `?user=${userId}`);
};
