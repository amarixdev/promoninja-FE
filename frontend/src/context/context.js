import { createContext, useContext, useState, useEffect } from "react";

const Context = createContext();

export function ContextProvider({ children }) {
  const [offset, setOffset] = useState(0);
  const [currentCategory, setCurrentCategory] = useState("");

  return (
    <Context.Provider
      value={{ offset, setOffset, currentCategory, setCurrentCategory }}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
