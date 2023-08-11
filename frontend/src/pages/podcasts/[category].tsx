import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ChatBubble from "../../components/community-input/ChatBubble";
import Sidebar from "../../components/layout/Sidebar";
import BackButton from "../../components/misc/BackButton";
import { NavContext } from "../../context/navContext";
import client from "../../graphql/apollo-client";
import { Operations } from "../../graphql/operations";
import Comedy from "../../public/assets/comedy.jpg";
import Crime from "../../public/assets/crime.jpg";
import Education from "../../public/assets/education.jpg";
import News from "../../public/assets/news.jpg";
import Society from "../../public/assets/society.jpg";
import Sports from "../../public/assets/sports.jpg";
import Technology from "../../public/assets/technology.jpg";
import {
  capitalizeString,
  convertToSlug,
  currentYear,
  scrollToTop,
  truncateString,
} from "../../utils/functions";
import {
  useBanner,
  useMediaQuery,
  useScrollRestoration,
  useSetCurrentPage,
} from "../../utils/hooks";
import { Category, PodcastData } from "../../utils/types";
import { Spinner } from "@chakra-ui/react";
import SplashScreen from "../splash";
import { BsSpotify } from "react-icons/bs";
import Footer from "../../components/layout/Footer";
import CategoryBanner from "../../components/banners/CategoryBanner";

interface Props {
  categoryPodcasts: PodcastData[];
  category: string;
}

const Category = ({ categoryPodcasts, category: categoryName }: Props) => {
  const router = useRouter();
  useScrollRestoration(router);
  const isBreakPoint = useMediaQuery(1023);

  /* 3 Cols Breakpoint */
  const gridBreakPoint = useMediaQuery(450);

  const currentPodcasts = categoryPodcasts?.map((pod) => pod.title);

  let backdrop =
    {
      "news & politics": News,
      comedy: Comedy,
      "society & culture": Society,
      sports: Sports,
      educational: Education,
      technology: Technology,
      "true crime": Crime,
    }[categoryName] || null;

  const { ninjaMode } = NavContext();
  useSetCurrentPage({
    home: false,
    podcasts: false,
    search: false,
    offers: false,
  });
  const backdropRef = useRef<HTMLImageElement>(null);
  const bannerBreakpointRef = useRef<HTMLDivElement>(null);
  const { banner } = useBanner(bannerBreakpointRef, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (backdropRef.current) {
        const scrollPosition = window.scrollY;
        if (!isBreakPoint) {
          const opacity = Math.max(1 - scrollPosition * 0.005, 0);
          backdropRef.current.style.opacity = opacity.toString();
        } else {
          const opacity = Math.max(1 - scrollPosition * 0.01, 0);
          backdropRef.current.style.opacity = opacity.toString();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [backdropRef, isBreakPoint]);

  if (!backdrop) {
    return (
      <div className="h-screen bg-gradient-to-b from-[#222222] to-[#151515] flex items-center justify-center">
        <SplashScreen />
      </div>
    );
  }

  return (
    <div className="flex base:mb-[60px] xs:mb-[70px] lg:mb-0 bg-black h-full">
      <Sidebar />
      <CategoryBanner banner={banner} categoryName={categoryName} />
      {categoryPodcasts && (
        <div className="h-screen w-full lg:ml-[240px]">
          <BackButton />
          <Image
            placeholder="blur"
            src={backdrop}
            alt={`${categoryName} backdrop`}
            className={`fixed ${
              isBreakPoint && "scale-125"
            } z-0 w-full lg:top-[-100px] xl:top-[-150px] shadow-2xl shadow-black`}
            priority
            ref={backdropRef}
          />
          <div className="w-full h-screen bg-gradient-to-tr bg-black/10 from-black/40 fixed"></div>

          {
            <div className="h-full flex flex-col mt-[140px] sm:mt-[200px] md:mt-[260px] lg:mt-[320px] gap-14">
              <header>
                <h1
                  ref={bannerBreakpointRef}
                  className="relative z-50 base:text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-extrabold pl-4"
                >
                  {capitalizeString(categoryName)}
                </h1>
              </header>
              <main>
                <nav
                  aria-label={`${categoryName} podcasts `}
                  className={`${
                    ninjaMode
                      ? "bg-gradient-to-b from-[#0a0a0a] to-[#020202]   "
                      : "bg-gradient-to-b from-[#1b1b1b] to-[#121212]"
                  }  relative grid-cols-2 ${
                    gridBreakPoint || "grid-cols-3"
                  } sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 grid gap-y-8 gap-x-4 lg:gap-x-8 lg:gap-y-10 p-6 lg:p-10 pb-96 lg:pb-52`}
                >
                  {ninjaMode ? (
                    <div
                      className={` from-[#171717] bg-gradient-to-b  absolute w-full h-[200px] z-0 `}
                    ></div>
                  ) : (
                    <div
                      className={` from-[#4545453f] bg-gradient-to-b  absolute w-full h-[200px] z-0 `}
                    ></div>
                  )}

                  {categoryPodcasts?.map((podcast) => (
                    <div key={podcast.title}>
                      {isBreakPoint ? (
                        /* Mobile */
                        <Link
                          href={`/podcasts/${convertToSlug(
                            categoryName
                          )}/${convertToSlug(podcast.title)}`}
                        >
                          <div
                            className={` group bg-gradient-to-b w-full relative z-10 ${
                              ninjaMode
                                ? "bg-gradient-to-b from-[#212121] to-[#111111]"
                                : "bg-gradient-to-b from-[#2a2a2a] to-[#181818]"
                            } active:scale-95 transition-all duration-300 ease-in-out flex mt-4 flex-col p-4 items-center max-h-auto  rounded-lg`}
                          >
                            <Image
                              src={podcast.imageUrl}
                              alt={podcast.title}
                              width={140}
                              height={140}
                              className="rounded-xl mx-4 shadow-lg shadow-black w-[115px] sm:w-[140px] relative z-10 "
                              loading={"eager"}
                            />
                            <div className="flex flex-col min-w-[110px] sm:min-w-[130px] items-start justify-start ">
                              <h2 className=" whitespace-nowrap text-xs font-semibold sm:text-sm text-start mt-4 text-[#e6e6e6] group-hover:text-white whitespace-wrap">
                                {truncateString(podcast.title, 15)}
                              </h2>
                              <h3 className="whitespace-nowrap text-xs  sm:text-sm text-start font-medium text-[#909090]">
                                {truncateString(podcast.publisher, 15)}
                              </h3>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        /* Desktop */
                        <Link
                          href={`/podcasts/${convertToSlug(
                            categoryName
                          )}/${convertToSlug(podcast.title)}`}
                          key={podcast.title}
                        >
                          <div
                            className={` group bg-gradient-to-b w-full relative z-10 ${
                              ninjaMode
                                ? "bg-gradient-to-b from-[#212121] to-[#111111] hover:from-[#202020] hover:to-[#282828] "
                                : "bg-gradient-to-b from-[#2a2a2a] to-[#181818] hover:from-[#202020] hover:to-[#343434]"
                            }  hover:cursor-pointer flex flex-col items-center max-h-auto px-4 pb-10 rounded-lg min-w-[135px] max-w-[220px]`}
                          >
                            <Image
                              src={podcast.imageUrl}
                              alt={podcast.title}
                              width={160}
                              height={160}
                              className="rounded-xl mt-4 shadow-lg shadow-black w-[160px] "
                              loading={"eager"}
                            />
                            <div className="flex flex-col px-5">
                              <h2 className="whitespace-nowrap text-sm xl:text-md text-start mt-3 font-semibold text-[#dadada] group-hover:text-white">
                                {truncateString(podcast.title, 14)}
                              </h2>
                              <h3 className="whitespace-nowrap text-sm xl:text-md text-start font-medium text-[#909090]">
                                {truncateString(podcast.publisher, 14)}
                              </h3>
                            </div>
                          </div>
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
                <div className="relative bottom-[330px] lg:bottom-[150px]">
                  <ChatBubble
                    message="Don't see your favorite show?"
                    page="category"
                    currentPodcasts={currentPodcasts}
                  />
                </div>
              </main>
              <footer className={isBreakPoint ? "" : "relative bottom-20"}>
                <Footer />
              </footer>
            </div>
          }
        </div>
      )}
    </div>
  );
};

export default Category;

export const getStaticPaths = async () => {
  let { data: categoryData } = await client.query({
    query: Operations.Queries.GetPodcastCategories,
  });

  categoryData = categoryData.getPodcastCategories;

  const paths = categoryData.map((category: Category) => ({
    params: { category: convertToSlug(category.name) },
  }));

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
  const oneWeek = 604800;
  return {
    props: {
      categoryPodcasts,
      category: slugToCategory,
    },
    revalidate: 604800,
  };
};
