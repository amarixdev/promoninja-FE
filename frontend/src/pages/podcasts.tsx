import {
  Card,
  CardBody,
  HStack,
  Input,
  SimpleGrid,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Category from "../components/CategoryList";
import * as Hero from "../public/assets/comedy.png";
import * as Logo from "../public/assets/ninja4.png";

type Props = {};

const podcasts = (props: Props) => {
  const [category, setCategory] = useState({ name: "", id: "" });
  const podcasts = [1, 2, 3, 4, 5];

  return (
    <div className="w-full bg-[#121212]">
      <div className="flex items-center justify-center w-full">
        <Link href={"/"}>
          <Image src={Logo} alt={""} width={100} />
        </Link>
      </div>
      <div className="flex items-center justify-between w-full relative">
        <h1 className="text-4xl sm:text-5xl md:text-6xl p-8 font-bold text-white">
          Podcasts
        </h1>
      </div>
      <div className=" w-full h-screen mt-12 ">
        <Category category="Spotify's Top Picks" />
        <Category category="Comedy" />
        <Category category="Educational" />
        <Category category="Technology" />
        <Category category="News & Politics" />
        <Category category="Lifestyle" />
      </div>
    </div>
  );
};

export default podcasts;
