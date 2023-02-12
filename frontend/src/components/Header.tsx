import { HStack, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import * as LogoText from "../public/assets/logo-text.png";

type Props = {};

const Header = (props: Props) => {
  return (
    <div className="w-full flex items-center justify-start text-white">
      <Image alt="/" src={LogoText} width={250} className="p-6" />
    </div>
  );
};

export default Header;
