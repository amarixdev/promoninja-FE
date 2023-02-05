import { createContext, useContext, useState, useEffect } from "react";

const APIContext = createContext();

export function APIContextProvider({ children }) {
  const [offset, setOffset] = useState(0);

  return (
    <APIContext.Provider value={{ offset, setOffset }}>
      {children}
    </APIContext.Provider>
  );
}

export default APIContext;
