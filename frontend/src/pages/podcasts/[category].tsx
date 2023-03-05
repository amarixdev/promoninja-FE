import Image from "next/image";
import React, { useContext } from "react";
import Context from "../../context/context";
import client from "../../graphql/apollo-client";
import { Operations } from "../../graphql/operations";
import * as Hero from "../../public/assets/comedy.png";
import { capitalizeString, truncateString } from "../../utils/functions";
import { useMediaQuery } from "../../utils/hooks";
import { PodcastData } from "../../utils/types";

interface Props {
  categoryPodcasts: PodcastData[];
}

const category = ({ categoryPodcasts }: Props) => {
  const { currentCategory } = useContext(Context);
  const isBreakPoint = useMediaQuery(639);

  return (
    <div className="w-full  h-screen">
      <Image
        src={Hero}
        alt="comedy"
        className="fixed z-0 w-full lg:top-[-100px] xl:top-[-150px]"
      />
      <h1 className="text-5xl font-bold text-white absolute z-2 top-[8rem]">
        {capitalizeString(currentCategory)}
      </h1>
      <div className="bg-[#121212] w-full h-screen relative top-[30%] sm:top-[35%] md:top-[40%] lg:top-[45%] xl:top-[50%] grid-cols-3 md:grid-cols-4 lg:grid-cols-5 grid gap-10 p-5 ">
        {categoryPodcasts?.map((podcast) => (
          <div key={`${podcast.title}`}>
            <Image
              src={podcast.imageUrl}
              alt=""
              width={190}
              height={190}
              className="rounded-xl mt-4 shadow-lg shadow-black "
            />

            <h1 className="text-sm sm:text-md lg:text-lg text-center pt-6 font-semibold text-white whitespace-nowrap">
              {!isBreakPoint
                ? truncateString(podcast.title, 20)
                : truncateString(podcast.title, 15)}
            </h1>
            <p className="text-xs sm:text-sm lg:text-md text-center font-medium text-[#909090] mt-5 ">
              {!isBreakPoint
                ? podcast.publisher
                : truncateString(podcast.publisher, 42)}
            </p>
          </div>
        ))}
      </div>
      <div className="w-full bg-green-200 fixed z-100 h-[200px]">Test</div>
    </div>
  );
};

export default category;

export const getStaticPaths = async () => {
  const paths = [{ params: { category: "" } }];
  return {
    paths,
    fallback: true,
  };
};

export async function getStaticProps({ params }: any) {
  const { category } = params;

  const { data } = await client.query({
    query: Operations.Queries.FetchCategoryPodcasts,
    variables: {
      input: {
        category,
      },
    },
  });

  const categoryPodcasts = data.fetchCategoryPodcasts;
  return {
    props: {
      categoryPodcasts,
    },
  };
}
