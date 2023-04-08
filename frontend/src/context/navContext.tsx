import { createContext, useState, ReactNode, useContext } from "react";

interface ContextType {
  previousPage: string;
  setPreviousPage: React.Dispatch<React.SetStateAction<string>>;
  categoryType: string;
  setCategoryType: React.Dispatch<
    React.SetStateAction<string | undefined | any>
  >;
}

const AppContext = createContext<ContextType>({
  previousPage: {} as string,
  setPreviousPage: () => {},
  categoryType: {} as string,
  setCategoryType: () => {},
});

interface ContextProviderProps {
  children: ReactNode;
}

export function ContextProvider({ children }: ContextProviderProps) {
  const [previousPage, setPreviousPage] = useState("category");
  const [categoryType, setCategoryType] = useState("");

  return (
    <AppContext.Provider
      value={{
        previousPage,
        setPreviousPage,
        categoryType,
        setCategoryType,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const NavContext = () => {
  return useContext(AppContext);
};
