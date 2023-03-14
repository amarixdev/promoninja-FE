import { Center, HStack, Input, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import * as Backdrop from "../public/assets/backdrop.jpeg";
import * as Backdrop2 from "../public/assets/backdrop2.jpg";
import * as BackdropMain from "../public/assets/backdropMain.jpeg";

import Button from "./Button";

type Props = {};

const Hero = (props: Props) => {
  return (
    <div className="w-full h-screen">
      <Image
        src={BackdropMain}
        alt="/"
        className="absolute z-1"
        width={2000}
        height={200} // Scale your image down to fit into the container
      />
      <div className="w-full h-screen bg-black/50 from-black fixed"></div>
      <div className="w-full h-[500px] flex flex-col justify-center items-center fixed top-[180px] z-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold whitespace-nowrap relative z-10">
          Save Money
        </h1>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl text font-extrabold text-[#f3a247] whitespace-nowrap relative z-10">
          Support Creators
        </h1>
        <Button />
      </div>
    </div>
  );
};

export default Hero;
