import Image from "next/image";
import Link from "next/link";
import { NavContext } from "../context/navContext";
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
}

const CategoryList = ({ category }: CategoryProps) => {
  const categoryName = Object.keys(category)[0];
  const podcastData = category[categoryName];
  const isBreakPoint = useMediaQuery(1023);
  const { setPreviousPage, setCategoryType } = NavContext();

  const handlePreviousPage = () => {
    setCategoryType(null);
    setPreviousPage("podcasts");
  };
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
      <div className={`flex justify-between items-center lg:my-4 pl-4`}>
        <AnimatedLink
          title={capitalizeString(categoryName)}
          location={convertToSlug(categoryName)}
          separateLink={false}
        />
      </div>

      <div className="relative flex w-full items-center group z-[1]">
        <SliderArrows sliderRef={sliderRef} scrollDistance={720} />
        <div
          className={`flex overflow-x-scroll scrollbar-hide scroll-smooth relative w-full justify-start lg:px-10`}
          ref={sliderRef}
        >
          {podcastData?.slice(0, 8).map((podcast: PodcastData) => (
            <Link
              href={`/podcasts/${convertToSlug(categoryName)}/${convertToSlug(
                podcast.title
              )}`}
              key={podcast.title}
            >
              <div
                className={
                  !isBreakPoint
                    ? `bg-gradient-to-b from-[#2a2a2a] to-[#181818] hover:from-[#202020] hover:to-[#343434] hover:cursor-pointer flex flex-col items-center lg:min-w-[220px] h-[300px] rounded-lg mx-3 `
                    : " hover:cursor-pointer flex flex-col items-center min-w-[120px] md:min-w-[140px] h-fit ml-2 rounded-lg overflow-y-visible sm:mx-5 "
                }
                key={podcast.title}
              >
                <Image
                  src={podcast.imageUrl}
                  alt={podcast.title}
                  width={190}
                  height={190}
                  loading="lazy"
                  className="rounded-xl mt-4 shadow-lg shadow-black base:w-[90px] xs:w-[110px] sm:w-[170px] "
                  onClick={handlePreviousPage}
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
    </div>
  );
};

export default CategoryList;
