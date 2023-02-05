import { HStack, Text } from "@chakra-ui/react";
import React from "react";

type Props = {};

const Header = (props: Props) => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex outline-red-500/70  outline outline-2 w-10/12 justify-evenly items-center p-6 rounded-lg mt-4 mx-4">
        <h2 className="font-bold">Products</h2>
        <h2 className="font-bold">Podcasts</h2>
      </div>
    </div>
  );
};

export default Header;
