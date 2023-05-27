import { Button } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { GiRunningNinja } from "react-icons/gi";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import client from "../graphql/apollo-client";
import { Operations } from "../graphql/operations";
import LogoText from "../public/assets/logo-text.png";
import Logo from "../public/assets/ninja4.png";
import {
  useCarouselSpeed,
  useHoverCard,
  useMediaQuery,
  useRotate,
  useSetCurrentPage,
} from "../utils/hooks";
import { PodcastData, SponsorCategory, SponsorData } from "../utils/types";

import Link from "next/link";
import { BiChevronRight } from "react-icons/bi";
import AnimatedLink from "../components/AnimatedLink";
import Carousel from "../components/Carousel";
import Header from "../components/Header";
import SliderArrows from "../components/SliderArrows";
import { NavContext } from "../context/navContext";
import { convertToSlug, truncateString } from "../utils/functions";

interface Props {
  topPicksData: PodcastData[];
  sponsorsData: SponsorData[];
  categoryData: SponsorCategory[];
  trendingOffersData: SponsorData[];
}

type GroupedSponsors = { [key: string]: string[] };

const Home = ({
  categoryData,
  sponsorsData,
  topPicksData,
  trendingOffersData,
}: Props) => {
  useSetCurrentPage({
    home: true,
    podcasts: false,
    search: false,
    offers: false,
  });
  const isBreakPoint = useMediaQuery(1023);
  const sortedSponsors = sponsorsData?.map((sponsor) => sponsor.name).sort();
  const groupedSponsors: GroupedSponsors = {};

  const { setCategoryIndex, categoryIndex, ninjaMode, setNinjaMode } =
    NavContext();
  const [clickCount, setClickCount] = useState(0);
  const [startTime, setStartTime] = useState(0);

  const [trendingOfferIndex, setTrendingOfferIndex] = useState("0");
  const [ninjaRunningIndex, setNinjaRunningIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  useCarouselSpeed(clickCount, startTime, setNinjaMode);
  const [currDeg, handleRotate] = useRotate(
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

  const { activeIndex, setActiveIndex, handleHoverCard } = useHoverCard();
  const [maxIndex, setMaxIndex] = useState(
    trendingOffersData.length * -100 + 100
  );
  const trendingOffersSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMaxIndex(trendingOffersData.length * -100 + 100);
  }, [trendingOffersData]);

  useEffect(() => {
    const translateXValue = `${trendingOfferIndex}%`;
    if (trendingOffersSliderRef.current) {
      trendingOffersSliderRef.current.style.transitionDuration = "700ms";
      trendingOffersSliderRef.current.style.transform = `translateX(${translateXValue})`;
    }
  }, [trendingOfferIndex]);

  const handleTrendingOfferIndex = () => {
    if (Number(trendingOfferIndex) !== maxIndex) {
      setTrendingOfferIndex((prev) => (Number(prev) - 100).toString());
      setNinjaRunningIndex((prev) => prev + 1);
    }

    if (Number(trendingOfferIndex) === maxIndex) {
      setTrendingOfferIndex("0");
      setNinjaRunningIndex(0);
    }
  };

  const NinjaRunning = Array(5).fill(
    <GiRunningNinja size={isBreakPoint ? 40 : 55} />
  );

  return (
    <>
      <div className="flex base:mb-[60px] xs:mb-[70px] lg:mb-0">
        <Sidebar />
        {
          <div
            className={`w-full flex flex-col bg-gradient-to-b  ${
              ninjaMode
                ? "from-[#0e0e0e] via-[#0e0e0e] to-[black]"
                : "from-[#151515] via-[#151515] to-[#121212] "
            } relative overflow-x-hidden z-1 mt-10`}
          >
            {ninjaMode || (
              <div
                className={` from-[#313131] bg-gradient-to-b  absolute top-10   w-full h-[400px] z-0 `}
              ></div>
            )}
            <Header page="Home" />
            <div className="w-full flex flex-col items-start justify-center z-10">
              <div className="w-full mt-20 mb-6 gap-2 flex flex-col items-center justify-center relative ">
                <Image src={LogoText} alt="logo-text" width={225} />
                <Image
                  src={Logo}
                  width={120}
                  alt="logo"
                  className="mx-2 w-[100px] lg:w-[120px]"
                />
              </div>
              <div className="w-full flex items-center justify-center">
                <div className="flex w-full sm:w-[60%] md:w-[50%] items-center justify-center px-6 pb-10 lg:pb-14">
                  <p className="text-center  font-light text-md sm:text-lg lg:text-xl text-[#909090] tracking-widest italic">
                    "<span className="font-bold">Save money</span> and{" "}
                    <span className="font-semibold">give back</span> to your
                    favorite creators when you shop with PromoNinja verified
                    sponsors"
                  </p>
                </div>
              </div>

              <div className="w-full flex flex-col justify-center items-center">
                <AnimatedLink
                  location="/podcasts"
                  title="Popular Podcasts"
                  separateLink={true}
                />

                <div className="relative flex w-full items-center group z-[1]">
                  <SliderArrows sliderRef={sliderRef} scrollDistance={1200} />
                  <div
                    className={`flex overflow-x-scroll scrollbar-hide scroll-smooth relative w-full py-10 lg:px-10`}
                    ref={sliderRef}
                  >
                    {topPicksData.map((podcast: PodcastData, index: number) => (
                      <Link
                        href={`/podcasts/${
                          podcast.category[0].name
                        }/${convertToSlug(podcast.title)}`}
                        key={podcast.title}
                      >
                        <div
                          className={`${
                            ninjaMode
                              ? "bg-gradient-to-b from-[#212121] to-[#111111] hover:from-[#202020] hover:to-[#282828]"
                              : "bg-gradient-to-b from-[#2a2a2a] to-[#181818] hover:from-[#202020] hover:to-[#343434]"
                          } hover:cursor-pointer ${
                            activeIndex === index
                              ? " scale-125 transition-all duration-300 relative z-20"
                              : "scale-100 transition-all duration-300 "
                          } relative flex flex-col items-center min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[220px] h-[255px] sm:h-[283px] lg:h-[300px] rounded-lg mx-3`}
                          key={podcast.title}
                          onMouseOver={() =>
                            handleHoverCard(index, "mouseenter")
                          }
                          onMouseMove={() =>
                            handleHoverCard(index, "mouseenter")
                          }
                          onMouseLeave={() => {
                            handleHoverCard(index, "mouseleave");
                            setActiveIndex(null);
                          }}
                        >
                          <Image
                            src={podcast.imageUrl}
                            alt={podcast.title}
                            width={190}
                            height={190}
                            loading="lazy"
                            className="rounded-xl mt-4 shadow-lg shadow-black base:w-[130px] xs:w-[150px] sm:w-[170px] "
                          />
                          <div>
                            <h1
                              className={`text-sm sm:text-md lg:font-bold  text-center px-2 pt-6 font-semibold text-[#dadada] group-hover:text-white whitespace-nowrap`}
                            >
                              {!isBreakPoint
                                ? truncateString(podcast.title, 20)
                                : truncateString(podcast.title, 14)}
                            </h1>
                            <p
                              className={`text-xs sm:text-sm text-center px-2 font-medium text-[#909090]`}
                            >
                              {!isBreakPoint
                                ? activeIndex !== index
                                  ? truncateString(podcast.title, 20)
                                  : "See Exclusive Deals: "
                                : truncateString(podcast.title, 14)}
                            </p>
                          </div>
                          {
                            <div
                              className={`${
                                activeIndex === index
                                  ? "opacity-100"
                                  : "opacity-0"
                              } flex items-center gap-3 p-2 transition duration-300 `}
                            >
                              {podcast.sponsors?.map((sponsor) => (
                                <Image
                                  src={sponsor?.imageUrl || Logo}
                                  alt={sponsor?.imageUrl}
                                  width={30}
                                  height={30}
                                  className={
                                    sponsor?.imageUrl
                                      ? "rounded-md"
                                      : "opacity-0"
                                  }
                                  key={sponsor?.imageUrl || index}
                                />
                              ))}
                              {podcast.sponsors?.length > 2 && (
                                <p className="text-[#b4b4b4] text-2xl font-thin">
                                  +
                                </p>
                              )}
                            </div>
                          }
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              {/* <div className="w-full flex justify-center items-center h-[200px]">
                <div className="lg:max-w-[40%] max-w-[60%] sm:max-w-[50%] max-h-[100px] py-2">
                  <p className="font-light text-md sm:text-lg text-[#909090]  tracking-widest italic">
                    "As a podcast listener, you have access to exclusive deals
                    to help you save money.
                  </p>
                </div>
              </div> */}

              {/* Trending Offers */}
              <div className="relative w-full mt-14">
                <AnimatedLink
                  location="/offers"
                  title="Trending Offers"
                  separateLink={true}
                />

                {/* Desktop */}
                <>
                  {isBreakPoint || (
                    <div
                      ref={trendingOffersSliderRef}
                      className={`flex w-full pt-6`}
                    >
                      {trendingOffersData.map((offer) => (
                        <div
                          className="min-w-full flex items-center justify-center"
                          key={offer.name}
                        >
                          <div
                            className={`${
                              ninjaMode
                                ? "bg-[#1b1b1b] "
                                : "bg-gradient-to-r from-[#232323] to-[#181818]"
                            }  w-10/12 group flex h-fit p-8 rounded-md justify-start shadow-lg shadow-[black] `}
                          >
                            <div className="flex w-full">
                              <div className="flex flex-col min-w-full ">
                                <div className="flex-col flex w-full ">
                                  <div className="flex justify-start ">
                                    <Image
                                      src={offer.imageUrl}
                                      width={225}
                                      height={225}
                                      alt={offer.name}
                                      priority
                                      className={` max-h-[120px] max-w-[120px] rounded-lg shadow-xl shadow-black`}
                                    />
                                    <div className="flex ml-4 flex-col rounded-sm">
                                      <div className="p-6 rounded-md">
                                        <div className="flex flex-col gap-2 px-4">
                                          <h1
                                            className={`text-[#ebebeb] text-5xl font-extrabold`}
                                          >
                                            {offer.name}
                                          </h1>
                                          <h1
                                            className={`text-[#bababa] text-xl`}
                                          >
                                            {offer.offer}
                                          </h1>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div
                                  className={`relative pt-8 ml-2 flex w-full justify-between `}
                                >
                                  <div
                                    className={`flex flex-col gap-1 w-9/12 `}
                                  >
                                    <h1
                                      className={`text-2xl font-semibold text-[#ebebeb] `}
                                    >
                                      About
                                    </h1>
                                    <p className="font-light">
                                      {offer.summary}
                                    </p>
                                  </div>
                                  <Link
                                    href={`/${convertToSlug(offer.name)}`}
                                    className="pl-6"
                                  >
                                    <Button className="mt-10">
                                      View Details
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                              <div
                                className="mt-20 right-6 relative opacity-0 group-hover:opacity-100 h-fit hover:cursor-pointer"
                                onClick={() => handleTrendingOfferIndex()}
                              >
                                <BiChevronRight
                                  size={60}
                                  className="hover:fill-white fill-[#aaaaaa]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>

                {/* Mobile */}

                <>
                  {isBreakPoint && (
                    <div
                      className={`flex w-full pt-6`}
                      ref={trendingOffersSliderRef}
                    >
                      {trendingOffersData.map((offer, index) => (
                        <div
                          className="min-w-full flex items-center justify-center snap-center"
                          key={offer.name}
                        >
                          <div
                            className={`${
                              ninjaMode
                                ? "bg-[#1b1b1b] "
                                : "bg-gradient-to-r from-[#232323] to-[#181818]"
                            }  w-10/12 group flex h-fit p-5 rounded-md justify-start shadow-lg shadow-[black]`}
                          >
                            <div className="flex w-full">
                              <div className="flex flex-col min-w-full ">
                                <div className="flex-col flex w-full ">
                                  <div className="flex flex-col items-center ">
                                    <Image
                                      src={offer.imageUrl}
                                      width={120}
                                      height={120}
                                      alt={offer.name}
                                      priority
                                      className={` max-h-[150px] max-w-[150px] rounded-lg shadow-xl shadow-black`}
                                    />
                                    <div className="flex ml-4 flex-col rounded-sm">
                                      <div className="p-6">
                                        <div className="flex flex-col items-center gap-2">
                                          <h1
                                            className={`text-[#ebebeb] text-center text-2xl font-extrabold  `}
                                          >
                                            {offer.name}
                                          </h1>
                                          <h1
                                            className={`text-[#bababa] text-md text-center `}
                                          >
                                            {offer.offer}
                                          </h1>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div
                                  className={`relative flex-col w-full justify-between `}
                                >
                                  <Link
                                    href={`/${convertToSlug(offer.name)}`}
                                    className="w-full flex justify-center"
                                  >
                                    <Button className="mt-5">
                                      View Details
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
                <div className="w-full mt-4 lg:mt-8 flex items-center justify-center">
                  <div className=" rounded-lg flex gap-6 px-6 bg-[#121212] shadow-black shadow-lg">
                    {NinjaRunning.map((ninja, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setTrendingOfferIndex((index * -100).toString());
                          setNinjaRunningIndex(index);
                        }}
                        className={`${
                          ninjaRunningIndex === index
                            ? "opacity-100"
                            : "opacity-30"
                        } hover:cursor-pointer transition-all duration-500 ease-in`}
                      >
                        {ninja}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full items-center relative">
                {/* Sponsor Carousel */}

                <div className="mt-16 lg:mt-28">
                  <div className="w-full flex items-center justify-start">
                    <h1
                      className={`text-base  lg:text-2xl font-bold px-4 mb-12 relative top-9 text-[#cdcdcd]
                     z-20"`}
                    >
                      Shop Categories
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
                </div>

                {/* <div className="w-full flex justify-center items-center relative bottom-10 lg:bottom-10">
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
                </div> */}

                {/* Sponsors A-Z */}

                <div className="relative">
                  <div className="w-full flex items-center lg:mt-14 justify-start">
                    <h1
                      className={`text-base lg:text-2xl font-bold p-4 text-[#cdcdcd]`}
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
                                      <div className="hover:bg-[#ffffff0e]  active:scale-95 h-[100px] w-[100px] rounded-lg absolute transition ease-in-out duration-300"></div>
                                      <Image
                                        src={sponsor.imageUrl}
                                        alt={sponsor.name}
                                        width={100}
                                        height={100}
                                        className="rounded-lg min-w-[100px] x min-h-[100px]"
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
  const popularPodcasts = [
    "Huberman Lab",
    "Bad Friends",
    "Almost Adulting with Violet Benson",
    "Lex Fridman Podcast",
    "Duncan Trussell Family Hour",
    "Pardon My Take",
    "This Past Weekend",
    "Science Vs",
    "The Always Sunny Podcast",
    "Normal Gossip",
    "KILL TONY",
    "Murder, Mystery & Makeup",
    "On Purpose with Jay Shetty",
    "Last Podcast On The Left",
    "SmartLess",
  ];
  let { data: topPicksData } = await client.query({
    query: Operations.Queries.GetTopPicks,
    variables: {
      input: {
        podcastTitles: popularPodcasts,
      },
    },
  });

  const trendingOffers = [
    "Athletic Greens",
    "Tushy",
    "Helix Mattress",
    "SquareSpace",
    "ExpressVPN",
  ];

  let { data: trendingOffersData } = await client.query({
    query: Operations.Queries.GetTrendingOffers,
    variables: {
      input: {
        sponsors: trendingOffers,
      },
    },
  });

  let { data: sponsorsData } = await client.query({
    query: Operations.Queries.GetSponsors,
    variables: {
      input: {
        offset: 0,
        pageSize: 100,
        offerPage: false,
      },
    },
  });

  let { data: categoryData } = await client.query({
    query: Operations.Queries.GetSponsorCategories,
  });

  sponsorsData = sponsorsData?.getSponsors;
  categoryData = categoryData?.getSponsorCategories;
  topPicksData = topPicksData?.getTopPicks;
  trendingOffersData = trendingOffersData?.getTrendingOffers;

  return {
    props: {
      sponsorsData,
      categoryData,
      topPicksData,
      trendingOffersData,
    },
  };
};
