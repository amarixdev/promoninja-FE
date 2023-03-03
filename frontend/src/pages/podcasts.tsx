import Image from "next/image";
import Link from "next/link";
import React, { use, useState } from "react";
import CategoryList from "../components/CategoryList";
import { Operations } from "../graphql/operations";

import { GetStaticProps } from "next";
import client from "../graphql/apollo-client";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

type Props = {
  categoryPodcasts: any;
};

const podcasts = ({ categoryPodcasts }: Props) => {
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="w-full h-screen bg-[#151515] relative overflow-x-hidden z-1 mt-10">
          <div className="flex items-center justify-between w-full relative">
            <h1 className="text-3xl sm:text-4xl md:text-5xl p-8 fixed font-bold z-10 text-white bg-[#121212] w-full">
              Podcasts
            </h1>
          </div>
          <div className="w-full h-screen mt-12 relative">
            {categoryPodcasts.map((category: any) => (
              <CategoryList
                key={Object.keys(category)[0]}
                category={category}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const categories = [
    "comedy",
    "technology",
    "news & politics",
    "lifestyle",
    "educational",
    "sports",
    "true crime",
  ];

  const categoryData = [];

  for (const category of categories) {
    const { data } = await client.query({
      query: Operations.Queries.FetchCategoryPodcasts,
      variables: {
        input: {
          category,
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
