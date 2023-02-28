import { HStack, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import * as LogoText from "../public/assets/logo-text.png";
import * as Ninja4 from "../public/assets/ninja4.png";

type Props = {};

const Header = (props: Props) => {
  return (
    <div className="w-full flex items-center justify-start text-white p-4 fixed z-10">
      <Image src={Ninja4} alt="" className=" h-fit" width={140} />
      <Image alt="/" src={LogoText} width={220} className="p-8 sm:p-6" />
    </div>
  );
};

export default Header;
