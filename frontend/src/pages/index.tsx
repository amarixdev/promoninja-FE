import { Button, useToast } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import Image from "next/image";
import { JSXElementConstructor, useEffect, useRef, useState } from "react";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { GiNinjaHead } from "react-icons/gi";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import client from "../graphql/apollo-client";
import { Operations } from "../graphql/operations";
import LogoText from "../public/assets/logo-text.png";
import Logo from "../public/assets/ninja4.png";
import useSlider, {
  useCarouselSpeed,
  useMediaQuery,
  useRotate,
  useSetCurrentPage,
} from "../utils/hooks";
import { PodcastData, SponsorCategory, SponsorData } from "../utils/types";

import Link from "next/link";
import Carousel from "../components/Carousel";
import { NavContext } from "../context/navContext";
import { convertToSlug, scrollToTop, truncateString } from "../utils/functions";
import { FaLock } from "react-icons/fa";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import AnimatedLink from "../components/AnimatedLink";

interface Props {
  topPicksData: PodcastData[];
  sponsorsData: SponsorData[];
  categoryData: SponsorCategory[];
}

type GroupedSponsors = { [key: string]: string[] };

const Home = ({ categoryData, sponsorsData, topPicksData }: Props) => {
  useSetCurrentPage({ home: true, podcasts: false, search: false });
  const isBreakPoint = useMediaQuery(1023);
  const sortedSponsors = sponsorsData?.map((sponsor) => sponsor.name).sort();
  const groupedSponsors: GroupedSponsors = {};
  const [loading, setLoading] = useState(true);
  const { setCategoryIndex, categoryIndex } = NavContext();
  const [clickCount, setClickCount] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [displayEasterEgg, setDisplayEasterEgg] = useState(false);
  const [ninjaMode, setNinjaMode] = useState(false);
  const [displayToast, setDisplayToast] = useState(false);
  const toast = useToast();
  const [hover, setHover] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  const { showLeftArrow, showRightArrow, slideTopPicks } = useSlider(
    sliderRef.current,
    1100
  );
  useCarouselSpeed(clickCount, startTime, setDisplayEasterEgg, setNinjaMode);
  const [currDeg, handleRotate] = useRotate(
    startTime,
    clickCount,
    setClickCount,
    setStartTime
  );

  sortedSponsors.forEach((str) => {
    const firstLetter = str.charAt(0).toUpperCase();
    if (!groupedSponsors[firstLetter]) {
      groupedSponsors[firstLetter] = [];
    } else {
    }
    groupedSponsors[firstLetter].push(str);
  });

  const NinjaModeToast = () => {
    if (isBreakPoint) {
      toast({
        title: "Ninja Mode Locked",
        duration: 1500,
        isClosable: true,
        position: "bottom",
        render: () => (
          <div
            className={`z-[99] rounded-md py-6 relative bottom-[100px] bg-[#0f0f0f] shadow-sm shadow-black min-w-[150px] flex justify-center gap-2 items-center`}
          >
            <FaLock />
            <h2 className="font-bold text-base text-[#bebebe]">
              Ninja Mode Locked
            </h2>
          </div>
        ),
      });
    }
  };

  return (
    <>
      <div className="flex base:mb-[60px] xs:mb-[70px] lg:mb-0">
        <Sidebar />
        {
          <div
            className={`w-full flex flex-col bg-gradient-to-b ${
              displayEasterEgg && ninjaMode
                ? "from-[#0e0e0e] via-[#0e0e0e] to-[black]"
                : "from-[#151515] via-[#151515] to-[#121212] "
            } relative overflow-x-hidden z-1 mt-10`}
          >
            {(displayEasterEgg && ninjaMode) || (
              <div
                className={` "to-[#1c1c1c] from-[#686868c9] bg-gradient-to-b " absolute top-10   w-full h-[400px] z-0 `}
              ></div>
            )}
            <div className="flex items-center justify-between w-full relative">
              <div
                className={
                  "fixed bg-[#121212] p-8  w-full z-[20] flex justify-between"
                }
              >
                <h1
                  className={`text-3xl sm:text-5xl font-bold text-white `}
                  onClick={() => {
                    isBreakPoint ? scrollToTop() : null;
                  }}
                >
                  {displayEasterEgg && ninjaMode ? "Ninja" : "Home"}
                </h1>
                {displayEasterEgg ? (
                  <button
                    className={`text-3xl sm:text-5xl font-bold lg:right-[300px] relative hover:cursor-pointer active:scale-95 text-white `}
                    onClick={() => setNinjaMode((prev) => !prev)}
                  >
                    <GiNinjaHead />
                  </button>
                ) : (
                  <>
                    <button
                      className={`text-3xl sm:text-5xl font-bold lg:right-[300px] relative active:cursor-not-allowed hover:cursor-not-allowed text-[#414141]`}
                    >
                      <GiNinjaHead
                        onClick={() => NinjaModeToast()}
                        onMouseEnter={() => {
                          setTimeout(() => {
                            setDisplayToast(true);
                          }, 450);
                        }}
                        onMouseLeave={() => {
                          setTimeout(() => {
                            setDisplayToast(false);
                          }, 300);
                        }}
                      />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col items-start justify-center z-10">
              <div className="w-full mt-20 mb-6 gap-2 flex flex-col items-center justify-center relative ">
                {isBreakPoint || (
                  <div
                    className={`z-[99] rounded-md fixed right-[20px] p-2 transition-all  duration-300 ${
                      displayToast
                        ? "top-[105px] opacity-100"
                        : "top-[-500px] opacity-0"
                    }  bg-[#0f0f0f] shadow-sm shadow-black px-8 py-4 text-[#bebebe] min-w-[200px] flex items-center gap-2`}
                  >
                    <FaLock />
                    <h2 className="font-bold text-base">Ninja Mode Locked</h2>
                  </div>
                )}

                <Image src={LogoText} alt="logo-text" width={225} />
                <Image
                  src={Logo}
                  width={120}
                  alt="logo"
                  className="mx-2 w-[100px] lg:w-[120px] "
                />
              </div>
              <div className="w-full flex items-center justify-center">
                <div className="flex w-full sm:w-[60%] md:w-[50%] items-center justify-center px-6 pb-10 lg:pb-14">
                  <p className="text-center font-light text-md sm:text-lg text-[#909090] tracking-widest italic">
                    "Give back to your favorite creators by shopping with
                    PromoNinja verified sponsors"
                  </p>
                </div>
              </div>

              <div className="w-full flex flex-col justify-center items-center ">
                {/* <div className="w-full flex items-center justify-between group h-fit mb-4 hover:cursor-point "> */}
                <AnimatedLink
                  location=""
                  title="Popular Podcasts"
                  separateLink={true}
                />
                {/* <Link href={"/podcasts"}>
                    <p
                      className={`"px-4 active:scale-95 text-[#cdcdcd] transition-all duration-[200ms] ${
                        isBreakPoint ? "block" : "hidden"
                      } ease-in hover:text-white whitespace-nowrap text-sm font-bold pr-3 sm:pr-4 md:pr-6 lg:pr-8 lg:text-base "`}
                    >
                      View All
                    </p>
                  </Link> */}
                {/* </div> */}
                <div className="relative flex w-full items-center group z-[1]">
                  <div
                    className={`absolute left-0 ${
                      showLeftArrow
                        ? "hover:cursor-pointer"
                        : "hover:cursor-auto"
                    } group-hover:bg-[#00000026] opacity-100 hover:opacity-100 w-20 h-[300px] flex items-center z-10`}
                    onClick={() => slideTopPicks("left")}
                  >
                    <MdChevronLeft
                      color={"white"}
                      className={` left-0 hidden rounded-full opacity-100 absolute cursor-pointer z-[11] ${
                        showLeftArrow ? "group-hover:block" : "hidden"
                      }`}
                      size={80}
                    />
                  </div>
                  <div
                    className={`absolute right-0 ${
                      showRightArrow
                        ? "hover:cursor-pointer"
                        : "hover:cursor-auto"
                    }  hover:cursor-pointer group-hover:bg-[#00000026] opacity-100 hover:opacity-100 w-20 h-[300px] flex items-center z-10`}
                    onClick={() => slideTopPicks("right")}
                  >
                    <MdChevronRight
                      color={"white"}
                      className={` right-0 hidden rounded-full opacity-100 absolute cursor-pointer z-[11] ${
                        showRightArrow ? "group-hover:block" : "hidden"
                      }`}
                      size={80}
                    />
                  </div>

                  <div
                    className={`flex overflow-x-scroll scrollbar-hide scroll-smooth relative w-full`}
                    ref={sliderRef}
                  >
                    {topPicksData.map((podcast: PodcastData) => (
                      <div
                        className={`  ${
                          displayEasterEgg && ninjaMode
                            ? "bg-[#1b1b1b] hover:bg-[#242424] "
                            : " bg-gradient-to-b from-[#2a2a2a] to-[#181818] hover:from-[#202020] hover:to-[#343434]"
                        }  hover:cursor-pointer flex flex-col items-center min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[220px] h-[255px] sm:h-[283px] lg:h-[300px] rounded-lg mx-3`}
                        key={podcast.title}
                      >
                        <Link
                          href={`/podcasts/${
                            podcast.category[0].name
                          }/${convertToSlug(podcast.title)}`}
                          key={podcast.title}
                        >
                          <Image
                            src={podcast.imageUrl}
                            alt={podcast.title}
                            width={190}
                            height={190}
                            loading="lazy"
                            className="rounded-xl mt-4 shadow-lg shadow-black base:w-[130px] xs:w-[150px] sm:w-[170px]  "
                          />
                        </Link>

                        <div className="">
                          <h1
                            className={`text-sm sm:text-md lg:font-bold  text-center px-2 pt-6 font-semibold text-white whitespace-nowrap`}
                          >
                            {!isBreakPoint
                              ? truncateString(podcast.title, 20)
                              : truncateString(podcast.title, 14)}
                          </h1>
                          <p className="text-xs sm:text-sm text-center px-2 font-medium text-[#909090]">
                            {!isBreakPoint
                              ? podcast.publisher
                              : truncateString(podcast.publisher, 30)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-center items-center h-[200px]">
                <div className="lg:max-w-[40%] max-w-[60%] sm:max-w-[50%] max-h-[100px] py-2">
                  <p className="font-light text-md sm:text-lg text-[#909090]  tracking-widest italic">
                    "As a podcast listener, you have access to exclusive deals
                    to help you save money.
                  </p>
                </div>
              </div>
              <div className="w-full items-center ">
                <div className="w-full flex items-center justify-start">
                  <h1
                    className={`"text-xl lg:text-2xl font-bold px-4 mb-12 relative top-9 ${
                      ninjaMode && displayEasterEgg
                        ? "text-[#cdcdcd]"
                        : "text-[#dedede]"
                    }  z-20"`}
                  >
                    Sponsor Categories
                  </h1>
                </div>
                <div className="flex flex-col items-center relative bottom-14 py-6 rounded-lg">
                  <Carousel
                    handleRotate={handleRotate}
                    currDeg={currDeg}
                    categoryData={categoryData}
                    setCategoryIndex={setCategoryIndex}
                    categoryIndex={categoryIndex}
                  />
                  <div className="flex gap-10 relative bottom-10 z-20">
                    <Button
                      w={100}
                      colorScheme="gray"
                      onClick={() => handleRotate("next")}
                      className={`active:scale-95 `}
                      onMouseLeave={() => {
                        setClickCount(0);
                      }}
                    >
                      <AiFillCaretLeft />
                    </Button>
                    <Button
                      w={100}
                      onClick={() => handleRotate("prev")}
                      className="active:scale-95"
                      onMouseLeave={() => {
                        setClickCount(0);
                      }}
                    >
                      <AiFillCaretRight />
                    </Button>
                  </div>
                </div>

                <div className="w-full flex justify-center items-center relative bottom-10 lg:bottom-10">
                  <div className="max-w-[60%] max-h-[100px] py-2">
                    <p className="font-light text-md sm:text-lg  text-[#909090] tracking-widest italic">
                      "Did you know some podcast sponsorships are for charitable
                      causes? For example, {""}
                      <span>
                        <Link
                          href={`/podcasts/society/${"crime-junkie"}`}
                          target="_blank"
                          className="hover:text-yellow-200 font-semibold mr-1 italic"
                        >
                          Crime Junkie
                        </Link>
                      </span>
                      has partnered with organizations such as the National
                      Center for Missing and Exploited Children."
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full flex items-center base:mt-[120px] sm:mt-[60px] lg:mt-0 justify-start">
                    <h1
                      className={`"text-xl lg:text-2xl font-bold p-4 ${
                        ninjaMode && displayEasterEgg
                          ? "text-[#cdcdcd]"
                          : "text-[#dedede]"
                      } "`}
                    >
                      Sponsors A-Z
                    </h1>
                  </div>
                  <div className="w-full mb-14 flex flex-col items-center">
                    {Object.keys(groupedSponsors).map((letter) => (
                      <div className="w-full p-4 my-4" key={letter}>
                        <p className="text-[#909090] text-3xl font-bold">
                          {letter}
                        </p>
                        <div className="w-full flex flex-wrap p-1 gap-y-16 gap-x-2 items-center base:justify-center lg:justify-start">
                          {groupedSponsors[letter].map((sponsor) =>
                            sponsorsData
                              .filter((data) => data.name === sponsor)
                              .map((sponsor) => (
                                <div
                                  key={sponsor.name}
                                  className="flex flex-col"
                                >
                                  <div className="flex flex-col w-[100px] mx-5">
                                    <Link
                                      href={`/${convertToSlug(sponsor.name)}`}
                                    >
                                      <div className="hover:bg-[#ffffff0e] active:scale-95 h-[100px] w-[100px] rounded-lg absolute transition ease-in-out duration-300"></div>
                                      <Image
                                        src={sponsor.imageUrl}
                                        alt={sponsor.name}
                                        width={100}
                                        height={100}
                                        className="rounded-lg min-w-[100px] min-h-[100px]"
                                        loading="lazy"
                                      />
                                    </Link>

                                    <div>
                                      <h1 className="text-white font-semibold absolute text-sm mt-2 text-center max-w-[100px]">
                                        {sponsor.name}
                                      </h1>
                                    </div>
                                  </div>
                                </div>
                              ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
      <Footer />
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  let { data: sponsorsData } = await client.query({
    query: Operations.Queries.GetSponsors,
  });

  let { data: categoryData } = await client.query({
    query: Operations.Queries.GetSponsorCategories,
  });

  const podcastTitles = [
    "Huberman Lab",
    "Bad Friends",
    "Almost Adulting with Violet Benson",
    "Crime Junkie",
    "Lex Fridman Podcast",
    "Duncan Trussell Family Hour",
    "Pardon My Take",
    "This Past Weekend",
    "Science Vs",
    "The Always Sunny Podcast",
    "Normal Gossip",
    "KILL TONY",
    "Murder, Mystery & Makeup",
    "The Joe Rogan Experience",
    "On Purpose with Jay Shetty",
    "Last Podcast On The Left",
    "SmartLess",
  ];
  let { data: topPicksData } = await client.query({
    query: Operations.Queries.GetTopPicks,
    variables: {
      input: {
        podcastTitles,
      },
    },
  });

  sponsorsData = sponsorsData?.getSponsors;
  categoryData = categoryData?.getSponsorCategories;
  topPicksData = topPicksData?.getTopPicks;

  return {
    props: {
      sponsorsData,
      categoryData,
      topPicksData,
    },
  };
};
