import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import client from "../graphql/apollo-client";
import { ChakraProvider } from "@chakra-ui/react";
import { theme, ForceDarkMode } from "../../styles/chakra/theme";
import "../../styles/globals.css";
import { ContextProvider } from "../context/navContext";
import style from "../../styles/style.module.css";
import { useLoadingScreen } from "../utils/hooks";

function MyApp({ Component, pageProps }: AppProps) {
  const isLoading = useLoadingScreen();
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
