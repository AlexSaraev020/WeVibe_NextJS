import { IoSearch } from "react-icons/io5";
import { IoIosCreate } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import Tooltip from "./tooltip";

export const content = [
    { id: 1, name: 'Search', icon: <IoSearch id='search' className='w-10 h-10 ' />, tooltip: <Tooltip text='Search' /> },
    { id: 2, name: 'Create', icon: <IoIosCreate id='create' className='w-10 h-10 ' />, tooltip: <Tooltip text='Post' /> },
    { id: 3, name: 'Profile', icon: <CgProfile id='profile' className='w-10 h-10 ' />, tooltip: <Tooltip text='Profile' /> },
    { id: 4, name: 'Logout', icon: <IoLogOut id='logout' className='w-10 h-10 ' />, tooltip: <Tooltip text='Logout' /> },
]