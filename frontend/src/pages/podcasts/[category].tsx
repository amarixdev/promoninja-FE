import Image, { StaticImageData } from "next/image";
import React, { useContext, useEffect, useState } from "react";
import Footer from "../../components/Footer";
import client from "../../graphql/apollo-client";
import { Operations } from "../../graphql/operations";
import Comedy from "../../public/assets/comedy2.avif";
import Technology from "../../public/assets/technology.avif";
import News from "../../public/assets/news.avif";
import Society from "../../public/assets/society.avif";
import Sports from "../../public/assets/sports.avif";
import Crime from "../../public/assets/crime.avif";
import Education from "../../public/assets/education.avif";
import BackdropMain from "../../public/assets/backdropMain.jpeg";
import styles from "../../../styles/style.module.css";

import { capitalizeString, truncateString } from "../../utils/functions";
import useSetHomePage, { useMediaQuery } from "../../utils/hooks";
import { PodcastData } from "../../utils/types";
import Sidebar from "../../components/Sidebar";
import Link from "next/link";
import { GetStaticProps } from "next";
import { Spinner } from "@chakra-ui/react";
import { NavContext } from "../../context/navContext";
import PreviousPage from "../../components/PreviousPage";

interface Props {
  categoryPodcasts: PodcastData[];
  category: string;
}

const category = ({ categoryPodcasts, category: categoryName }: Props) => {
  const isBreakPoint = useMediaQuery(1023);
  const { setPreviousPage, setCategoryType, categoryType, setHomePage } =
    NavContext();
  useSetHomePage(false);
  let backdrop: StaticImageData = BackdropMain;

  useEffect(() => {
    if (categoryName) {
      setCategoryType(categoryName);
    }
    setPreviousPage("podcasts");
  }, [categoryName]);

  if (categoryName) {
    switch (categoryName) {
      case "news & politics":
        backdrop = News;
        break;
      case "comedy":
        backdrop = Comedy;
        break;
      case "society & culture":
        backdrop = Society;
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
  console.log(2, categoryType);

  const handlePreviousPage = () => {
    setPreviousPage("category");
    setCategoryType(categoryName);
  };

  return (
    <div className="flex">
      <Sidebar />
      {categoryPodcasts && (
        <div className="h-screen w-full">
          <Image
            src={backdrop}
            alt="comedy"
            className="fixed z-0 w-full lg:top-[-100px] xl:top-[-150px] shadow-2xl shadow-black"
            priority
          />
          <div className="w-full h-screen bg-gradient-to-tr bg-black/10 from-black/40 fixed"></div>
          {<PreviousPage previousPageText="podcasts" />}

          <h1 className="font-bold sm:font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-8xl text-white px-4 absolute z-2 top-[8rem] sm:top-[12rem]">
            {capitalizeString(categoryName)}
          </h1>

          {
            <div
              className={`bg-[#121212] ${styles.shadow}  ${
                isBreakPoint && "h-fit"
              } relative top-[30%] sm:top-[35%] md:top-[40%] lg:top-[45%] xl:top-[50%] grid-cols-3 md:grid-cols-4 lg:grid-cols-5 grid gap-8 p-5`}
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
                      onClick={() => handlePreviousPage}
                      loading="lazy"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <h1 className="text-[10px] sm:text-md lg:text-lg text-start mt-2 font-semibold text-white whitespace-wrap">
                      {!isBreakPoint
                        ? truncateString(podcast.title, 40)
                        : truncateString(podcast.title, 30)}
                    </h1>
                    <p className="base:text-[8px] xs:text-xs sm:text-sm lg:text-md text-start font-medium text-[#909090]">
                      {!isBreakPoint
                        ? podcast.publisher
                        : truncateString(podcast.publisher, 30)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="w-full text-[#121212] mt-16 text-[60px] relative">
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

export const getStaticProps = async ({ params }: any) => {
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
};
