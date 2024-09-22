import { IoSearch } from "react-icons/io5";
import { IoIosCreate } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import Tooltip from "./tooltip";
import Image from "next/image";

interface contentProps {
  handleLogOut: () => void;
  handleSearch: () => void;
  handleCreatePost: () => void;
  handleProfile: () => void;
  userName: string;
  profilePicture: string;
}

export const content = ({
  handleLogOut,
  handleSearch,
  handleCreatePost,
  handleProfile,
  userName,
  profilePicture,
}: contentProps) => [
  {
    id: 1,
    name: "Search",
    icon: <IoSearch id="search" className="w-10 h-10 " />,
    tooltip: <Tooltip text="Search" />,
    onClick: handleSearch,
  },
  {
    id: 2,
    name: "Create",
    icon: <IoIosCreate id="create" className="w-10 h-10 " />,
    tooltip: <Tooltip text="Post" />,
    onClick: handleCreatePost,
  },
  {
    id: 3,
    name: userName,
    icon: (
      <Image
        src={profilePicture}
        alt="user"
        width={40}
        height={40}
        className="w-9 h-9 rounded-full"
      />
    ),
    tooltip: <Tooltip text="Profile" />,
    onClick: handleProfile,
  },
  {
    id: 4,
    name: "Logout",
    icon: <IoLogOut id="logout" className="w-10 h-10 " />,
    tooltip: <Tooltip text="Logout" />,
    onClick: handleLogOut,
  },
];
