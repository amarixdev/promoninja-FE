import { Button, Spinner } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import client from "../graphql/apollo-client";
import { Operations } from "../graphql/operations";
import { useMediaQuery, useSetCurrentPage } from "../utils/hooks";
import { PodcastData, SponsorCategory, SponsorData } from "../utils/types";
import FeaturedGIF from "../public/assets/optimizedGIF.gif";
import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";
import Logo from "../public/assets/ninja4.png";
import LogoText from "../public/assets/logo-text.png";

import style from "../../styles/style.module.css";
import Link from "next/link";
import Carousel from "../components/Carousel";
import { truncateString } from "../utils/functions";
import { NavContext } from "../context/navContext";
import { useRouter } from "next/router";

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

  if (loading) return <Spinner />;
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="w-full flex flex-col h-screen bg-gradient-to-t from-[#151515] via-[#151515] to-[#282727] relative overflow-x-hidden z-1 mt-10">
          <div className="flex items-center justify-between w-full relative">
            <h1
              className={`text-3xl sm:text-5xl p-8 fixed font-bold z-10 text-white bg-[#121212] w-full `}
            >
              Home
            </h1>
          </div>
          <div className="w-full flex flex-col items-start justify-center ">
            <div className="w-full mt-14 p-5 flex justify-center items-center h-[200px]">
              <div className="flex w-full items-center justify-center">
                <Image
                  src={Logo}
                  width={120}
                  alt="logo"
                  className="mx-2 w-[80px] lg:w-[120px]"
                />
                <p className=" font-light text-md sm:text-lg text-[#909090] tracking-widest ">
                  "Support your favorite creators when you shop with PromoNinja
                  approved sponsors!"
                </p>
              </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center ">
              <h1 className="text-xl lg:text-2xl font-bold p-4 text-white w-full ">
                Editor's Top Picks
              </h1>
              <div
                className={`flex overflow-x-scroll scrollbar-hide scroll-smooth relative w-full`}
              >
                {topPicksData.map((podcast) => (
                  <div
                    className={`from-[#0d0d0d] bg-gradient-radial to-[#202020] hover:from-[#202020] hover:to-[#343434] hover:cursor-pointer flex flex-col items-center min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[240px] h-[255px] sm:h-[283px] md:h-[312px] lg:h-[340px] rounded-lg mx-3`}
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
            {/* <h1 className=" text-xl lg:text-2xl font-bold px-4 mt-6">
              Featured Sponsor
            </h1>
            <div className="w-full flex flex-col items-center justify-center bg-gradient-to-b to-[#3d3d3d0a] from-[#5655552a] p-6 mt-6 shadow-2xl shadow-black">
              <h2 className="font-extralight base:text-3xl sm:text-4xl tracking-wide text-start text-[#909090] p-4">
                Athletic Greens
              </h2>
              <Image
                src={FeaturedGIF}
                width={700}
                height={700}
                alt="/"
                priority
                className="rounded-3xl "
              />
              <Link href={`/${"Athletic Greens"}`}>
                <Button className="ml-4 mt-4">More Info</Button>
              </Link>
            </div> */}
            <div className="w-full flex justify-center items-center h-[200px]">
              <div className="max-w-[60%] max-h-[100px] py-2">
                <p className="font-light text-md sm:text-lg text-[#909090] tracking-widest">
                  "As a podcast listener, you have access to exclusive deals
                  that have been secured with various partners to help you save
                  money."
                </p>
              </div>
            </div>
            <div className="w-full items-center ">
              <div className="w-full flex items-center justify-start">
                <h1 className="text-xl lg:text-2xl font-bold p-4 mb-4 relative top-14 text-white">
                  Shop Categories
                </h1>
              </div>
              <div className="flex flex-col items-center px-10 relative bottom-14 ">
                <Carousel
                  handleRotate={handleRotate}
                  currDeg={currDeg}
                  categoryData={categoryData}
                />
                <div className="flex gap-10 relative bottom-10">
                  <Button w={100} onClick={() => handleRotate("next")}>
                    <AiFillCaretLeft />
                  </Button>
                  <Button w={100} onClick={() => handleRotate("prev")}>
                    <AiFillCaretRight />
                  </Button>
                </div>
              </div>

              <div className="w-full flex justify-center items-center relative bottom-10 lg:bottom-10 py-5">
                <div className="max-w-[60%] max-h-[100px] py-2">
                  <p className="font-light text-md sm:text-lg  text-[#909090] tracking-widest">
                    "Did you know some podcast sponsorships are for charitable
                    causes? For example, {""}
                    <span>
                      <Link
                        href={`/podcasts/society/${"Crime Junkie"}`}
                        target="_blank"
                        className="hover:text-yellow-200 font-semibold mr-1"
                      >
                        Crime Junkie
                      </Link>
                    </span>
                    has partnered with organizations such as the National Center
                    for Missing and Exploited Children."
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="w-full flex items-center base:mt-[120px]  justify-start">
                  <h1 className="text-xl lg:text-2xl font-bold p-4 text-white">
                    Sponsors A-Z
                  </h1>
                </div>
                <div className="w-full h-screen flex flex-col items-center">
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
                              <div key={sponsor.name} className="flex flex-col">
                                <div className="flex flex-col w-[100px] mx-5">
                                  <Link href={`/${sponsor.name}`}>
                                    <Image
                                      src={sponsor.imageUrl}
                                      alt={sponsor.name}
                                      width={100}
                                      height={100}
                                      className="rounded-lg"
                                    />
                                  </Link>

                                  <div>
                                    <h1 className="font-semibold absolute text-sm mt-2 text-center max-w-[100px]">
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
      </div>
      <Footer />
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  let { data: sponsorsData, loading } = await client.query({
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
    "Jemele Hill is Unbothered",
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
