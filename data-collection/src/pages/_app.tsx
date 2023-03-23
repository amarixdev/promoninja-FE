import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme, Menu } from "@chakra-ui/react";
// import { ContextProvider } from "../context/context";
import "../styles/globals.css";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import client from "../graphql/apollo-client";
import theme from "../styles/theme";
import NavigationMenu from "../components/NavigationMenu";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        <NavigationMenu/>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
