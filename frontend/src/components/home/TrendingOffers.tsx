import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import { useMediaQuery } from "../../utils/hooks";
import AnimatedLink from "../misc/AnimatedLink";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@chakra-ui/react";
import { convertToSlug } from "../../utils/functions";
import fallbackImage from "../../public/assets/fallback.png";
import { useEffect, useRef, useState } from "react";
import { SponsorData } from "../../utils/types";
import { GiRunningNinja } from "react-icons/gi";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface TrendingOffersProps {
  trendingOffersData: SponsorData[];
  ninjaMode: boolean;
}

const TrendingOffers = ({
  trendingOffersData,
  ninjaMode,
}: TrendingOffersProps) => {
  const trendingOffersSliderRef = useRef<HTMLDivElement>(null);
  const [trendingOfferIndex, setTrendingOfferIndex] = useState("0");
  const [ninjaRunningIndex, setNinjaRunningIndex] = useState(0);
  const isBreakPoint = useMediaQuery(1023);

  const NinjaRunning = Array(5).fill(
    <GiRunningNinja size={isBreakPoint ? 40 : 55} />
  );
  const handleTrendingOfferIndex = (direction: string) => {
    if (direction === "right") {
      setTrendingOfferIndex((prev) => (Number(prev) - 100).toString());
      setNinjaRunningIndex((prev) => prev + 1);
    } else if (direction === "left") {
      setTrendingOfferIndex((prev) => (Number(prev) + 100).toString());
      setNinjaRunningIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const translateXValue = `${trendingOfferIndex}%`;
    if (trendingOffersSliderRef.current) {
      trendingOffersSliderRef.current.style.transitionDuration = "700ms";
      trendingOffersSliderRef.current.style.transform = `translateX(${translateXValue})`;
    }
  }, [trendingOfferIndex]);

  useEffect(() => {
    setNinjaRunningIndex(0);
    setTrendingOfferIndex("0");
  }, [trendingOffersData, isBreakPoint]);
  return (
    <section className="relative w-full mt-14">
      <AnimatedLink
        location="/offers"
        title="Trending Offers"
        separateLink={true}
      />

      {/* Desktop */}
      <>
        {isBreakPoint || (
          <div className="relative overflow-x-clip min-w-full group">
            {ninjaRunningIndex > 0 && (
              <Button
                zIndex={50}
                position={"absolute"}
                left={15}
                top={"50%"}
                className={`group-hover:opacity-100 opacity-0`}
                onClick={() => handleTrendingOfferIndex("left")}
              >
                <MdArrowLeft
                  size={40}
                  className="fill-[#aaaaaa] hover:fill-white transition-all duration-150 ease-in-out"
                />
              </Button>
            )}
            <div ref={trendingOffersSliderRef} className={`flex w-full pt-6`}>
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
                            <Link href={`/${convertToSlug(offer.name)}`}>
                              <Image
                                src={offer.imageUrl || fallbackImage}
                                width={225}
                                height={225}
                                alt={offer.name}
                                priority
                                className={`hover:scale-105 transition-all duration-500 max-h-[120px] max-w-[120px] rounded-lg shadow-xl shadow-black`}
                              />
                            </Link>

                            <div className="flex ml-4 flex-col rounded-sm">
                              <div className="p-6 rounded-md">
                                <div className="flex flex-col gap-2 px-4">
                                  <h2
                                    className={`text-[#ebebeb] text-5xl font-extrabold`}
                                  >
                                    {offer.name}
                                  </h2>
                                  <h3 className={`text-[#bababa] text-xl`}>
                                    {offer.offer}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`relative pt-8 ml-2 flex w-full justify-between `}
                        >
                          <div className={`flex flex-col gap-1 w-9/12 `}>
                            <h2
                              className={`text-2xl font-semibold text-[#ebebeb] `}
                            >
                              About
                            </h2>
                            <p className="font-light">{offer.summary}</p>
                          </div>
                          <Link
                            href={`/${convertToSlug(offer.name)}`}
                            className="pl-6"
                          >
                            <Button className="mt-10">View Details</Button>
                          </Link>
                        </div>
                      </div>
                      <button
                        className="mt-20 right-6 relative opacity-0 transition-all duration-150  group-hover:opacity-100 h-fit hover:cursor-pointer"
                        onClick={() => handleTrendingOfferIndex("right")}
                      ></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {ninjaRunningIndex < trendingOffersData.length - 1 && (
              <Button
                position={"absolute"}
                right={15}
                top={"50%"}
                className="group-hover:opacity-100 opacity-0"
                onClick={() => handleTrendingOfferIndex("right")}
              >
                <MdArrowRight
                  size={40}
                  className="fill-[#aaaaaa] hover:fill-white transition-all duration-150 ease-in-out"
                />
              </Button>
            )}
          </div>
        )}
      </>

      {/* Mobile */}

      <>
        {isBreakPoint && (
          <div className={`flex w-full pt-6`} ref={trendingOffersSliderRef}>
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
                        <div className="flex flex-col items-center">
                          <Link href={`/${convertToSlug(offer.name)}`}>
                            <Image
                              src={offer.imageUrl || fallbackImage}
                              width={120}
                              height={120}
                              alt={offer.name}
                              priority
                              className={`max-h-[150px] max-w-[150px] rounded-lg shadow-xl shadow-black`}
                            />
                          </Link>

                          <div className="flex ml-4 flex-col rounded-sm">
                            <div className="p-6">
                              <div className="flex flex-col items-center gap-2">
                                <h2
                                  className={`text-[#ebebeb] text-center text-xl xs:text-2xl font-extrabold  `}
                                >
                                  {offer.name}
                                </h2>
                                <h3
                                  className={`text-[#bababa] text-sm xs:text-base text-center `}
                                >
                                  {offer.offer}
                                </h3>
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
                            <p className="text-xs xs:text-base">View Details</p>
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
        <div className=" rounded-lg flex gap-6 px-6 bg-[#121212] shadow-black shadow-lg transition-all duration-300 ease-in-out">
          {NinjaRunning.map((ninja, index) => (
            <div
              key={index}
              onClick={() => {
                setTrendingOfferIndex((index * -100).toString());
                setNinjaRunningIndex(index);
              }}
              className={`${
                ninjaRunningIndex === index ? "opacity-100" : "opacity-30"
              } hover:cursor-pointer transition-all duration-500 ease-in`}
            >
              {ninja}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingOffers;
