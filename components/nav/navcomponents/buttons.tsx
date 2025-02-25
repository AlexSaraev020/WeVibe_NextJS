import { IoSearch } from "react-icons/io5";
import { FaCirclePlus } from "react-icons/fa6";
import Image, { StaticImageData } from "next/image";
import { toggleFunctionsProps } from "@/actions/componentActions/nav/toggleFunctions";
import { MdOutlineLogin } from "react-icons/md";

interface DisplayedButtonsProps {
  handleSearch: ({ setShowSearch, showSearch }: toggleFunctionsProps) => void;
  handleLogin: ({ isGuest, router }: toggleFunctionsProps) => void;
  handleCreatePost: ({
    setShowCreatePost,
    showCreatePost,
  }: toggleFunctionsProps) => void;
  handleProfile: ({ router, userId }: toggleFunctionsProps) => void;
  userName: string;
  profilePicture: string | StaticImageData;
}

export const displayedButtons = ({
  handleSearch,
  handleLogin,
  handleCreatePost,
  handleProfile,
  userName,
  profilePicture,
}: DisplayedButtonsProps) => [
  {
    id: 1,
    name: userName,
    icon: (
      <Image
        src={profilePicture}
        alt="user"
        width={40}
        height={40}
        className="h-7 w-7 rounded-full object-cover transition-all delay-1000 duration-500 group-hover:delay-0 md:group-hover:h-9 md:group-hover:w-9"
      />
    ),
    onClick: handleProfile,
  },
  {
    id: 2,
    name: "Create",
    icon: (
      <FaCirclePlus
        id="create"
        className="h-7 w-7 transition-all delay-1000 duration-500 group-hover:delay-0 md:group-hover:h-9 md:group-hover:w-9"
      />
    ),
    onClick: handleCreatePost,
  },
  {
    id: 3,
    name: "Search",
    icon: (
      <IoSearch
        id="search"
        className="h-8 w-8 transition-all delay-1000 duration-500 group-hover:delay-0 md:group-hover:h-10 md:group-hover:w-10"
      />
    ),
    onClick: handleSearch,
  },
  {
    id: 4,
    name: "Login",
    icon: (
      <MdOutlineLogin
        id="login"
        className="h-8 w-8 transition-all delay-1000 duration-500 group-hover:delay-0 md:group-hover:h-10 md:group-hover:w-10"
      />
    ),
    onClick: handleLogin,
  },
];
