import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { Sponsor } from "../utils/types";

interface ContextType {
  sponsor: Sponsor;
  setSponsor: React.Dispatch<React.SetStateAction<Sponsor>>;
}

const AppContext = createContext<ContextType>({
  sponsor: {} as Sponsor,
  setSponsor: () => {},
});

interface ContextProviderProps {
  children: ReactNode;
}

export function ContextProvider({ children }: ContextProviderProps) {
  // const [offset, setOffset] = useState<number>(0);
  const [sponsor, setSponsor] = useState<Sponsor>({
    name: "",
    url: "",
    description: "",
    image: "",
  });

  return (
    <AppContext.Provider value={{ sponsor, setSponsor }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
