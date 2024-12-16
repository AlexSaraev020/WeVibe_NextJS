"use client";
import { ImageType } from "@/types/image/imageType";
import { createContext, useContext, useMemo, useState } from "react";

interface UserNavDataContextProps {
  username: string;
  userImage: ImageType;
  setUsername: (username: string) => void;
  setUserImage: (userImage: ImageType) => void;
}

const UserNavDataContext = createContext<UserNavDataContextProps>({
  username: "",
  userImage: {} as ImageType,
  setUsername: () => {},
  setUserImage: () => {},
});

export const UserNavDataContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [username, setUsername] = useState<string>("");
  const [userImage, setUserImage] = useState<ImageType>({} as ImageType);

  const value = useMemo(() => ({ username, userImage, setUsername, setUserImage }), [username, userImage]);
  return (
    <UserNavDataContext.Provider value={value}>
      {children}
    </UserNavDataContext.Provider>
  );
};

export const useUserNavData = () => useContext(UserNavDataContext);
