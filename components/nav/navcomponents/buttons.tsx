import { IoSearch } from "react-icons/io5";
import { IoIosCreate } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import Image from "next/image";
import { toggleFunctionsProps } from "@/actions/componentActions/nav/toggleFunctions";

interface contentProps {
  handleLogOut: ({
    setShowLogoutPrompt,
    showLogoutPrompt,
  }: toggleFunctionsProps) => void;
  handleSearch: ({ setShowSearch, showSearch }: toggleFunctionsProps) => void;
  handleCreatePost: ({
    setShowCreatePost,
    showCreatePost,
  }: toggleFunctionsProps) => void;
  handleProfile: ({ router, userId }: toggleFunctionsProps) => void;
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
    icon: <IoSearch id="search" className="h-8 w-8 group-hover:w-10 group-hover:h-10 transition-all duration-500 group-hover:delay-0 delay-1000" />,
    onClick: handleSearch,
  },
  {
    id: 2,
    name: "Create",
    icon: <IoIosCreate id="create" className="h-8 w-8 group-hover:w-10 group-hover:h-10 transition-all duration-500 group-hover:delay-0 delay-1000" />,
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
        className="h-7 w-7 rounded-full group-hover:w-9 group-hover:h-9 transition-all duration-500 group-hover:delay-0 delay-1000"
      />
    ),
    onClick: handleProfile,
  },
  {
    id: 4,
    name: "Logout",
    icon: <IoLogOut id="logout" className="h-8 w-8 group-hover:w-10 group-hover:h-10 transition-all duration-500 group-hover:delay-0 delay-1000" />,
    onClick: handleLogOut,
  },
];
