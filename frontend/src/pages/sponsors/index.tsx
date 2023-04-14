import { Button, Spinner } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import Image from "next/image";
import React from "react";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import client from "../../graphql/apollo-client";
import { Operations } from "../../graphql/operations";
import { useMediaQuery } from "../../utils/hooks";
import { SponsorCategory, SponsorData } from "../../utils/types";
import FeaturedGIF from "../../public/assets/optimizedGIF.gif";

import Link from "next/link";

interface Props {
  sponsorsData: SponsorData[];
  categoryData: SponsorCategory[];
  loading: boolean;
}

type GroupedSponsors = { [key: string]: string[] };

const Sponsors = ({ loading, categoryData, sponsorsData }: Props) => {
  const isBreakPoint = useMediaQuery(1023);

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
            <h2 className="font-md text-2xl text-[#909090] p-4">
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
            <Button className="ml-4">More Info</Button>
            <div className="w-full flex justify-center items-center h-[200px]">
              <div className="max-w-[60%] max-h-[100px] py-2">
                <p className="font-regular base:text-md xs:text-lg text-[#909090] tracking-widest">
                  Support your favorite podcasts when you shop with PromoNinja
                  approved sponsors.
                </p>
              </div>
            </div>
            <div className="h-[60vh] mt-10 w-full items-center">
              <div className="w-full flex items-center justify-start">
                <h1 className="text-4xl font-bold p-4 text-[#909090]">
                  Browse Categories
                </h1>
              </div>
              <div className="w-full mt-6 flex overflow-x-scroll scrollbar-hide">
                {categoryData.map((category: SponsorCategory) => (
                  <Link
                    key={category.name}
                    href={`/sponsors/${category.name}`}
                    className="min-w-[67%] mx-4 rounded-3xl shadow-lg flex flex-col items-center"
                  >
                    <div className="w-[100%] h-20 flex items-center justify-center bg-black/20 hover:bg-[#1b1b1b] rounded-xl">
                      <p className="text-xl font-extrabold text-[#bdbdbd]">
                        {" "}
                        {category.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="w-full flex items-center justify-start mt-10">
                <h1 className="text-4xl font-bold p-4 text-[#909090]">A-Z</h1>
              </div>
              <div className="w-full h-screen flex flex-col items-center">
                {Object.keys(groupedSponsors).map((letter) => (
                  <div className="w-full p-4" key={letter}>
                    <p className="text-white text-3xl font-bold">{letter}</p>
                    <div className="w-full flex flex-wrap p-4 gap-y-16 gap-x-2 items-center justify-start">
                      {groupedSponsors[letter].map((sponsor) =>
                        sponsorsData
                          .filter((data) => data.name === sponsor)
                          .map((sponsor) => (
                            <div className="flex flex-col">
                              <div
                                key={sponsor.name}
                                className="flex flex-col w-[150px]"
                              >
                                <Image
                                  src={sponsor.imageUrl}
                                  alt={sponsor.name}
                                  width={120}
                                  height={120}
                                  className="rounded-lg"
                                />
                              </div>
                              <div className="mt-2">
                                <h1 className="font-semibold text-start text-sm absolute max-w-[150px]">
                                  {sponsor.name}
                                </h1>
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
