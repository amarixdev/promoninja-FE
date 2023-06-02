import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { BiChevronDown } from "react-icons/bi";
import { FaUserNinja } from "react-icons/fa";
import { MdOutlinePodcasts, MdPodcasts } from "react-icons/md";
import {
  RiExternalLinkLine,
  RiHome6Fill,
  RiHome6Line,
  RiSearch2Fill,
  RiSearch2Line,
} from "react-icons/ri";
import { NavContext } from "../context/navContext";
import * as LogoText from "../public/assets/logo-text.png";
import * as Ninja4 from "../public/assets/logo.png";
import { scrollToTop } from "../utils/functions";
import { useMediaQuery } from "../utils/hooks";
import { LinkWrapperProps } from "./Footer";

interface Props {}

const Sidebar = (props: Props) => {
  let isBreakpoint = useMediaQuery(1023);
  const { currentPage, ninjaMode, setNinjaMode } = NavContext();
  const { pathname } = useRouter();
  const handleOptions = () => {};

  const LinkWrapper = ({
    href,
    activeIcon: ActiveIcon,
    icon: Icon,
    pageTitle,
    current,
  }: LinkWrapperProps) => {
    if (href === pathname) {
      return (
        <button
          className="flex items-center gap-3 p-2 rounded-lg hover:cursor-pointer"
          onClick={() => scrollToTop()}
        >
          {currentPage[current || "offers"] ? (
            <ActiveIcon
              size={28}
              color={"white"}
              className="active:scale-95 "
            />
          ) : (
            <Icon
              color={"#e3e3e3ae"}
              size={28}
              className={`active:scale-95 transition-all ease-in-out duration-150 `}
            />
          )}
          <p
            className={`font-semibold text-sm transition-all ease-in-out  ${
              currentPage[current || "home"]
                ? "text-[white]"
                : "text-[#e3e3e3ae]"
            }`}
          >
            {pageTitle}
          </p>
        </button>
      );
    }
    return (
      <Link href={href}>
        <div className="flex items-center gap-3 p-2 rounded-lg group">
          {currentPage[current || "home"] ? (
            <ActiveIcon
              size={28}
              color={"white"}
              className="active:scale-95  "
            />
          ) : (
            <span className={`hover:fill-[white]`}>
              <Icon
                color={"#e3e3e3ae"}
                size={28}
                className={`active:scale-95 group-hover:fill-white transition-all duration-150`}
              />
            </span>
          )}
          <p
            className={`font-semibold text-sm group-hover:text-white transition-all duration-150`}
          >
            {pageTitle}
          </p>
        </div>{" "}
      </Link>
    );
  };

  return (
    <div
      className={!isBreakpoint ? "min-w-[240px] bg-black z-[100] " : "hidden"}
    >
      <div className="fixed">
        {pathname !== "/" ? (
          <Link
            href={"/"}
            className="w-[230px] flex justify-center items-center pl-12 p-6"
          >
            <Image src={Ninja4} alt="" className="h-fit mx-3" width={60} />
            <Image
              alt="/"
              src={LogoText}
              width={160}
              className="px-4 py-2 right-6  relative h-fit"
            />
          </Link>
        ) : (
          <button
            className="w-[230px] flex justify-center items-center pl-12 p-6"
            onClick={() => scrollToTop()}
          >
            <Image src={Ninja4} alt="" className="h-fit mx-3" width={60} />
            <Image
              alt="/"
              src={LogoText}
              width={160}
              className="px-4 py-2 right-6  relative h-fit"
            />
          </button>
        )}

        <div className="flex flex-col px-4 relative gap-2">
          <LinkWrapper
            href="/"
            activeIcon={RiHome6Fill}
            icon={RiHome6Line}
            pageTitle="Home"
            current="home"
          />
          <LinkWrapper
            href="/search"
            activeIcon={RiSearch2Fill}
            icon={RiSearch2Line}
            pageTitle="Search"
            current="search"
          />
          <LinkWrapper
            href="/podcasts"
            activeIcon={MdOutlinePodcasts}
            icon={MdPodcasts}
            pageTitle="Podcasts"
            current="podcasts"
          />
          <LinkWrapper
            href="/offers"
            activeIcon={FaUserNinja}
            icon={FaUserNinja}
            pageTitle="Offers"
            current="offers"
          />
        </div>
        <div className="mt-10 px-2">
          <Menu closeOnSelect={false}>
            <MenuButton className="p-6 group">
              <div className="flex gap-2 items-center relative right-2 ">
                <p className="font-semibold text-sm text-[#e3e3e3ae] group-hover:text-white">
                  More
                </p>
                <BiChevronDown
                  onClick={handleOptions}
                  className="fill-[#e3e3e3ae] group-hover:fill-white hover:cursor-pointer"
                />
              </div>
            </MenuButton>
            <MenuList bg={"whiteAlpha.200"}>
              <MenuItem
                bgColor={"transparent"}
                _hover={{ bgColor: "#222222" }}
                onClick={() => setNinjaMode((prev) => !prev)}
              >
                <p className="text-xs font-semibold text-[#e3e3e3ae]">
                  {" "}
                  Ninja Mode:{" "}
                </p>
                <span className="text-white text-xs font-bold px-2">
                  {ninjaMode ? "ON" : "OFF"}
                </span>
              </MenuItem>
              <MenuDivider />
              <MenuItem
                bgColor={"transparent"}
                _hover={{ bgColor: "#222222" }}
                className="group"
              >
                <div className="flex items-center gap-4 ">
                  <RiExternalLinkLine
                    color="#e3e3e3ae"
                    className="group-hover:fill-white transition-all duration-300"
                  />
                  <p className="text-xs font-semibold text-[#e3e3e3ae] group-hover:text-white transition-all duration-300">
                    {" "}
                    About
                  </p>
                </div>
              </MenuItem>
              <MenuItem
                bgColor={"transparent"}
                _hover={{ bgColor: "#222222" }}
                className="group"
              >
                <div className="flex items-center gap-4 ">
                  <RiExternalLinkLine
                    color="#e3e3e3ae"
                    className="group-hover:fill-white transition-all duration-300"
                  />
                  <p className="text-xs font-semibold text-[#e3e3e3ae] group-hover:text-white transition-all duration-300">
                    {" "}
                    Support
                  </p>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
