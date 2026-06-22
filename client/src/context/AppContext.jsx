import {
  createContext,
  useContext,
  useState,
} from "react";

const AppContext = createContext();

export const AppProvider = ({
  children,
}) => {

  const [cartCount, setCartCount] =
    useState(0);

  const [searchTerm, setSearchTerm] =
    useState("");

  return (
    <AppContext.Provider
      value={{
        cartCount,
        setCartCount,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  return useContext(AppContext);
};

