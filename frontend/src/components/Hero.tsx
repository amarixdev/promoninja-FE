import { Center, HStack, Input, VStack } from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect } from "react";

type Props = {};

const Hero = (props: Props) => {
  return (
    <div className="">
      <div className=" w-full h-[250px] flex justify-center items-center">
        <h1 className="text-5xl font-bold tracking-wide mt-10">
          <span className="mr-5">Save Money.</span>
          <span className="">Support Creators</span>
        </h1>
      </div>
      <div className=" w-full h-[500px] flex justify-evenly">
        <Link
          href={"/podcasts"}
          className="w-[300px] h-[300px] bg-blue-200 hover:bg-blue-300 transition-all duration-300  rounded-3xl shadow-lg flex items-center justify-center"
        >
          <h1 className="text-4xl font-bold tracking-wide">Podcasts</h1>
        </Link>
        <Link
          href={"/promos"}
          className="w-[300px] h-[300px] bg-blue-200 hover:bg-blue-300 transition-all duration-300 ease-in-out rounded-3xl shadow-lg flex items-center justify-center"
        >
          <h1 className="text-4xl font-bold tracking-wide"> Promos</h1>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
