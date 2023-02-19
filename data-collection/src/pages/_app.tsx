import type { AppProps } from "next/app";
import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ContextProvider } from "../context/context";
import "../styles/globals.css";

const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        bg: "#1e1e1e",
      },
    }),
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ContextProvider>
        <Component {...pageProps} />
      </ContextProvider>
    </ChakraProvider>
  );
}

// function MyApp({ Component, pageProps }: AppProps) {
//   return (
//     <ApolloProvider client={client}>
//       <ContextProvider>
//         <ChakraProvider theme={theme}>
//           <Component {...pageProps} />
//         </ChakraProvider>
//       </ContextProvider>
//     </ApolloProvider>
//   );
// }

export default MyApp;
