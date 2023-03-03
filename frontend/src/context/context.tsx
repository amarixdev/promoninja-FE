import { createContext, useState, ReactNode } from "react";


interface ContextType {
  currentCategory: string;
  setCurrentCategory: React.Dispatch<React.SetStateAction<string>>;
}

export const Context = createContext<ContextType>({
  currentCategory: "Comedy",
  setCurrentCategory: () => {},
});

interface ContextProviderProps {
  children: ReactNode;
}

export function ContextProvider({ children }: ContextProviderProps) {
  const [currentCategory, setCurrentCategory] =
    useState<ContextType["currentCategory"]>("Comedy");

  return (
    <Context.Provider value={{ currentCategory, setCurrentCategory }}>
      {children}
    </Context.Provider>
  );
}

export default Context;
