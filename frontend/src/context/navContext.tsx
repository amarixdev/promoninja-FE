import { createContext, useState, ReactNode, useContext } from "react";

interface ContextType {
  previousPage: string;
  setPreviousPage: React.Dispatch<React.SetStateAction<string>>;
  categoryType: string;
  setCategoryType: React.Dispatch<
    React.SetStateAction<string | undefined | any>
  >;
  homePage: boolean;
  setHomePage: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<ContextType>({
  previousPage: {} as string,
  setPreviousPage: () => {},
  categoryType: {} as string,
  setCategoryType: () => {},
  setHomePage: () => {},
  homePage: {} as boolean,
});

interface ContextProviderProps {
  children: ReactNode;
}

export function ContextProvider({ children }: ContextProviderProps) {
  const [previousPage, setPreviousPage] = useState("category");
  const [categoryType, setCategoryType] = useState("");
  const [homePage, setHomePage] = useState(true);

  return (
    <AppContext.Provider
      value={{
        previousPage,
        setPreviousPage,
        categoryType,
        setCategoryType,
        homePage,
        setHomePage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const NavContext = () => {
  return useContext(AppContext);
};
