import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Tooltip
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { BsPlayCircle } from "react-icons/bs";
import { convertToFullURL } from "../utils/functions";
import { useMediaQuery } from "../utils/hooks";

type Props = {
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
};

interface DrawerData {
  title: string;
  subtitle: string;
  url: string;
  image: string;
  description: string;
  color?: string;
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
          className={"backdrop-blur-sm z-[90]"}
        >
          {isBreakPoint ? (
            <DrawerBody>
              <div
                className="w-full flex flex-col items-center justify-center"
                style={podcastOfferDrawer ? gradientStyle : {}}
              >
                <div className="base:p-2 xs:p-4 flex items-center">
                  <div>
                    <Link
                      className="base:p-2 xs:p-4 flex w-full"
                      href={`/${
                        podcastDrawer || podcastOfferDrawer
                          ? `podcasts/category/${drawer.title}`
                          : sponsorDrawer || sponsorOfferDrawer
                          ? `${drawer.title}`
                          : ""
                      }`}
                    >
                      <Image
                        src={drawer.image}
                        width={80}
                        height={80}
                        alt=""
                        priority
                        className={`min-h-[80px] min-w-[80px] ${
                          podcastOfferDrawer && "shadow-2xl shadow-black"
                        } `}
                      />
                    </Link>
                  </div>

                  <div className="base:px-3 xs:px-4">
                    <h1 className="base:text-lg xs:text-xl font-bold hover:underline">
                      {drawer.title}
                    </h1>
                    <h3 className="base:text-xs xs:text-sm font-semibold text-[#b3b3b3]">
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
                  <div className="p-6 first-letter: text-white h-[60vh] flex flex-col items-center">
                    {(podcastDrawer || sponsorDrawer) && (
                      <h1 className="p-y overflow-y-auto tracking-wide">
                        <p className="text-white font-bold text-xl pb-2">
                          {podcastDrawer ? "About" : "Description"}
                        </p>
                        {drawer.description}
                      </h1>
                    )}
                    {(sponsorOfferDrawer || podcastOfferDrawer) && (
                      <h1 className="p-y text-xl font-extralight overflow-y-auto">
                        {drawer.description}
                      </h1>
                    )}

                    {(podcastOfferDrawer || sponsorOfferDrawer) && (
                      <>
                        <h1
                          style={{ color: "white" }}
                          className="text-3xl font-extrabold mt-4"
                        >
                          Visit{" "}
                        </h1>
                        <Link
                          href={convertToFullURL(drawer.url)}
                          target="_blank"
                          className={`text-lg active:scale-95 underline underline-offset-2 mt-5 p-4 rounded-md`}
                        >
                          <Button className="font-bold">
                            <p className="text-sm">{drawer.url}</p>
                          </Button>
                        </Link>
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
                          ? `podcasts/category/${drawer.title}`
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
                    <h2 className="text-xl font-light">
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
