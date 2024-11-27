"use client";
import { createContext, useContext, useMemo, useState } from "react";

interface UserImageContextProps {
  userImage: string;
  setUserImage: (image: string) => void;
}

const UserImageContext = createContext<UserImageContextProps>({
  userImage: "",
  setUserImage: () => {},
});

export const UserImageContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userImage, setUserImage] = useState("");
  const value = useMemo(() => ({ userImage, setUserImage }), [userImage]);
  return (
    <UserImageContext.Provider value={value}>
      {children}
    </UserImageContext.Provider>
  );
};

export const useUserImage = () => useContext(UserImageContext);
