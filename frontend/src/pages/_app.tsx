import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import { ForceDarkMode, theme } from "../../styles/chakra/theme";
import "../../styles/globals.css";
import style from "../../styles/style.module.css";
import { ContextProvider } from "../context/navContext";
import client from "../graphql/apollo-client";
import { useLoadingScreen } from "../utils/hooks";
import Head from "next/head";
import favicon from "../public/favicon.ico";
import SplashScreen from "./splash";
import Footer from "../components/layout/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  const isLoading = useLoadingScreen();
  const [splashScreen, setSplashScreen] = useState(true);
  useEffect(() => {
    setSplashScreen(true);
    setTimeout(() => {
      setSplashScreen(false);
    }, 750);
  }, []);

  if (typeof window === "undefined") React.useLayoutEffect = () => {};

  return (
    <>
      <Head>
        <link rel="icon" type="image/x-icon" href={favicon.src} />
        <title>PromoNinja</title>
      </Head>
      <ApolloProvider client={client}>
        <ChakraProvider theme={theme}>
          <ContextProvider>
            {isLoading && (
              <div className="h-screen fixed w-full flex top-0 z-[9999]">
                <div className={`${style.loader}`} />
              </div>
            )}

            <ForceDarkMode>
              {splashScreen ? (
                <SplashScreen />
              ) : (
                <>
                  <Component {...pageProps} />
                  <Footer />
                </>
              )}
            </ForceDarkMode>
          </ContextProvider>
        </ChakraProvider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
