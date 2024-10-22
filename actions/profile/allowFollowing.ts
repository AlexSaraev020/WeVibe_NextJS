import axios from "axios";

interface AllowFollowingProps {
  userId: string;
  setButtonPlaceholder: (buttonPlaceholder: boolean) => void;
  setAllowFollow: (allowFollow: boolean) => void;
  setAllowUnfollow: (allowUnfollow: boolean) => void;
  setAllowEdit: (allowEdit: boolean) => void;
}

export const allowFollowing = async ({userId, setButtonPlaceholder, setAllowFollow, setAllowUnfollow, setAllowEdit}: AllowFollowingProps) => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await axios.get(
      `${url}/api/user/allowFollowing?user=${userId}`
    );
    if(response.status < 300) {
      setButtonPlaceholder(false);
      setAllowFollow(response.data.allowedActions.allowFollowing);
      setAllowUnfollow(response.data.allowedActions.allowUnfollowing);
      setAllowEdit(response.data.allowedActions.allowEditing);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error following:", error);
  }
};
