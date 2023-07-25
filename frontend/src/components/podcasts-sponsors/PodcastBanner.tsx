import Image from "next/image";
import { scrollToTop, truncateString } from "../../utils/functions";
import { useBanner, useMediaQuery } from "../../utils/hooks";
import { RefObject } from "react";
import { PodcastData } from "../../utils/types";

interface PodcastBannerProps {
  bannerBreakpointRef: RefObject<HTMLDivElement>;
  imageSrc: string;
  podcastData: PodcastData;
}

const PodcastBanner = ({
  bannerBreakpointRef,
  imageSrc,
  podcastData,
}: PodcastBannerProps) => {
  const { banner } = useBanner(bannerBreakpointRef, 0);

  return (
    <div
      onClick={() => scrollToTop()}
      className={`flex w-full bg-[#00000073] p-3 top-[-5px] lg:top-0 backdrop-blur-md items-center fixed transition-all duration-300 ${
        banner
          ? "opacity-100 z-50 cursor-pointer"
          : "opacity-0 z-0 cursor-default"
      } cursor-pointer`}
    >
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
  );
};

export default PodcastBanner;
