import Image from "next/image";
import { PodcastData } from "../../utils/types";
import { RefObject, useState } from "react";
import Link from "next/link";
import { Button } from "@chakra-ui/react";
import { BsPlayCircle, BsShareFill } from "react-icons/bs";
import {
  capitalizeString,
  convertToSlug,
  truncateString,
} from "../../utils/functions";
import { FaEllipsisV } from "react-icons/fa";
import { useCopyToClipboard, useMediaQuery } from "../../utils/hooks";
import { useRouter } from "next/router";

interface PodcastHeroProps {
  imageSrc: string;
  podcastData: PodcastData;
  bannerBreakpointRef: RefObject<HTMLDivElement>;
  category: string;
  handleDrawer: (sponsor: string, isSponsorOfferDrawer: boolean) => void;
}

const PodcastHero = ({
  imageSrc,
  podcastData,
  bannerBreakpointRef,
  category,

  handleDrawer,
}: PodcastHeroProps) => {
  const router = useRouter();
  const spotifyGreen = "1DB954";
  const backgroundColor = podcastData?.backgroundColor;
  const [truncated, setTruncated] = useState(true);
  const isBreakPoint = useMediaQuery(1023);
  const xsBreakPoint = useMediaQuery(390);
  const buttonFontSize = xsBreakPoint ? "xs" : "sm";

  const gradientStyle = {
    backgroundImage: `linear-gradient(to bottom, ${backgroundColor}, #000000)`,
  };

  const { handleCopy } = useCopyToClipboard();
  const copyToClipboard = () => {
    handleCopy(window.location.href);
  };

  return (
    <div
      className={`items-center w-full h-full flex justify-center `}
      style={gradientStyle}
    >
      <div className="flex flex-col justify-center items-center w-full relative pt-[60px] sm:pt-[100px] lg:mt-12">
        <div className="absolute bottom-0 w-full h-10 bg-gradient-to-b from-black to-"></div>
        <Image
          src={imageSrc}
          alt={podcastData.title}
          width={250}
          height={250}
          priority
          className={`z-10 rounded-lg lg:mt-[72px] mt-14 lg:mb-4 relative base:w-[180px] xs:w-[220px] sm:w-[250px] shadow-2xl shadow-black`}
        />
        <div className="relative w-full my-10 bg-gradient-to-b from-[#00000000] via-black to-black">
          <div className="hidden lg:block absolute w-full h-10 top-10 bg-black"></div>
          <h1
            ref={bannerBreakpointRef}
            className="text-center base:text-lg xs:text-xl sm:text-3xl font-bold lg:font-extrabold px-4 "
          >
            {podcastData?.title}
          </h1>
          <h3 className="z-10 relative text-center base:text-sm font-medium xs:text-base mb-4 text-[#aaaaaa] px-4 mt-2">
            {podcastData?.publisher}{" "}
          </h3>
          {isBreakPoint || (
            <div className="w-full flex items-center justify-between pb-4 bg-black">
              <div className="flex items-center px-6 gap-3 ">
                <Button
                  onClick={() =>
                    router.push(`/podcasts/${convertToSlug(category)}`)
                  }
                  className="active:scale-95 transition-all duration-300 ease-in-out"
                  fontSize={"sm"}
                >
                  {capitalizeString(
                    category.split("-").join(" ").toLowerCase()
                  )}
                </Button>
                <Button
                  onClick={() => copyToClipboard()}
                  className="active:scale-95 transition-all duration-300 ease-in-out flex gap-[10px]"
                  fontSize={"sm"}
                >
                  <BsShareFill size={14} />
                  Share
                </Button>
              </div>
              <Link
                href={podcastData?.externalUrl}
                target="_blank"
                className="flex w-fit justify-start items-center p-4 mr-14"
              >
                <BsPlayCircle color={spotifyGreen} className="fill-[#1DB954]" />
                <h3 className="text-xs text-[#aaaaaa] hover:text-white font-semibold px-2">
                  Listen on Spotify
                </h3>
              </Link>
            </div>
          )}
          {isBreakPoint && (
            <div className="px-6 flex items-center justify-between gap-4 bg-black">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() =>
                    router.push(`/podcasts/${convertToSlug(category)}`)
                  }
                  className="z-[10] active:scale-95 transition-all duration-300 ease-in-out"
                  fontSize={buttonFontSize}
                >
                  {capitalizeString(
                    category.split("-").join(" ").toLowerCase()
                  )}
                </Button>

                <Button
                  minW={"fit-content"}
                  onClick={() => copyToClipboard()}
                  className="z-[10] active:scale-95 transition-all duration-300 ease-in-out"
                >
                  <BsShareFill size={15} />
                  <p className="ml-3 text-xs xs:text-sm">Share</p>
                </Button>
              </div>
              <div
                className="flex w-fit items-center justify-end py-6 relative z-[20] gap-2"
                onClick={() => handleDrawer("", false)}
              >
                <button className="flex items-center justify-center bg-[#151515] rounded-full p-3">
                  <FaEllipsisV color={"#888"} size={14} />
                </button>
              </div>
            </div>
          )}
          {isBreakPoint || (
            <div className="w-full h-[80px] overflow-y-auto relative z-10">
              <p className="py-2 ml-6 text-[#aaaaaa] mb-4 px-4">
                {truncated
                  ? truncateString(podcastData?.description, 280)
                  : podcastData?.description}
                <span className="mx-4 font-bold text-xs">
                  {
                    <button
                      onClick={() => setTruncated((prev) => !prev)}
                      className="hover:text-white active:scale-95 relative z-[20]"
                    >
                      {podcastData.description.length > 280 && truncated
                        ? "Read More"
                        : podcastData.description.length > 280 && !truncated
                        ? "Collapse"
                        : ""}
                    </button>
                  }
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PodcastHero;
