import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface toggleFunctionsProps {
  setShowSearch: (showSearch: boolean) => void;
  setShowCreatePost: (showCreatePost: boolean) => void;
  router: AppRouterInstance;
  userId: string | null;
  showSearch: boolean;
  showCreatePost: boolean;
}

export const handleSearch = ({
  setShowSearch,
  setShowCreatePost,
  showSearch,
}: toggleFunctionsProps) => {
  setShowCreatePost(false);
  setShowSearch(!showSearch);
};

export const handleCreatePost = ({
  setShowCreatePost,
  setShowSearch,
  showCreatePost,
}: toggleFunctionsProps) => {
  setShowSearch(false);
  setShowCreatePost(!showCreatePost);
};

export const handleProfile = ({
  router,
  userId,
  setShowCreatePost,
  setShowSearch,
}: toggleFunctionsProps) => {
  setShowSearch(false);
  setShowCreatePost(false);
  router.push("/profile" + `?user=${userId}`);
};
