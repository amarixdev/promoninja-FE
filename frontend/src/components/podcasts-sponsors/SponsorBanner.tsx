import Image from "next/image";
import React, { RefObject } from "react";
import { scrollToTop, truncateString } from "../../utils/functions";
import { SponsorData } from "../../utils/types";
import { useBanner, useMediaQuery } from "../../utils/hooks";
import fallbackImage from "../../public/assets/fallback.png";

interface SponsorBannerProps {
  sponsorData: SponsorData;
  bannerBreakpointRef: RefObject<HTMLDivElement>;
}

const SponsorBanner = ({
  sponsorData,
  bannerBreakpointRef,
}: SponsorBannerProps) => {
  const { banner } = useBanner(bannerBreakpointRef, 0, "sponsor");
  const isBreakPoint = useMediaQuery(1023);
  return (
    <div
      onClick={() => scrollToTop()}
      className={`flex w-full 
     bg-[#00000073]
     backdrop-blur-md p-3 items-center relative transition-all duration-300 cursor-pointer ${
       banner ? "bottom-0" : "bottom-[500px]"
     } `}
    >
      <Image
        src={sponsorData.imageUrl || fallbackImage}
        alt={sponsorData.name}
        width={70}
        height={70}
        priority
        className={`min-w-[70px] min-h-[70px]  rounded-md p-2 relative`}
      />
      <div className="flex flex-col justify-center px-2">
        <h1
          className={`font-bold text-white lg:font-extrabold relative text-base xs:text-lg lg:text-3xl `}
        >
          {isBreakPoint
            ? truncateString(sponsorData.name, 20)
            : sponsorData.name}
        </h1>
        <div className="flex gap-2">
          <h3
            className={`font-semibold pb-1 text-xs xs:text-sm lg:text-md text-[#aaaaaa] relative `}
          >
            {sponsorData.offer}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default SponsorBanner;
