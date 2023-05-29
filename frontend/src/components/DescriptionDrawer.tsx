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
import { convertToFullURL, convertToSlug } from "../utils/functions";
import { useMediaQuery, useReportIssue } from "../utils/hooks";
import PromoCodeButton from "./PromoCodeButton";
import BrokenLinkModal from "./BrokenLinkModal";

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
  currentPodcast,
}: Props) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to bottom, ${drawer.color}, #000000)`,
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
    <div className="">
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
        size={isBreakPoint ? "full" : "xs"}
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
                style={podcastOfferDrawer ? gradientStyle : {}}
              >
                <div className="base:py-2 xs:py-4 flex items-center w-full">
                  <div>
                    <Link
                      className="base:p-2 xs:p-4 flex w-full"
                      href={`/${
                        podcastDrawer || podcastOfferDrawer
                          ? `podcasts/${drawer.category}/${convertToSlug(
                              drawer.title
                            )}`
                          : sponsorDrawer || sponsorOfferDrawer
                          ? `${convertToSlug(drawer.title)}`
                          : ""
                      }`}
                    >
                      <Image
                        src={drawer.image}
                        width={100}
                        height={100}
                        alt=""
                        priority
                        className={`min-h-[100px] min-w-[100px] ${
                          podcastOfferDrawer && "shadow-2xl shadow-black"
                        } `}
                      />
                    </Link>
                  </div>

                  <div className="base:px-3 xs:px-4">
                    <h1 className="base:text-lg xs:text-xl font-extrabold">
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
                      className="flex w-full justify-start items-center p-4"
                    >
                      <BsPlayCircle color="#1DB954" />
                      <p className="text-xs font-semibold px-2 hover:cursor-pointer">
                        Listen on Spotify
                      </p>
                    </Link>
                  )}
                  <div className="p-6 text-white h-[60vh] flex flex-col items-center">
                    {(podcastDrawer || sponsorDrawer) && (
                      <h1 className="p-y overflow-y-auto tracking-wide">
                        <p className="text-white font-bold text-xl pb-2">
                          {podcastDrawer ? "About" : "Description"}
                        </p>
                        <p className="text-xs xs:text-sm">
                          {" "}
                          {drawer.description}
                        </p>
                      </h1>
                    )}
                    {(sponsorOfferDrawer || podcastOfferDrawer) && (
                      <>
                        <div className="w-full flex items-center justify-center">
                          <h1 className="p-y text-center font-extralight text-lg sm:text-2xl md:text-3xl text-[#d5d5d5] overflow-y-auto">
                            {drawer.description}
                          </h1>
                        </div>
                      </>
                    )}
                    {(podcastOfferDrawer || sponsorOfferDrawer) && (
                      <div className="flex flex-col items-center">
                        <>
                          <h1
                            style={{ color: "white" }}
                            className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-6"
                          >
                            Visit{" "}
                          </h1>
                          <Link
                            href={convertToFullURL(drawer.url)}
                            target="_blank"
                            className={`text-lg active:scale-95 underline underline-offset-2 p-4 rounded-md`}
                          >
                            <Button className="font-bold">
                              <p className="text-sm sm:text-base md:text-lg">
                                {drawer.url}
                              </p>
                            </Button>
                          </Link>
                          {!drawer.promoCode &&
                            (podcastOfferDrawer || sponsorOfferDrawer) && (
                              <div className="w-full justify-center items-center mt-10 flex">
                                <p
                                  className="underline cursor-pointer text-xs font-bold active:scale-95 text-[#bebebe]"
                                  onClick={() => handleBrokenLink(drawer.title)}
                                >
                                  {" "}
                                  Report Issue
                                </p>
                              </div>
                            )}
                        </>
                        {drawer.promoCode &&
                          (podcastOfferDrawer || sponsorOfferDrawer) && (
                            <>
                              <div className="border-t-[1px] w-full mb-3"></div>
                              <div className="flex flex-col justify-center items-center p-2 px-10 rounded-md bg-[#b7b7b71e]">
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
                              <div className="w-full justify-center items-center mt-4 flex">
                                <p
                                  className="underline cursor-pointer text-xs font-bold active:scale-95 text-[#aaaaaa]"
                                  onClick={() => handleBrokenLink(drawer.title)}
                                >
                                  {" "}
                                  Report Issue
                                </p>
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
                          <p className="font-bold">Cancel</p>
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
                          ? `podcasts/${drawer.category}/${convertToSlug(
                              drawer.title
                            )}`
                          : sponsorDrawer || sponsorOfferDrawer
                          ? `${drawer.title}`
                          : ""
                      }`}
                    >
                      <Image
                        src={drawer.image}
                        width={200}
                        height={200}
                        alt=""
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
            <Button
              colorScheme="transparent"
              color={"white"}
              className={
                "flex flex-col items-center justify-center bottom-20 gap-6 relative font-semibold text-xl hover:cursor-pointer"
              }
              onClick={onClose}
            >
              <p className="sm:text-lg md:text-2xl">Cancel</p>
            </Button>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default DescriptionDrawer;
