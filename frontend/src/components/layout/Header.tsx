import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { GiNinjaHead } from "react-icons/gi";
import { RxHamburgerMenu } from "react-icons/rx";
import { NavContext } from "../../context/navContext";
import { scrollToTop } from "../../utils/functions";
import { useMediaQuery } from "../../utils/hooks";

import { AiOutlineClose } from "react-icons/ai";
import { RiExternalLinkLine } from "react-icons/ri";
import Link from "next/link";
import { useState } from "react";

export const OptionsDrawer = ({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) => {
  const { ninjaMode, setNinjaMode } = NavContext();
  return (
    <>
      <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent className={"backdrop-blur-md z-[90]"}>
          <DrawerBody
            backgroundColor={"#151515"}
            bgGradient={
              ninjaMode
                ? "linear(to-b, #151515, black)"
                : "linear(to-b, #222222, #121212)"
            }
            shadow={"dark-lg"}
          >
            <div className="flex flex-col">
              <div className="flex justify-between items-center border-b-[1px] pb-2">
                <h1 className="font-bold text-xl pt-4 pb-2 text-[#e3e3e3e9]">
                  Menu
                </h1>
                <AiOutlineClose
                  size={25}
                  color="#e3e3e3"
                  onClick={() => onClose()}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center mt-10 gap-4">
                <div className="flex gap-4 items-center">
                  <GiNinjaHead size={25} color="#e3e3e3e9" />
                  <p className="text-2xl font-semibold text-[#e3e3e3e9]">
                    {" "}
                    Ninja Mode:{" "}
                  </p>
                </div>

                <Button
                  className=" text-white text-xl font-bold"
                  onClick={() => setNinjaMode((prev) => !prev)}
                >
                  {ninjaMode ? "ON" : "OFF"}
                </Button>
              </div>
              <div className="mt-10 flex flex-col gap-4">
                <Link href={"/about"} className="flex gap-4 items-center">
                  <RiExternalLinkLine size={25} color="#e3e3e3e9" />
                  <p className="font-semibold text-[#e3e3e3e9] text-2xl ">
                    About
                  </p>
                </Link>
                <Link href={"/support"} className="flex gap-4 items-center">
                  <RiExternalLinkLine size={25} color="#e3e3e3e9" />
                  <p className="font-semibold text-[#e3e3e3e9] text-2xl">
                    Support
                  </p>
                </Link>
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

interface HeaderProps {
  page: string;
}

const Header = ({ page }: HeaderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setNinjaMode, ninjaMode } = NavContext();
  const isBreakPoint = useMediaQuery(1023);

  const [tapEffect, setTapEffect] = useState(false);

  const handleTap = () => {
    setTapEffect(true);
    setTimeout(() => {
      setTapEffect(false);
    }, 200);
  };

  return (
    <div className="flex items-center justify-between w-full relative ">
      <OptionsDrawer isOpen={isOpen} onClose={onClose} />
      <div
        className={
          "fixed min-h-[95px] bg-[#121212] overflow-hidden top-[-10px] lg:top-0 p-8 py-6 w-full z-[200] flex justify-between items-center "
        }
      >
        {isBreakPoint && (
          <div>
            <div
              className="p-6 absolute top-5 sm:top-4 left-2"
              onClick={() => onOpen()}
            >
              {" "}
              <RxHamburgerMenu size={20} />
            </div>
          </div>
        )}
        <h1
          onClick={() => scrollToTop()}
          className={` relative top-1 text-3xl sm:text-5xl font-bold text-white `}
        >
          {page}
        </h1>

        {
          <div className="">
            {isBreakPoint ? (
              <button
                onClick={() => {
                  handleTap();
                  setNinjaMode((prev) => !prev);
                }}
                className="min-w-[120px] absolute top-3 right-0 min-h-[80px] flex items-center justify-center"
              >
                <div
                  className={` ${
                    tapEffect
                      ? "bg-[#84848487] scale-90"
                      : "bg-[#8484848700] scale-100"
                  } text-3xl rounded-full relative p-3 sm:p-4 sm:text-5xl font-bold hover:cursor-pointer transition-all duration-200 ease-in-out  text-white `}
                >
                  <GiNinjaHead
                    className={`${
                      tapEffect ? "scale-95" : "scale-100"
                    } transition-transform duration-200 ease-in-out`}
                  />
                </div>
              </button>
            ) : (
              <Tooltip
                label="Toggle Ninja Mode"
                placement="bottom"
                openDelay={750}
              >
                <button
                  className={`text-3xl sm:text-5xl font-bold lg:right-[300px] relative hover:cursor-pointer transition-all duration-150 ease-in-out active:scale-95 text-white `}
                  onClick={() => setNinjaMode((prev) => !prev)}
                >
                  <GiNinjaHead />
                </button>
              </Tooltip>
            )}
          </div>
        }
      </div>
    </div>
  );
};

export default Header;
