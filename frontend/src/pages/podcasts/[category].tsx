import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import { NavContext } from "../../context/navContext";
import client from "../../graphql/apollo-client";
import { Operations } from "../../graphql/operations";
import Comedy from "../../public/assets/comedy2.avif";
import Crime from "../../public/assets/crime.avif";
import Education from "../../public/assets/education.avif";
import LogoText from "../../public/assets/logo-text.png";
import News from "../../public/assets/news.avif";
import Society from "../../public/assets/society.avif";
import Sports from "../../public/assets/sports.avif";
import Technology from "../../public/assets/technology.avif";
import {
  capitalizeString,
  convertToSlug,
  scrollToTop,
  truncateString,
} from "../../utils/functions";
import {
  useBanner,
  useMediaQuery,
  useScrollRestoration,
  useSetCurrentPage,
} from "../../utils/hooks";
import { PodcastData } from "../../utils/types";

interface Props {
  categoryPodcasts: PodcastData[];
  category: string;
}

const Category = ({ categoryPodcasts, category: categoryName }: Props) => {
  const router = useRouter();
  useScrollRestoration(router);
  const isBreakPoint = useMediaQuery(1023);

  const { ninjaMode } = NavContext();
  useSetCurrentPage({
    home: false,
    podcasts: false,
    search: false,
    offers: false,
  });
  let backdrop: StaticImageData = LogoText;
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

  console.log(banner);
  return (
    <div className="flex base:mb-[60px] xs:mb-[70px] lg:mb-0 bg-black h-full">
      <Sidebar />
      <div className={`fixed w-full z-50 lg:ml-[240px]`}>
        {
          <div
            className={`flex w-full bg-[#00000073] backdrop-blur-md items-center relative transition-all duration-300 z-50 ${
              banner ? "bottom-0" : "bottom-[500px]"
            } `}
          >
            <div
              className={`flex items-center p-4 sm:p-6 hover:cursor-pointer`}
              onClick={() => scrollToTop()}
            >
              <h1
                className={`font-extrabold relative text-3xl sm:text-5xl transition-all duration-300  `}
              >
                {capitalizeString(categoryName)}
              </h1>
            </div>
          </div>
        }
      </div>
      {categoryPodcasts && (
        <div className="h-screen w-full ">
          <BackButton />

          <Image
            src={backdrop}
            alt="comedy"
            className={`fixed ${
              isBreakPoint && "scale-125"
            } z-0 w-full lg:top-[-100px] xl:top-[-150px] shadow-2xl shadow-black`}
            priority
            ref={backdropRef}
          />
          <div className="w-full h-screen bg-gradient-to-tr bg-black/10 from-black/40 fixed"></div>
          <div className="h-full flex flex-col mt-[140px] sm:mt-[200px] md:mt-[260px] lg:mt-[320px] gap-14">
            <h1
              ref={bannerBreakpointRef}
              className="relative z-50 base:text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-extrabold pl-4"
            >
              {capitalizeString(categoryName)}
            </h1>

            <div
              className={` ${
                ninjaMode
                  ? "bg-gradient-to-b from-[#0a0a0a] to-[#020202]   "
                  : "bg-gradient-to-b from-[#1b1b1b] to-[#121212]"
              } relative grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 grid gap-y-8 gap-x-4 lg:gap-x-8 lg:gap-y-10 p-6 lg:p-10 pb-24`}
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
                            ? "bg-gradient-to-b from-[#212121] to-[#111111] active:from-[#202020] active:to-[#282828]"
                            : "bg-gradient-to-b from-[#2a2a2a] to-[#181818]  active:from-[#202020] active:to-[#343434]"
                        }  flex mt-4 flex-col p-4 items-center max-h-auto  rounded-lg`}
                      >
                        <Image
                          src={podcast.imageUrl}
                          alt={podcast.imageUrl}
                          width={140}
                          height={140}
                          className="rounded-xl mx-4 shadow-lg shadow-black w-[115px] sm:w-[140px] relative z-10 "
                          loading="lazy"
                        />
                        <div className="flex flex-col min-w-[110px] sm:min-w-[130px] items-start justify-start ">
                          <h1 className=" whitespace-nowrap text-xs font-semibold sm:text-sm text-start mt-4 text-[#e6e6e6] group-hover:text-white whitespace-wrap">
                            {truncateString(podcast.title, 15)}
                          </h1>
                          <p className="whitespace-nowrap text-xs  sm:text-sm text-start font-medium text-[#909090]">
                            {truncateString(podcast.publisher, 15)}
                          </p>
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
                        } hover:cursor-pointer flex flex-col items-center max-h-auto px-4 pb-10 rounded-lg min-w-[135px] max-w-[220px]`}
                      >
                        <Image
                          src={podcast.imageUrl}
                          alt={podcast.imageUrl}
                          width={160}
                          height={160}
                          className="rounded-xl mt-4 shadow-lg shadow-black w-[160px] "
                          loading="lazy"
                        />
                        <div className="flex flex-col px-5">
                          <h1 className="whitespace-nowrap text-sm xl:text-md text-start mt-3 font-semibold text-[#dadada] group-hover:text-white">
                            {truncateString(podcast.title, 14)}
                          </h1>
                          <p className="whitespace-nowrap text-sm xl:text-md text-start font-medium text-[#909090]">
                            {truncateString(podcast.publisher, 14)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Footer />
        </div>
      )}
    </div>
  );
};

export default Category;

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
