import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import client from "../graphql/apollo-client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { theme } from "../../styles/chakra/theme";
import "../../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
