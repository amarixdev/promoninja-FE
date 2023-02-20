import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        bg: "#1e1e1e",
      },
    }),
  },
});

export default theme;
