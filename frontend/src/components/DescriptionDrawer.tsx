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
import { useMediaQuery } from "../utils/hooks";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  drawer: DrawerData;
  sponsorDrawer: boolean;
  hideLink?: boolean;
  podcastButton?: boolean;
};

interface DrawerData {
  name: string;
  url: string;
  image: string;
  description: string;
  publisher: string;
  color?: string;
}

const DescriptionDrawer = ({
  isOpen,
  onClose,
  drawer,
  sponsorDrawer,
  hideLink,
  podcastButton,
}: Props) => {
  const isBreakPoint = useMediaQuery(1023);
  const backgroundColor = drawer?.color;
  const gradientStyle = {
    backgroundImage: `linear-gradient(to bottom, ${backgroundColor}, #000000)`,
  };

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
                      {drawer.name}
                    </Link>
                  </h1>
                  <h3 className="base:text-xs xs:text-sm font-bold text-[#aaaaaa]">
                    {sponsorDrawer ? drawer.url : drawer.publisher}
                  </h3>
                </div>
              </div>
              <div>
                {sponsorDrawer || (
                  <div className="flex w-full justify-start items-center p-4">
                    <BsPlayCircle color="#1DB954" />
                    <p className="text-xs font-semibold px-2">
                      Listen on Spotify
                    </p>
                  </div>
                )}
                <h1 className="p-6 text-white h-[40vh] overflow-scroll">
                  {drawer.description}
                </h1>
                <Link
                  href={convertToFullURL(!hideLink ? drawer.url : "")}
                  target="_blank"
                  className="w-full flex justify-center items-center"
                >
                  {sponsorDrawer && !hideLink && (
                    <div className="flex flex-col">
                      <button className=" base:w-[125px] rounded-full border-[1px] active:scale-95 text-sm font-semibold text-[#aaaaaa] border-[#aaaaaa] p-2">
                        Shop Now
                      </button>
                      {podcastButton && (
                        <button
                          className={` mt-4 base:w-[125px] rounded-full border-[1px] text-sm active:scale-95 font-bold text-white p-2`}
                          style={{ background: drawer.color }}
                        >
                          Podcast
                        </button>
                      )}
                    </div>
                  )}
                  {hideLink && (
                    <button className=" base:w-[125px] rounded-full border-[1px] active:scale-95 text-sm font-semibold text-[#aaaaaa] border-[#aaaaaa] p-2">
                      Visit Page
                    </button>
                  )}
                </Link>
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
