import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { ForceDarkMode, theme } from "../../styles/chakra/theme";
import "../../styles/globals.css";
import style from "../../styles/style.module.css";
import { ContextProvider } from "../context/navContext";
import client from "../graphql/apollo-client";
import { useLoadingScreen } from "../utils/hooks";
import React from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const isLoading = useLoadingScreen();
  if (typeof window === "undefined") React.useLayoutEffect = () => {};

  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        <ContextProvider>
          {isLoading && (
            <div className="h-screen fixed w-full flex top-0 z-[9999]">
              <div className={`${style.loader}`} />
            </div>
          )}

          <ForceDarkMode>
            <Component {...pageProps} />
          </ForceDarkMode>
        </ContextProvider>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
