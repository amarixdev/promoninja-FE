import { Button, Center, HStack, Input, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import * as Ninja1 from "../public/assets/ninja1.png";
import * as Ninja2 from "../public/assets/ninja2.png";
import * as Ninja3 from "../public/assets/ninja3.png";
import * as Ninja4 from "../public/assets/ninja4.png";

type Props = {};

const Hero = (props: Props) => {
  return (
    <VStack className="text-white h-screen">
      <VStack className="w-full h-[250px]  justify-center">
        <Image
          src={Ninja4}
          alt=""
          className=" h-fit mt-[50%] sm:mt-[30%] md:mt-[20%]"
          width={400}
        />
        <HStack
          fontWeight={"bold"}
          fontSize={{ base: "xl", sm: "2xl", md: "3xl", lg: "4xl" }}
          padding={2}
          whiteSpace="nowrap"
        >
          <Text className="tracking-wide p-2">Save Money.</Text>
          <Text className="tracking-wide p-2">Support Creators.</Text>
        </HStack>
        <div className="flex justify-evenly w-full items-center relative top-[100px] font-bold text-orange-300">
          <Button
            colorScheme={"blue"}
            w={{ base: "100px", sm: "150px", md: "200px" }}
            p={{ base: 6, sm: 8 }}
            fontSize={{ base: "lg", sm: "2xl" }}
            className="tracking-wide"
          >
            <Link href={"podcasts"}>Podcasts</Link>
          </Button>
          <Button
            colorScheme={"blue"}
            w={{ base: "100px", sm: "150px", md: "200px" }}
            p={{ base: 6, sm: 8 }}
            fontSize={{ base: "lg", sm: "2xl" }}
            className="tracking-wide "
          >
            <Link href={"podcasts"}>Sponsors</Link>
          </Button>
        </div>
      </VStack>
    </VStack>
  );
};

export default Hero;
