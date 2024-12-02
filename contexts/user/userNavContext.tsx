"use client";
import { createContext, useContext, useMemo, useState } from "react";

interface UserNavDataContextProps {
  username: string;
  userImage: string;
  setUsername: (username: string) => void;
  setUserImage: (userImage: string) => void;
}

const UserNavDataContext = createContext<UserNavDataContextProps>({
  username: "",
  userImage: "",
  setUsername: () => {},
  setUserImage: () => {},
});

export const UserNavDataContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [username, setUsername] = useState<string>("");
  const [userImage, setUserImage] = useState<string>("");

  const value = useMemo(() => ({ username, userImage, setUsername, setUserImage }), [username, userImage]);
  return (
    <UserNavDataContext.Provider value={value}>
      {children}
    </UserNavDataContext.Provider>
  );
};

export const useUserNavData = () => useContext(UserNavDataContext);
