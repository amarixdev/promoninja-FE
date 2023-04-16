import {
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
  sponsorDrawer: boolean;
  hideLink?: boolean;
  podcastButton?: boolean;
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
  hideLink,
  podcastPage,
  externalUrl,
}: Props) => {
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
          <DrawerHeader></DrawerHeader>
          <DrawerBody>
            <div className="w-full">
              <div className="base:p-2 xs:p-4 flex w-full">
                <Image
                  src={drawer.image}
                  width={80}
                  height={80}
                  alt=""
                  priority
                  className="h-[80px]"
                />

                <div className="base:px-3 xs:px-4">
                  <h1 className="base:text-lg xs:text-xl font-bold hover:underline">
                    <Link href={convertToFullURL(drawer.url)} target="_blank">
                      {drawer.title}
                    </Link>
                  </h1>
                  <h3 className="base:text-xs xs:text-sm font-bold text-[#aaaaaa]">
                    {drawer.subtitle}
                  </h3>
                </div>
              </div>
              <div>
                {sponsorDrawer || (
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
                <div className="p-6 text-white h-[40vh] flex flex-col items-center">
                  <h1>{drawer.description}</h1>
                  {hideLink || !sponsorDrawer || (
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
                        className={`text-lg active:scale-95 underline underline-offset-2 mt-5 p-4 rounded-md bg-[#242424] ${
                          podcastPage ? "border-2" : "border-[3px]"
                        } `}
                        style={{ borderColor: drawer.color }}
                      >
                        <p className="font-bold" style={{}}>
                          {drawer.url}
                        </p>
                      </Link>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {hideLink && (
                    <div className="w-full flex justify-center items-center">
                      <Link href={`/${drawer.title}`}>
                        <button className="base:w-[125px] rounded-full border-[1px] active:scale-95 text-sm font-semibold text-[#aaaaaa] border-[#aaaaaa] p-2">
                          Visit Page
                        </button>
                      </Link>
                    </div>
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
