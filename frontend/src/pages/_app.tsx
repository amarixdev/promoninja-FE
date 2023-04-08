import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import client from "../graphql/apollo-client";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../../styles/chakra/theme";
import "../../styles/globals.css";
import { ContextProvider } from "../context/navContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ContextProvider>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </ContextProvider>
    </ApolloProvider>
  );
}

export default MyApp;
