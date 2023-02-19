import { createContext, useState, ReactNode } from "react";
export type Category =
  | "Spotify's Top Picks"
  | "Comedy"
  | "Educational"
  | "Technology"
  | "News & Politics"
  | "Lifestyle"
  | "";

interface ContextType {
  currentCategory: Category;
  setCurrentCategory: React.Dispatch<React.SetStateAction<Category>>;
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
