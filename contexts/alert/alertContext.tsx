"use client";

import { createContext, useContext, useMemo, useState } from "react";

interface AlertContextProps {
  setMessage: (message: string | undefined) => void;
  message: string | undefined;
  error: boolean;
  setError: (error: boolean) => void;
}

const AlertContext = createContext<AlertContextProps>({
  message: undefined,
  setMessage: () => {},
  error: false,
  setError: () => {},
});

export const AlertContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [error, setError] = useState<boolean>(false);
  const value = useMemo(
    () => ({ message, setMessage, error, setError}),
    [message],
  );
  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
