import { IoSearch } from "react-icons/io5";
import { IoIosCreate } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import Tooltip from "./tooltip";

interface contentProps {
    handleLogOut: () => void
    handleSearch: () => void
    handleCreatePost: () => void
    handleProfile: () => void
}

export const content = ({ handleLogOut, handleSearch, handleCreatePost, handleProfile }: contentProps) => [
    { id: 1, name: 'Search', icon: <IoSearch id='search' className='w-10 h-10 ' />, tooltip: <Tooltip text='Search' />, onClick: handleSearch },
    { id: 2, name: 'Create', icon: <IoIosCreate id='create' className='w-10 h-10 ' />, tooltip: <Tooltip text='Post' />, onClick: handleCreatePost },
    { id: 3, name: 'Profile', icon: <CgProfile id='profile' className='w-10 h-10 ' />, tooltip: <Tooltip text='Profile' />, onClick: handleProfile },
    { id: 4, name: 'Logout', icon: <IoLogOut id='logout' className='w-10 h-10 ' />, tooltip: <Tooltip text='Logout' />, onClick: handleLogOut },
]