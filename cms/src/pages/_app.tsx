import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
// import { ContextProvider } from "../context/context";
import {
  ApolloProvider
} from "@apollo/client";
import NavigationMenu from "../components/NavigationMenu";
import client from "../graphql/apollo-client";
import "../styles/globals.css";
import theme from "../styles/theme";
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
