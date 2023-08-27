import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import React, { useEffect, useMemo, useState } from "react";
import { ForceDarkMode, theme } from "../../styles/chakra/theme";
import "../../styles/globals.css";
import style from "../../styles/style.module.css";
import { ContextProvider } from "../context/navContext";
import client from "../graphql/apollo-client";
import { useLoadingScreen } from "../utils/hooks";
import Head from "next/head";
import favicon from "../public/favicon.ico";
import SplashScreen from "./splash";
import FooterBar from "../components/layout/FooterBar";
import TagManager, { TagManagerArgs } from "react-gtm-module";
import { GTM_ID } from "../../environment";

function MyApp({ Component, pageProps }: AppProps) {
  const gtmId = GTM_ID;
  const tagManagerArgs: TagManagerArgs = useMemo(
    () => ({
      gtmId,
    }),
    [gtmId]
  );
  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, [tagManagerArgs]);

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
        <meta property="og:title" content="PromoNinja" />
        <meta
          property="og:description"
          content="Empower Your Savings as You Support Your Favorite Podcasters! Discover Exclusive Discount Codes on Promoninja, Helping Shoppers Save on a Variety of Products"
        />
        <meta property="og:image" content="https://imgur.com/a/3DI68Yc" />
        <meta property="og:url" content="https://promoninja.io" />
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
                  <FooterBar />
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
