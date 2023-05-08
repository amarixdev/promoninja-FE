import Image, { StaticImageData } from "next/image";
import { useEffect } from "react";
import styles from "../../../styles/style.module.css";
import Footer from "../../components/Footer";
import client from "../../graphql/apollo-client";
import { Operations } from "../../graphql/operations";
import LogoText from "../../public/assets/logo-text.png";
import Comedy from "../../public/assets/comedy2.avif";
import Crime from "../../public/assets/crime.avif";
import Education from "../../public/assets/education.avif";
import News from "../../public/assets/news.avif";
import Society from "../../public/assets/society.avif";
import Sports from "../../public/assets/sports.avif";
import Technology from "../../public/assets/technology.avif";

import Link from "next/link";
import PreviousPage from "../../components/PreviousPage";
import Sidebar from "../../components/Sidebar";
import { NavContext } from "../../context/navContext";
import {
  capitalizeString,
  convertToSlug,
  truncateString,
} from "../../utils/functions";
import { useMediaQuery, useSetCurrentPage } from "../../utils/hooks";
import { PodcastData } from "../../utils/types";

interface Props {
  categoryPodcasts: PodcastData[];
  category: string;
}

const category = ({ categoryPodcasts, category: categoryName }: Props) => {
  const isBreakPoint = useMediaQuery(1023);

  if (categoryName) {
    console.log(categoryName.split("").length);
  }

  const { setPreviousPage, setCategoryType, categoryType } = NavContext();
  useSetCurrentPage({ home: false, podcasts: true, search: false });
  let backdrop: StaticImageData = LogoText;

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
        LogoText;
    }
  }

  const handlePreviousPage = () => {
    setPreviousPage("category");
    setCategoryType(categoryName);
  };

  return (
    <div className="flex base:mb-[60px] xs:mb-[70px] lg:mb-0">
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

          <h1 className="base:font-bold xs:font-extrabold base:text-3xl xs:text-4xl  sm:text-7xl lg:text-8xl text-white px-4 absolute z-2 base:top-[4rem] xs:top-[6rem] sm:top-[12rem] md:top-[14rem]">
            {capitalizeString(categoryName)}
          </h1>

          {
            <div
              className={`bg-[#151515] ${styles.shadow}  ${
                isBreakPoint && "h-fit"
              } relative top-[23%] sm:top-[35%] md:top-[40%] lg:top-[45%] xl:top-[50%] grid-cols-3 md:grid-cols-4 lg:grid-cols-5 grid gap-8 p-5 pb-24`}
            >
              <div className="absolute top-0 from-[#5757574e] bg-gradient-to-b to-[#151515] w-full h-[400px] z-0"></div>

              {categoryPodcasts?.map((podcast) => (
                <div key={`${podcast.title}`} className="relative z-10">
                  <Link
                    href={`/podcasts/${convertToSlug(
                      categoryName
                    )}/${convertToSlug(podcast.title)}`}
                  >
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
  const slugToCategory = category.split("-").join(" ").toLowerCase();

  const { data } = await client.query({
    query: Operations.Queries.FetchCategoryPodcasts,
    variables: {
      input: {
        category: slugToCategory,
      },
    },
  });

  const categoryPodcasts = data.fetchCategoryPodcasts;
  return {
    props: {
      categoryPodcasts,
      category: slugToCategory,
    },
  };
};
