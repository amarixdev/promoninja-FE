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
};

interface DrawerData {
  name: string;
  url: string;
  image: string;
  description: string;
  publisher: string;
}

const DescriptionDrawer = ({
  isOpen,
  onClose,
  drawer,
  sponsorDrawer,
}: Props) => {
  console.log(drawer);
  const isBreakPoint = useMediaQuery(1023);
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
                  href={convertToFullURL(drawer.url)}
                  target="_blank"
                  className="w-full flex justify-center items-center"
                >
                  {sponsorDrawer && (
                    <button className=" base:w-[125px] rounded-full border-[1px] text-sm font-semibold text-[#aaaaaa] border-[#aaaaaa] p-2">
                      Visit Site
                    </button>
                  )}
                </Link>
              </div>
            </div>
          </DrawerBody>
          <div
            className={
              "w-full flex items-center justify-center bottom-20 relative font-semibold text-xl"
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
