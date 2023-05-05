import { extendTheme, useColorMode, type ThemeConfig } from "@chakra-ui/react";
import { useEffect } from "react";
const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};
export const theme = extendTheme({
  config,
  styles: {
    global: () => ({
      body: {
        bg: "black",
      },
    }),
  },
  colors: {
    transparent: "transparent",
    black: "#000",
    white: "#fff",
    gray: {
      50: "#f7fafc",
      900: "#171923",
    },
  },
});

export function ForceDarkMode(props: { children: JSX.Element }) {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (colorMode === "dark") return;
    toggleColorMode();
  }, [colorMode]);

  return props.children;
}
