import { ReactNode, createContext, useContext, useState } from "react";

interface ContextType {
  ninjaMode: boolean;
  setNinjaMode: React.Dispatch<React.SetStateAction<boolean>>;
  categoryIndex: number;
  setCategoryIndex: React.Dispatch<React.SetStateAction<number>>;
  currentPage: CurrentPage;
  setCurrentPage: React.Dispatch<React.SetStateAction<CurrentPage>>;
}

export interface CurrentPage {
  home: boolean;
  search: boolean;
  podcasts: boolean;
  offers: boolean;
}

const AppContext = createContext<ContextType>({
  currentPage: {} as {
    home: boolean;
    search: boolean;
    podcasts: boolean;
    offers: boolean;
  },
  setCurrentPage: () => {},
  categoryIndex: {} as number,
  setCategoryIndex: () => {},
  ninjaMode: {} as boolean,
  setNinjaMode: () => {},
});

interface ContextProviderProps {
  children: ReactNode;
}

export function ContextProvider({ children }: ContextProviderProps) {
  const [ninjaMode, setNinjaMode] = useState(false);
  const [categoryIndex, setCategoryIndex] = useState(-1);
  const [currentPage, setCurrentPage] = useState<CurrentPage>({
    home: true,
    podcasts: false,
    search: false,
    offers: false,
  });
  return (
    <AppContext.Provider
      value={{
        categoryIndex,
        setCategoryIndex,
        currentPage,
        setCurrentPage,
        ninjaMode,
        setNinjaMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const NavContext = () => {
  return useContext(AppContext);
};
