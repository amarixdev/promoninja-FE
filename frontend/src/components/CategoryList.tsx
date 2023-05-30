import Image from "next/image";
import Link from "next/link";
import {
  capitalizeString,
  convertToSlug,
  truncateString,
} from "../utils/functions";
import { useMediaQuery } from "../utils/hooks";
import { CategoryPodcast, PodcastData } from "../utils/types";

import { useEffect, useRef } from "react";
import AnimatedLink from "./AnimatedLink";
import SliderArrows from "./SliderArrows";
interface CategoryProps {
  category: CategoryPodcast;
  ninjaMode: boolean;
}

const CategoryList = ({ category, ninjaMode }: CategoryProps) => {
  const categoryName = Object.keys(category)[0];
  const podcastData = category[categoryName];
  const isBreakPoint = useMediaQuery(1023);

  const sliderRef = useRef<HTMLDivElement>(null);
  const slider = sliderRef.current;

  useEffect(() => {
    console.log("effect ran");
    if (slider && !isBreakPoint) {
      slider.scrollLeft = 40;
    }
  }, [slider]);

  return (
    <div>
      {/* Mobile */}
      {isBreakPoint ? (
        <div className=" py-5">
          <div className={`flex justify-between items-center pl-4 `}>
            <AnimatedLink
              title={capitalizeString(categoryName)}
              location={`/podcasts/${convertToSlug(categoryName)}`}
              separateLink={false}
            />
          </div>

          <div className="relative flex w-full items-center group z-[1] ">
            <div
              className={`flex overflow-x-scroll scrollbar-hide scroll-smooth relative w-full justify-start px-3`}
            >
              {podcastData?.slice(0, 8).map((podcast: PodcastData) => (
                <Link
                  href={`/podcasts/${convertToSlug(
                    categoryName
                  )}/${convertToSlug(podcast.title)}`}
                  key={podcast.title}
                >
                  <div
                    className={` ${
                      ninjaMode
                        ? "bg-gradient-to-b from-[#212121] to-[#111111] hover:from-[#202020] hover:to-[#282828] "
                        : "bg-gradient-to-b from-[#2a2a2a] to-[#181818] hover:from-[#202020] hover:to-[#343434]"
                    } mt-4 p-4 flex flex-col items-center min-w-[120px] md:min-w-[140px] h-fit ml-2 rounded-lg overflow-y-visible sm:mx-5`}
                    key={podcast.title}
                  >
                    <Image
                      src={podcast.imageUrl}
                      alt={podcast.title}
                      width={110}
                      height={110}
                      loading="lazy"
                      className="rounded-xl  shadow-lg shadow-black max-w-[90px] sm:max-w-[110px]"
                    />

                    <div className=" min-w-[90px] sm:min-w-[110px] flex flex-col items-start">
                      <h1 className=" whitespace-nowrap text-[10px] sm:text-xs lg:text-sm xl:text-lg text-start mt-3 font-semibold  text-[#dadada] group-hover:text-white whitespace-wrap">
                        {truncateString(podcast.title, 14)}
                      </h1>
                      <p className="whitespace-nowrap text-[10px] sm:text-xs lg:text-md text-start font-medium text-[#909090]">
                        {truncateString(podcast.publisher, 14)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className={`flex justify-between items-center lg:my-4 pl-4`}>
            <AnimatedLink
              title={capitalizeString(categoryName)}
              location={`/podcasts/${convertToSlug(categoryName)}`}
              separateLink={false}
            />
          </div>

          <div className="relative flex w-full items-center group z-[1]">
            <SliderArrows
              sliderRef={sliderRef}
              scrollDistance={720}
              podcastPage={true}
            />
            <div
              className={`flex overflow-x-scroll scrollbar-hide scroll-smooth relative w-full justify-start px-5 lg:px-10`}
              ref={sliderRef}
            >
              {podcastData?.slice(0, 8).map((podcast: PodcastData) => (
                <Link
                  href={`/podcasts/${convertToSlug(
                    categoryName
                  )}/${convertToSlug(podcast.title)}`}
                  key={podcast.title}
                >
                  <div
                    className={`${
                      ninjaMode
                        ? "bg-gradient-to-b from-[#212121] to-[#111111] hover:from-[#202020] hover:to-[#282828] "
                        : "bg-gradient-to-b from-[#2a2a2a] to-[#181818] hover:from-[#202020] hover:to-[#343434]"
                    } hover:cursor-pointer flex flex-col items-center lg:min-w-[220px] h-[300px] rounded-lg mx-3 `}
                    key={podcast.title}
                  >
                    <Image
                      src={podcast.imageUrl}
                      alt={podcast.title}
                      width={190}
                      height={190}
                      loading="lazy"
                      className="rounded-xl mt-4 shadow-lg shadow-black base:w-[90px] xs:w-[110px] sm:w-[170px] "
                    />

                    <div className="group">
                      <h1 className=" whitespace-nowrap text-[10px] sm:text-sm lg:text-sm xl:text-lg text-start mt-3 font-normal lg:font-semibold text-[#dadada] group-hover:text-white whitespace-wrap">
                        {!isBreakPoint
                          ? truncateString(podcast.title, 14)
                          : truncateString(podcast.title, 14)}
                      </h1>
                      <p className="whitespace-nowrap base:text-[8px] xs:text-xs sm:text-sm lg:text-md text-start font-medium text-[#909090]">
                        {!isBreakPoint
                          ? truncateString(podcast.publisher, 14)
                          : truncateString(podcast.publisher, 14)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryList;
