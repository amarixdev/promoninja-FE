import Image from "next/image";
import React, { RefObject } from "react";
import { scrollToTop, truncateString } from "../../utils/functions";
import { SponsorData } from "../../utils/types";
import { useBanner, useMediaQuery } from "../../utils/hooks";
import fallbackImage from "../../public/assets/fallback.png";
import { NavContext } from "../../context/navContext";

interface SponsorBannerProps {
  sponsorData: SponsorData;
  bannerBreakpointRef: RefObject<HTMLDivElement>;
  columnBreakpointRef: RefObject<HTMLDivElement>;
}

const SponsorBanner = ({
  sponsorData,
  bannerBreakpointRef,
  columnBreakpointRef,
}: SponsorBannerProps) => {
  const isBreakPoint = useMediaQuery(1023);
  const { banner } = useBanner(bannerBreakpointRef, 0, "sponsor");
  const { banner: columnText } = useBanner(
    columnBreakpointRef,
    isBreakPoint ? 113 : 130
  );

  const { ninjaMode } = NavContext();

  return (
    <div
      onClick={() => scrollToTop()}
      className={`flex flex-col w-full ${
        ninjaMode || isBreakPoint ? "bg-[#0c0c0c]" : "bg-[#151515]"
      } 

     backdrop-blur-md  justify-center fixed top-[-5px] lg:top-0 transition-all duration-300 ${
       banner
         ? "opacity-100 z-50 cursor-pointer"
         : "opacity-0 z-0 cursor-default"
     } `}
    >
      <div className="flex items-center p-3">
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
      {
        <div
          className={` ${
            columnText ? "block" : "hidden"
          } flex flex-col justify-evenly w-full ${
            ninjaMode || isBreakPoint ? "bg-[#151515]" : "bg-[#262626]"
          }   text-[#aaaaaa] `}
        >
          <div className="flex justify-between w-full relative py-2  pl-6  lg:pl-8 lg:pb-2 ">
            <div className="flex relative right-4 lg:right-0">
              <h3 className="font-light text-xs sm:text-sm relative pl-4 lg:px-4 tracking-widest">
                {`#`}
              </h3>

              <h3 className="font-light text-xs sm:text-sm relative px-4 tracking-widest">
                {`Podcast`}
              </h3>
            </div>
            {isBreakPoint && (
              <h3 className="font-light text-xs sm:text-sm relative xs:pr-8 base:pr-4 tracking-widest">
                {`Link`}
              </h3>
            )}
          </div>
          <div className="w-full border-b-[1px] border-[#42424274] "></div>
        </div>
      }
    </div>
  );
};

export default SponsorBanner;
