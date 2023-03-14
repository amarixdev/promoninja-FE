import Image, { StaticImageData } from "next/image";
import React, { useContext, useState } from "react";
import Footer from "../../components/Footer";
import client from "../../graphql/apollo-client";
import { Operations } from "../../graphql/operations";
import Backdrop from "../../public/assets/backdrop.jpeg";
import Comedy from "../../public/assets/comedy.avif";
import Technology from "../../public/assets/technology.avif";
import News from "../../public/assets/news.avif";
import Lifestyle from "../../public/assets/lifestyle.avif";
import Sports from "../../public/assets/sports.avif";
import Crime from "../../public/assets/crime.avif";
import Education from "../../public/assets/education.avif";
import BackdropMain from "../../public/assets/backdropMain.jpeg";

import {
  capitalizeString,
  convertToSlug,
  truncateString,
} from "../../utils/functions";
import { useMediaQuery } from "../../utils/hooks";
import { PodcastData } from "../../utils/types";
import Sidebar from "../../components/Sidebar";
import Link from "next/link";
import { GetStaticProps } from "next";
import { Spinner } from "@chakra-ui/react";

interface Props {
  categoryPodcasts: PodcastData[];
  category: string;
}

const category = ({ categoryPodcasts, category: categoryName }: Props) => {
  const isBreakPoint = useMediaQuery(1023);
  let backdrop: StaticImageData = BackdropMain;

  if (categoryName) {
    switch (categoryName) {
      case "news & politics":
        backdrop = News;
        break;
      case "comedy":
        backdrop = Comedy;
        break;
      case "lifestyle":
        backdrop = Lifestyle;
        break;
      case "sports":
        backdrop = Sports;
        break;
      case "educational":
        backdrop = Education;
        break;
      case "technology":
        backdrop = Technology;
        break;
      case "true crime":
        backdrop = Crime;
        break;
      default:
        BackdropMain;
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      {categoryPodcasts && (
        <div className="h-screen w-full">
          <Image
            src={backdrop}
            alt="comedy"
            className="fixed z-0 w-full lg:top-[-100px] xl:top-[-150px]"
            priority
          />
          <div className="w-full h-screen bg-black/30 from-black fixed"></div>

          <h1 className="font-bold text-5xl md:text-6xl lg:text-8xl text-white px-4 absolute z-2 top-[8rem] sm:top-[12rem]">
            {capitalizeString(categoryName)}
          </h1>

          {
            <div
              className={`bg-[#121212] ${
                isBreakPoint && "h-fit"
              } relative top-[30%] sm:top-[35%] md:top-[40%] lg:top-[45%] xl:top-[50%] grid-cols-3 md:grid-cols-4 lg:grid-cols-5 grid gap-10 p-5`}
            >
              {categoryPodcasts?.map((podcast) => (
                <div key={`${podcast.title}`}>
                  <Link href={`/podcasts/${categoryName}/${podcast.title}`}>
                    <Image
                      src={podcast.imageUrl}
                      alt=""
                      width={190}
                      height={190}
                      className="rounded-xl"
                    />
                  </Link>

                  <h1 className="text-[10px] sm:text-md lg:text-lg text-center pt-6 font-semibold text-white whitespace-wrap">
                    {!isBreakPoint
                      ? truncateString(podcast.title, 40)
                      : truncateString(podcast.title, 20)}
                  </h1>
                </div>
              ))}
              <div className="w-full text-[#121212] text-[50px] relative">
                margin
              </div>
            </div>
          }
          <Footer />
        </div>
      )}
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
      category,
    },
  };
}
