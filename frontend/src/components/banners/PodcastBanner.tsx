import Image from "next/image";
import { scrollToTop, truncateString } from "../../utils/functions";
import { useBanner, useMediaQuery } from "../../utils/hooks";
import { RefObject } from "react";
import { PodcastData } from "../../utils/types";

interface PodcastBannerProps {
  bannerBreakpointRef: RefObject<HTMLDivElement>;
  columnBreakpointRef: RefObject<HTMLDivElement>;
  imageSrc: string;
  podcastData: PodcastData;
}

const PodcastBanner = ({
  bannerBreakpointRef,
  columnBreakpointRef,
  imageSrc,
  podcastData,
}: PodcastBannerProps) => {
  const isBreakPoint = useMediaQuery(1023);
  const { banner } = useBanner(bannerBreakpointRef, 0);
  const { banner: columnText } = useBanner(
    columnBreakpointRef,
    isBreakPoint ? 125 : 130
  );

  console.log(columnText);
  return (
    <div
      onClick={() => scrollToTop()}
      className={`flex flex-col w-full bg-[black] top-[-5px] lg:top-0 backdrop-blur-md justify-center fixed transition-all duration-300 ${
        banner
          ? "opacity-100 z-50 cursor-pointer"
          : "opacity-0 z-0 cursor-default"
      } cursor-pointer`}
    >
      <div className="flex items-center p-3">
        <Image
          src={imageSrc}
          alt={podcastData.title}
          width={70}
          height={70}
          priority
          className={`min-w-70 lg:min-w-[60px] rounded-md p-2 relative lg:hover:cursor-pointer`}
        />
        <div className="flex flex-col justify-center px-2">
          <h1
            className={`font-bold lg:font-extrabold relative text-base xs:text-lg lg:text-3xl `}
          >
            {truncateString(podcastData.title, 20)}
          </h1>
          <div className="flex gap-2">
            <h3
              className={`font-semibold text-xs xs:text-sm lg:text-md text-[#aaaaaa] relative bottom-[500px`}
            >
              {podcastData.publisher}
            </h3>
          </div>
        </div>
      </div>
      <div
        className={` ${
          columnText ? "block" : "hidden"
        } px-4 flex bg-[#101010] lg:pl-8 border-b-[1px] border-[#42424274] items-center text-[#d7d7d7] `}
      >
        <div
          className={` flex justify-between relative lg:justify-start items-center w-full py-2  `}
        >
          <div className="flex items-center relative ">
            <p className="font-light text-xs sm:text-sm relative right-2 lg:right-0 px-4  tracking-widest">
              {`#`}
            </p>
            <p className="font-light text-xs sm:text-sm relative right-2 lg:right-0  tracking-widest">
              {`Sponsor`}
            </p>
          </div>
        </div>
        {isBreakPoint && (
          <p className="font-light text-xs sm:text-sm relative pr-2 tracking-widest">
            {`Offer`}
          </p>
        )}
      </div>
    </div>
  );
};

export default PodcastBanner;
