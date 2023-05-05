import App from "next/app";
import { createContext, useState, ReactNode, useContext } from "react";

interface ContextType {
  previousPage: string;
  setPreviousPage: React.Dispatch<React.SetStateAction<string>>;
  categoryType: string;
  setCategoryType: React.Dispatch<
    React.SetStateAction<string | undefined | any>
  >;
  pageNavigate: boolean;
  setPageNavigate: React.Dispatch<React.SetStateAction<boolean>>;
  categoryIndex: number;
  setCategoryIndex: React.Dispatch<React.SetStateAction<number>>;

  currentPage: CurrentPage;
  setCurrentPage: React.Dispatch<React.SetStateAction<CurrentPage>>;
}

export interface CurrentPage {
  home: boolean;
  search: boolean;
  podcasts: boolean;
}

const AppContext = createContext<ContextType>({
  previousPage: {} as string,
  setPreviousPage: () => {},
  categoryType: {} as string,
  setCategoryType: () => {},
  currentPage: {} as { home: boolean ; search: boolean; podcasts: boolean },
  setCurrentPage: () => {},
  setPageNavigate: () => {},
  pageNavigate: {} as boolean,
  setCategoryIndex: () => {},
  categoryIndex: {} as number,
});

interface ContextProviderProps {
  children: ReactNode;
}

export function ContextProvider({ children }: ContextProviderProps) {
  const [previousPage, setPreviousPage] = useState("category");
  const [categoryType, setCategoryType] = useState("");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState<CurrentPage>({
    home: true,
    podcasts: false,
    search: false,
  });
  const [pageNavigate, setPageNavigate] = useState(false);

  return (
    <AppContext.Provider
      value={{
        previousPage,
        setPreviousPage,
        categoryType,
        setCategoryType,
        pageNavigate,
        setPageNavigate,
        categoryIndex,
        setCategoryIndex,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const NavContext = () => {
  return useContext(AppContext);
};
