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
import { useMediaQuery } from "../utils/hooks";
import PromoCodeButton from "./PromoCodeButton";

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

  return (
    <div className="">
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
                    <h1 className="base:text-lg xs:text-xl font-extrabold hover:underline">
                      {drawer.title}
                    </h1>
                    <h3 className="base:text-xs xs:text-sm font-semibold text-[#c8c8c8]">
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
                        {drawer.description}
                      </h1>
                    )}
                    {(sponsorOfferDrawer || podcastOfferDrawer) && (
                      <div className="w-full flex items-center justify-center">
                        <h1 className="p-y text-center font-semibold text-xl text-[#d5d5d5] overflow-y-auto">
                          {drawer.description}
                        </h1>
                      </div>
                    )}
                    {(podcastOfferDrawer || sponsorOfferDrawer) && (
                      <>
                        <h1
                          style={{ color: "white" }}
                          className="text-3xl font-extrabold mt-10"
                        >
                          Visit{" "}
                        </h1>
                        <Link
                          href={convertToFullURL(drawer.url)}
                          target="_blank"
                          className={`text-lg active:scale-95 underline underline-offset-2 p-4 rounded-md`}
                        >
                          <Button className="font-bold">
                            <p className="text-sm">{drawer.url}</p>
                          </Button>
                        </Link>
                        {drawer.promoCode &&
                          (podcastOfferDrawer || sponsorOfferDrawer) && (
                            <div className="flex flex-col justify-center items-center">
                              <h2 className="text-base font-semibold my-2 tracking-wide">
                                Use Code
                              </h2>
                              <PromoCodeButton
                                promoCode={drawer.promoCode || ""}
                              />
                              <h2 className="text-base  font-semibold my-2 tracking-wide">
                                At Checkout
                              </h2>
                            </div>
                          )}
                        <p className="font-thin mt-10 text-lg">
                          "Thanks for supporting the show!"
                        </p>
                      </>
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
                        <div className="flex items-center gap-2">
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
                        className={` min-w-[200px] ${
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
                  <div className="w-full flex justify-center items-center gap-2">
                    <div className="rounded-full bg-[#0ec10e] w-2 h-2"></div>
                    <h2 className="text-xl font-semibold">
                      {drawer.description}{" "}
                    </h2>
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
                "flex items-center justify-center bottom-20 relative font-semibold text-xl hover:cursor-pointer"
              }
              onClick={onClose}
            >
              Cancel
            </Button>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default DescriptionDrawer;
