import { HStack, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import LogoText from "../public/assets/logo-text.png";
import Logo from "../public/assets/logo.png";

type Props = {};

const Header = (props: Props) => {
  return (
    <div className="w-full flex items-center justify-start text-white p-4 fixed z-10">
      <Image src={Logo} alt="" className=" h-fit" width={130} />
      <Image
        alt="/"
        src={LogoText}
        width={220}
        className="p-6 sm:p-4 relative right-7"
      />
    </div>
  );
};

export default Header;
