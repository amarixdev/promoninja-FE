import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { convertToFullURL, truncateString } from "../utils/functions";
import { BsPlayCircle } from "react-icons/bs";

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

  console.log(currentPodcast);

  return (
    <>
      <Drawer
        onClose={onClose}
        isOpen={isOpen}
        size={"full"}
        placement={"bottom"}
      >
        <DrawerOverlay bgColor={"rgb(0,0,0,0.65)"} />
        <DrawerContent
          backgroundColor={"transparent"}
          className={"backdrop-blur-sm"}
        >
          <DrawerBody>
            <div
              className="w-full"
              style={podcastOfferDrawer ? gradientStyle : {}}
            >
              <div className="base:p-2 xs:p-4 flex items-center">
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
                    className={`h-[80px] w-[80px] ${
                      podcastOfferDrawer && "shadow-2xl shadow-black"
                    } `}
                  />
                  <div className="base:px-3 xs:px-4">
                    <h1 className="base:text-lg xs:text-xl font-bold hover:underline">
                      {drawer.title}
                    </h1>
                    <h3 className="base:text-xs xs:text-sm font-semibold text-[#b3b3b3]">
                      {drawer.subtitle}
                    </h3>
                  </div>
                </Link>
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
                    <h1 className="p-y overflow-y-auto">
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
                        <Button className="font-bold">{drawer.url}</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </DrawerBody>
          <div
            className={
              "w-full flex items-center justify-center bottom-20 relative font-semibold text-xl hover:cursor-pointer"
            }
            onClick={onClose}
          >
            Cancel
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DescriptionDrawer;
