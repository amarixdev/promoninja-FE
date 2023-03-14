import React from "react";
import CategoryList from "../../components/CategoryList";
import { Operations } from "../../graphql/operations";
import { GetStaticProps } from "next";
import client from "../../graphql/apollo-client";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { CategoryPodcast } from "../../utils/types";
import { useMediaQuery } from "../../utils/hooks";

interface Props {
  categoryPreviews: CategoryPodcast[];
}

const podcasts = ({ categoryPreviews }: Props) => {
  const isBreakPoint = useMediaQuery(1023);
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="w-full h-screen bg-[#151515] relative overflow-x-hidden z-1 mt-10">
          <div className="flex items-center justify-between w-full relative">
            <h1
              className={`text-3xl sm:text-5xl p-8 fixed font-bold z-10 text-white bg-[#121212] w-full `}
            >
              Podcasts
            </h1>
          </div>
          <div
            className={`w-full ${
              isBreakPoint && "h-[200px]"
            } relative mt-20 flex flex-col`}
          >
            {categoryPreviews.map((category: CategoryPodcast) => (
              <CategoryList
                key={Object.keys(category)[0]}
                category={category}
              />
            ))}
            <div className="w-full mt-6 text-[#121212] relative">margin</div>
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

  const categoryPreviews = categoryData.map((category) => {
    const key = Object.keys(category)[0];
    const value = category[key].fetchCategoryPodcasts;
    return { [key]: value };
  });

  return {
    props: {
      categoryPreviews,
    },
  };
};

export default podcasts;
