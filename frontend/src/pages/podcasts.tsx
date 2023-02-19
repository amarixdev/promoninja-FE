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
import CategoryList from "../components/CategoryList";
import * as Hero from "../public/assets/comedy.png";
import * as Logo from "../public/assets/ninja4.png";

type Props = {};

const podcasts = (props: Props) => {
  const [category, setCategory] = useState({ name: "", id: "" });

  const Comedy = Array.from({ length: 5 }, () => "Comedy");
  const TopPicks = Array.from({ length: 5 }, () => "TopPicks");
  const Technology = Array.from({ length: 5 }, () => "Technology");
  const Politics = Array.from({ length: 5 }, () => "Politics");
  const Lifestyle = Array.from({ length: 5 }, () => "Lifestyle");
  const Educational = Array.from({ length: 5 }, () => "Educational");

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
        <CategoryList category="Spotify's Top Picks" podcasts={TopPicks} />
        <CategoryList category="Comedy" podcasts={Comedy} />
        <CategoryList category="Educational" podcasts={Educational} />
        <CategoryList category="Technology" podcasts={Technology} />
        <CategoryList category="News & Politics" podcasts={Politics} />
        <CategoryList category="Lifestyle" podcasts={Lifestyle} />
      </div>
    </div>
  );
};

export default podcasts;
