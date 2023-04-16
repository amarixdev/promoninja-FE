import { Button, Spinner } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import Image from "next/image";
import React, { useState } from "react";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import client from "../../graphql/apollo-client";
import { Operations } from "../../graphql/operations";
import { useMediaQuery } from "../../utils/hooks";
import { SponsorCategory, SponsorData } from "../../utils/types";
import FeaturedGIF from "../../public/assets/optimizedGIF.gif";
import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";

import Link from "next/link";
import Carousel from "../../components/Carousel";

interface Props {
  sponsorsData: SponsorData[];
  categoryData: SponsorCategory[];
  loading: boolean;
}

type GroupedSponsors = { [key: string]: string[] };

const Sponsors = ({ loading, categoryData, sponsorsData }: Props) => {
  const isBreakPoint = useMediaQuery(1023);
  const [currDeg, setCurrDeg] = useState(0);
  const sortedSponsors = sponsorsData?.map((sponsor) => sponsor.name).sort();
  const groupedSponsors: GroupedSponsors = {};

  sortedSponsors.forEach((str, i) => {
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
        <div className="w-full flex flex-col h-screen bg-[#151515] relative overflow-x-hidden z-1 mt-10">
          <div className="flex items-center justify-between w-full relative">
            <h1
              className={`text-3xl sm:text-5xl p-8 fixed font-bold z-10 text-white bg-[#121212] w-full `}
            >
              Sponsors
            </h1>
          </div>
          <div className="w-full mt-20 flex flex-col items-start justify-center">
            <h1 className="font-extrabold px-4 base:text-4xl">Featured</h1>

            <div className="w-full flex flex-col items-center justify-center">
              <h2 className="font-md text-2xl text-start text-[#909090] p-4">
                Athletic Greens
              </h2>
              <Image
                src={FeaturedGIF}
                width={700}
                height={700}
                alt="/"
                priority
                className=""
              />

              <Button className="ml-4 mt-4">More Info</Button>
            </div>

            <div className="w-full flex justify-center items-center h-[200px]">
              <div className="max-w-[60%] max-h-[100px] py-2">
                <p className="font-regular base:text-md xs:text-lg text-[#909090] tracking-widest">
                  Support your favorite creators when you shop with PromoNinja
                  approved sponsors.
                </p>
              </div>
            </div>
            <div className="h-[60vh] mt-10 w-full items-center">
              <div className="w-full flex items-center justify-start">
                <h1 className="text-4xl font-extrabold p-4 text-white">
                  Shop Categories
                </h1>
              </div>
              <div className="flex flex-col items-center px-10">
                <Carousel
                  handleRotate={handleRotate}
                  currDeg={currDeg}
                  categoryData={categoryData}
                />
                <div className="flex gap-10 relative bottom-10">
                  <Button w={100} onClick={() => handleRotate("prev")}>
                    <AiFillCaretLeft />
                  </Button>
                  <Button w={100} onClick={() => handleRotate("next")}>
                    <AiFillCaretRight />
                  </Button>
                </div>
              </div>

              <div className="w-full flex justify-center items-center h-[200px] py-5">
                <div className="max-w-[60%] max-h-[100px] py-2">
                  <p className="font-regular base:text-md xs:text-lg text-[#909090] tracking-widest">
                    Did you know some podcast sponsorships are for charitable
                    causes? For example, {""}
                    <span>
                      <Link
                        href={`/podcasts/lifestyle/${"Crime Junkie"}`}
                        target="_blank"
                        className="hover:text-yellow-200 font-semibold mr-1"
                      >
                        Crime Junkie
                      </Link>
                    </span>
                    has partnered with organizations such as the National Center
                    for Missing and Exploited Children?
                  </p>
                </div>
              </div>

              <div className="w-full flex items-center base:mt-[180px] sm:mt-[100px] justify-start">
                <h1 className="text-4xl font-extrabold p-4 text-white">
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
                            <div className="flex flex-col">
                              <div
                                key={sponsor.name}
                                className="flex flex-col w-[100px] mx-5"
                              >
                                <Image
                                  src={sponsor.imageUrl}
                                  alt={sponsor.name}
                                  width={100}
                                  height={100}
                                  className="rounded-lg"
                                />
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
      <Footer />
    </>
  );
};

export default Sponsors;

export const getStaticProps: GetStaticProps = async () => {
  const { data, loading } = await client.query({
    query: Operations.Queries.GetSponsors,
  });

  let { data: categoryData } = await client.query({
    query: Operations.Queries.GetSponsorCategories,
  });

  const sponsorsData = data?.getSponsors;
  categoryData = categoryData?.getSponsorCategories;

  return {
    props: {
      sponsorsData,
      categoryData,
    },
  };
};
