import { useQuery } from "@apollo/client";
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
import React, { use, useState } from "react";
import CategoryList from "../components/CategoryList";
import { Operations } from "../graphql/operations";
import * as Hero from "../public/assets/comedy.png";
import * as Logo from "../public/assets/ninja4.png";
import { GetStaticProps } from "next";
import client from "../graphql/apollo-client";
import category from "./category";
import { CategoryPodcast, PodcastData } from "../utils/types";

type Props = {
  categoryPodcasts: any;
};

const podcasts = ({ categoryPodcasts }: Props) => {
  const [category, setCategory] = useState({ name: "", id: "" });

  console.log(categoryPodcasts);

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
      <div className=" w-full h-screen mt-12">
        {categoryPodcasts.map((category: any) => (
          <CategoryList key={Object.keys(category)[0]} category={category} />
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const categories = [
    "comedy",
    "technology",
    "news & politics",
    "lifestyle",
    "education",
  ];

  const categoryData = [];

  for (const category of categories) {
    const { data } = await client.query({
      query: Operations.Queries.FetchCategoryPodcasts,
      variables: {
        input: {
          category: category,
        },
      },
    });
    categoryData.push({ [category]: data });
  }

  const categoryPodcasts = categoryData.map((category: any) => {
    const key = Object.keys(category)[0];
    const value = category[key].fetchCategoryPodcasts;
    return { [key]: value };
  });

  return {
    props: {
      categoryPodcasts,
    },
  };
};

export default podcasts;
