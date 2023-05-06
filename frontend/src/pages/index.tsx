import { Button } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import client from "../graphql/apollo-client";
import { Operations } from "../graphql/operations";
import LogoText from "../public/assets/logo-text.png";
import Logo from "../public/assets/ninja4.png";
import { useMediaQuery, useSetCurrentPage } from "../utils/hooks";
import { PodcastData, SponsorCategory, SponsorData } from "../utils/types";

import Link from "next/link";
import Carousel from "../components/Carousel";
import { NavContext } from "../context/navContext";
import { scrollToTop, truncateString } from "../utils/functions";

interface Props {
  topPicksData: PodcastData[];
  sponsorsData: SponsorData[];
  categoryData: SponsorCategory[];
}

type GroupedSponsors = { [key: string]: string[] };

const Home = ({ categoryData, sponsorsData, topPicksData }: Props) => {
  useSetCurrentPage({ home: true, podcasts: false, search: false });
  const isBreakPoint = useMediaQuery(1023);
  const [currDeg, setCurrDeg] = useState(0);
  const sortedSponsors = sponsorsData?.map((sponsor) => sponsor.name).sort();
  const groupedSponsors: GroupedSponsors = {};
  const [loading, setLoading] = useState(true);
  const { setCategoryIndex, categoryIndex } = NavContext();

  sortedSponsors.forEach((str) => {
    const firstLetter = str.charAt(0).toUpperCase();
    if (!groupedSponsors[firstLetter]) {
      groupedSponsors[firstLetter] = [];
    } else {
    }
    groupedSponsors[firstLetter].push(str);
  });

  const handleRotate = (direction: any) => {
    if (direction === "next") {
      setCurrDeg(currDeg + 45);
    } else if (direction === "prev") {
      setCurrDeg(currDeg - 45);
    }
  };

  useEffect(() => {
    if (sponsorsData && topPicksData && topPicksData) {
      setLoading(false);
    }
  }, [sponsorsData, topPicksData, topPicksData]);

  return (
    <>
      <div className="flex base:mb-[60px] xs:mb-[70px] lg:mb-0">
        <Sidebar />
        {
          <div className=" w-full flex flex-col bg-gradient-to-b from-[#1d1d1d] via-[#191919] to-[#202020] relative overflow-x-hidden z-1 mt-10">
            <div className="flex items-center justify-between w-full relative">
              <h1
                className={`text-3xl sm:text-5xl p-8 fixed font-bold z-10 text-white bg-[#121212] w-full`}
                onClick={() => {
                  isBreakPoint ? scrollToTop() : null;
                }}
              >
                Home
              </h1>
            </div>
            <div className="w-full flex flex-col items-start justify-center ">
              <div className="w-full mt-20 mb-6 gap-2 flex flex-col items-center justify-center">
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
                  <p className="text-center font-light text-md sm:text-lg text-[#909090] tracking-widest italic">
                    "Give back to your favorite creators by shopping with
                    PromoNinja verified sponsors"
                  </p>
                </div>
              </div>

              <div className="w-full flex flex-col justify-center items-center ">
                <div className="w-full flex justify-between items-center mb-4">
                  <h1 className="text-xl lg:text-2xl font-bold px-4 text-white w-full ">
                    Popular Podcasts
                  </h1>
                  <Link href={"/podcasts"}>
                    <p className="px-4 active:scale-95 text-white whitespace-nowrap text-sm font-bold sm:pr-4 md:pr-6 lg:pr-8 lg:text-base hover:underline-offset-2 hover:underline">
                      View All
                    </p>
                  </Link>
                </div>

                <div
                  className={`flex overflow-x-scroll scrollbar-hide scroll-smooth relative w-full`}
                >
                  {topPicksData.map((podcast) => (
                    <div
                      className={`from-[#181818] bg-gradient-radial to-[#2c2c2c] hover:from-[#202020] hover:to-[#343434] hover:cursor-pointer flex flex-col items-center min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[240px] h-[255px] sm:h-[283px] md:h-[312px] lg:h-[340px] rounded-lg mx-3`}
                      key={podcast.title}
                    >
                      <Link
                        href={`/podcasts/${"categoryName"}/${podcast.title}`}
                        key={podcast.title}
                      >
                        <Image
                          src={podcast.imageUrl}
                          alt={podcast.title}
                          width={190}
                          height={190}
                          loading="lazy"
                          className="rounded-xl mt-4 shadow-lg shadow-black base:w-[130px] xs:w-[150px] sm:w-[170px] md:w-[190px] lg:w-[190px] "
                        />
                      </Link>

                      <div>
                        <h1
                          className={`text-sm sm:text-md lg:text-lg text-center px-2 pt-6 font-semibold text-white whitespace-nowrap`}
                        >
                          {!isBreakPoint
                            ? truncateString(podcast.title, 20)
                            : truncateString(podcast.title, 14)}
                        </h1>
                        <p className="text-xs sm:text-sm lg:text-md text-center px-2 font-medium text-[#909090]">
                          {!isBreakPoint
                            ? podcast.publisher
                            : truncateString(podcast.publisher, 30)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full flex justify-center items-center h-[200px]">
                <div className="max-w-[60%] max-h-[100px] py-2">
                  <p className="font-light text-md sm:text-lg text-[#909090] tracking-widest italic">
                    "As a podcast listener, you have access to exclusive deals
                    to help you save money.
                  </p>
                </div>
              </div>
              <div className="w-full items-center ">
                <div className="w-full flex items-center justify-start">
                  <h1 className="text-xl lg:text-2xl font-bold px-4 mb-12 relative top-9 text-white">
                    Sponsor Categories
                  </h1>
                </div>
                <div className="flex flex-col items-center px-10 py-4 relative bottom-14 ">
                  <Carousel
                    handleRotate={handleRotate}
                    currDeg={currDeg}
                    categoryData={categoryData}
                    setCategoryIndex={setCategoryIndex}
                    categoryIndex={categoryIndex}
                  />
                  <div className="flex gap-10 relative bottom-10">
                    <Button
                      w={100}
                      colorScheme="gray"
                      onClick={() => handleRotate("next")}
                      className="active:scale-95 bg-[#1f2937]"
                    >
                      <AiFillCaretLeft />
                    </Button>
                    <Button
                      w={100}
                      onClick={() => handleRotate("prev")}
                      className="active:scale-95"
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
                          href={`/podcasts/society/${"Crime Junkie"}`}
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
                    <h1 className="text-xl lg:text-2xl font-bold p-4 text-white">
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
                                    <Link href={`/${sponsor.name}`}>
                                      <div className="hover:bg-[#ffffff0e] active:scale-95 hover: h-[100px] w-[100px] rounded-lg absolute transition ease-in-out duration-300 "></div>
                                      <Image
                                        src={sponsor.imageUrl}
                                        alt={sponsor.name}
                                        width={100}
                                        height={100}
                                        className="rounded-lg"
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
    "Crime Junkie",
    "Lex Fridman Podcast",
    "Duncan Trussell Family Hour",
    "Pardon My Take",
    "This Past Weekend",
    "Science Vs",
    "The Always Sunny Podcast",
    "Normal Gossip",
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
