import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Tooltip,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { BsPlayCircle } from "react-icons/bs";
import { convertToFullURL, convertToSlug } from "../../utils/functions";
import {
  addOpacityToRGB,
  useMediaQuery,
  useReportIssue,
} from "../../utils/hooks";
import BrokenLinkModal from "../community-input/BrokenLinkModal";
import PromoCodeButton from "./PromoCodeButton";
import fallbackImage from "../../public/assets/fallback.png";
import { GoReport } from "react-icons/go";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  drawer: DrawerData;
  sponsorDrawer?: boolean;
  podcastDrawer?: boolean;
  sponsorOfferDrawer?: boolean;
  podcastOfferDrawer?: boolean;
  currentPodcast?: string;
  podcastPage?: boolean;
  externalUrl?: string;
}

interface DrawerData {
  title: string;
  subtitle: string;
  url: string;
  image: string;
  description: string;
  color?: string;
  promoCode?: string;
  category: string;
}

const DescriptionDrawer = ({
  isOpen,
  onClose,
  drawer,
  sponsorDrawer,
  podcastDrawer,
  sponsorOfferDrawer,
  podcastOfferDrawer,
  externalUrl,
}: Props) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to bottom, ${addOpacityToRGB(
      drawer?.color,
      0.9
    )}, ${addOpacityToRGB(drawer?.color, 0.35)}, #22222200)`,
  };

  const defaultStyle = {
    backgroundImage: `linear-gradient(to bottom, ${"#5555556f"}, #000000)`,
  };
  const podcastStyle = {
    backgroundImage: `linear-gradient(to bottom, #11111100, #0000006f, #0000009f)`,
  };
  const isBreakPoint = useMediaQuery(1023);
  const {
    handleBrokenLink,
    isOpenBrokenLink,
    onCloseBrokenLink,
    notified,
    podcastState,
    setPodcastState,
  } = useReportIssue(drawer.title);

  return (
    <>
      <BrokenLinkModal
        isOpen={isOpenBrokenLink}
        onClose={onCloseBrokenLink}
        selected={drawer.title}
        podcastState={podcastState}
        setPodcastState={setPodcastState}
        notified={notified}
      />
      <Drawer
        onClose={onClose}
        isOpen={isOpen}
        size={isBreakPoint ? "xl" : "xs"}
        placement={"bottom"}
      >
        <DrawerOverlay bgColor={"rgb(0,0,0,0.65)"} />
        <DrawerContent
          backgroundColor={"transparent"}
          className={"backdrop-blur-md z-[90]"}
        >
          {isBreakPoint ? (
            <DrawerBody>
              <div
                className="w-full flex flex-col items-center justify-center"
                style={
                  podcastOfferDrawer
                    ? podcastStyle
                    : sponsorOfferDrawer
                    ? defaultStyle
                    : {}
                }
              >
                {
                  <div
                    className="absolute min-h-[360px] top-0 w-[88%]"
                    style={gradientStyle}
                  ></div>
                }
                {(podcastOfferDrawer || sponsorOfferDrawer) && (
                  <div className="w-full relative z-50 flex justify-end items-center">
                    <p
                      className="text-xs px-4 py-3 font-bold"
                      onClick={() => handleBrokenLink(drawer.title)}
                    >
                      <GoReport
                        size={17}
                        color={`${sponsorOfferDrawer ? "#aaaaaa" : "white"}`}
                      />
                    </p>
                  </div>
                )}
                <div
                  className={`${
                    (podcastOfferDrawer || sponsorOfferDrawer) && "bottom-8 "
                  } flex items-center w-full relative`}
                >
                  <div>
                    <Link
                      className="p-6 flex w-full"
                      href={`/${
                        podcastDrawer || podcastOfferDrawer
                          ? `podcasts/${convertToSlug(
                              drawer.category
                            )}/${convertToSlug(drawer.title)}`
                          : sponsorDrawer || sponsorOfferDrawer
                          ? `${convertToSlug(drawer.title)}`
                          : ""
                      }`}
                    >
                      <Image
                        src={drawer.image || fallbackImage}
                        width={100}
                        height={100}
                        alt={drawer.title}
                        priority
                        loading={"eager"}
                        className={`min-h-[100px] rounded-lg  min-w-[100px] ${"shadow-2xl shadow-black"} `}
                      />
                    </Link>
                  </div>

                  <div className="pr-2">
                    <h1 className="base:text-base xs:text-lg font-extrabold">
                      {drawer.title}
                    </h1>
                    <h3 className="base:text-xs xs:text-sm font-semibold text-[#d5d5d5]">
                      {drawer.subtitle}
                    </h3>
                  </div>
                </div>
                <div>
                  {podcastDrawer && (
                    <Link
                      href={externalUrl || "/"}
                      target="_blank"
                      className="flex w-full justify-start items-center p-4 relative z-50 max-w-fit"
                    >
                      <BsPlayCircle color="#1DB954" />
                      <p className="text-xs font-semibold px-2 hover:cursor-pointer">
                        Listen on Spotify
                      </p>
                    </Link>
                  )}
                  <div className="px-4 text-white h-[60vh] flex flex-col items-center">
                    {(podcastDrawer || sponsorDrawer) && (
                      <div className="h-[50%]">
                        <p className="text-white font-bold text-xl pb-2">
                          {podcastDrawer ? "About" : "Description"}
                        </p>
                        <div className="p-y tracking-wide h-full overflow-y-scroll">
                          <p className=" p-4 text-xs xs:text-sm mt-2 ">
                            {" "}
                            {drawer.description}
                          </p>
                        </div>
                      </div>
                    )}
                    {(sponsorOfferDrawer || podcastOfferDrawer) && (
                      <>
                        <div
                          className={`w-full justify-center items-center bottom-4 relative flex flex-col gap-1`}
                        >
                          <h1 className="text-lg xs:text-2xl sm:text-3xl md:text-4xl font-extrabold">
                            Exclusive Offer:
                          </h1>
                          <h1
                            className={`text-center relative font-base px-2 text-base xs:text-lg sm:text-xl md:text-3xl ${
                              sponsorOfferDrawer
                                ? "text-[#aaaaaa]"
                                : "text-white"
                            } overflow-y-auto`}
                          >
                            {drawer.description}
                          </h1>
                        </div>
                      </>
                    )}
                    {(podcastOfferDrawer || sponsorOfferDrawer) && (
                      <div className="flex flex-col items-center relative bottom-6">
                        <div className="mt-8 w-full flex flex-col items-center justify-center">
                          <h1 className="text-lg xs:text-2xl sm:text-3xl md:text-4xl font-extralight">
                            Visit{" "}
                          </h1>
                          <div className="w-full flex flex-col  mt-2 items-center justify-center">
                            <Link
                              href={convertToFullURL(drawer.url)}
                              target="_blank"
                              className={`text-lg active:scale-95`}
                            >
                              <Button>
                                <p className=" text-sm xs:text-base sm:text-base md:text-lg">
                                  {drawer.url}
                                </p>
                              </Button>
                            </Link>
                          </div>
                        </div>
                        {drawer.promoCode &&
                          (podcastOfferDrawer || sponsorOfferDrawer) && (
                            <>
                              <div className="border-t-[0.5px] w-full my-3"></div>
                              <div className="flex flex-col justify-center items-center p-2 px-10 rounded-md ">
                                <h2 className=" text-sm sm:text-base md:text-lg font-light my-2 tracking-wide">
                                  Use Code
                                </h2>
                                <PromoCodeButton
                                  promoCode={drawer.promoCode || ""}
                                />
                                <h2 className="text-sm sm:text-base md:text-lg font-light  my-2 tracking-wide">
                                  At Checkout
                                </h2>
                              </div>
                            </>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DrawerBody>
          ) : (
            <DrawerBody>
              <div
                className="w-full h-[40vh] overflow-y-hidden"
                style={podcastOfferDrawer ? gradientStyle : {}}
              >
                {isBreakPoint || (
                  <div
                    className={
                      " flex items-center justify-center pr-4 pt-4 pb-6"
                    }
                  >
                    {" "}
                    <Tooltip label="Click off to close" placement="top">
                      <div
                        className=" rounded-full  hover:cursor-pointer "
                        onClick={onClose}
                      >
                        {" "}
                        <div className="flex items-center gap-2 px-6 rounded-lg hover:bg-[#c3c3c358] transition duration-300 ease-in-out">
                          <p className="font-bold ">Cancel</p>
                        </div>
                      </div>
                    </Tooltip>
                  </div>
                )}
                <div className="px-8 w-full flex justify-between">
                  <div className="flex">
                    <Link
                      className="flex"
                      href={`/${
                        podcastDrawer || podcastOfferDrawer
                          ? `podcasts/${convertToSlug(
                              drawer.category
                            )}/${convertToSlug(drawer.title)}`
                          : sponsorDrawer || sponsorOfferDrawer
                          ? `${drawer.title}`
                          : ""
                      }`}
                    >
                      <Image
                        src={drawer.image || fallbackImage}
                        width={200}
                        height={200}
                        alt={drawer.title}
                        loading={"eager"}
                        priority
                        className={` min-w-[200px] relative bottom-0 hover:bottom-3 transition-all duration-500 ease-in-out ${
                          podcastOfferDrawer && "shadow-2xl shadow-black"
                        } `}
                      />
                    </Link>
                    <div className="px-6 flex flex-col">
                      <h1 className="text-4xl font-extrabold">
                        {drawer.title}
                      </h1>
                      <h3 className="text-xl font-semibold text-[white]">
                        {drawer.subtitle}
                      </h3>
                      <div className="flex items-center justify-between mt-6">
                        {podcastOfferDrawer && (
                          <div className="flex items-center">
                            <h1
                              style={{ color: "white" }}
                              className="text-2xl font-extrabold pr-4"
                            >
                              Visit:{" "}
                            </h1>
                            <Link
                              href={convertToFullURL(drawer.url)}
                              target="_blank"
                              className={`text-lg active:scale-95 hover:underline underline-offset-4 rounded-md`}
                            >
                              <p className="py-2 rounded-md font-light text-2xl">
                                {drawer.url}
                              </p>
                            </Link>
                            {drawer.promoCode && (
                              <div className="flex">
                                <div className="border-r border-[1px] ml-3 border-white"></div>

                                <div className="ml-4 flex items-center gap-4 font-bold text-lg">
                                  <p className="">Use Code</p>

                                  <PromoCodeButton
                                    promoCode={drawer.promoCode}
                                  />

                                  <p>At Checkout</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        {sponsorDrawer && (
                          <div className="w-full flex  items-center">
                            <h2 className="text-2xl font-light">
                              {drawer.description}{" "}
                            </h2>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {podcastOfferDrawer && (
                  <div>
                    <div className="w-full flex justify-center items-center gap-2">
                      <div className="rounded-full bg-[#0ec10e] w-2 h-2"></div>
                      <h2 className="text-xl font-semibold">
                        {drawer.description}{" "}
                      </h2>
                    </div>
                    <div className="w-full justify-end items-center flex pr-10  ">
                      <p
                        className="underline cursor-pointer text-xs font-bold active:scale-95"
                        onClick={() => handleBrokenLink(drawer.title)}
                      >
                        {" "}
                        Report Issue
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </DrawerBody>
          )}
          {isBreakPoint && (
            <div
              className="w-full p-6 z-10 absolute bottom-0 xs:bottom-5 flex items-center justify-center"
              onClick={onClose}
            >
              <Button
                colorScheme="transparent"
                color={"white"}
                className={
                  "flex flex-col items-center justify-center gap-6 relative font-semibold text-xl hover:cursor-pointer"
                }
              >
                <p className="sm:text-lg md:text-2xl">Cancel</p>
              </Button>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DescriptionDrawer;
