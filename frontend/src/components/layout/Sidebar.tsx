import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
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
import { NavContext } from "../../context/navContext";
import * as LogoText from "../../public/assets/logo-text.png";
import * as Ninja4 from "../../public/assets/logo.png";
import { scrollToTop } from "../../utils/functions";
import { useMediaQuery } from "../../utils/hooks";
import { LinkWrapperProps } from "./FooterBar";

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
          <h2
            className={`font-semibold text-sm transition-all ease-in-out  ${
              currentPage[current || "home"]
                ? "text-[white]"
                : "text-[#e3e3e3ae]"
            }`}
          >
            {pageTitle}
          </h2>
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
          <h2
            className={`font-semibold text-sm group-hover:text-white transition-all duration-150`}
          >
            {pageTitle}
          </h2>
        </div>{" "}
      </Link>
    );
  };
  return (
    <aside
      className={
        isBreakpoint
          ? "hidden"
          : "min-w-[240px] fixed border-2 bg-black top-0 bottom-0 left-0 z-[999] transition-all duration-500 ease-in-out"
      }
    >
      <nav aria-label="sidebar navigation" className="fixed">
        {pathname !== "/" ? (
          <Link
            href={"/"}
            className="w-[230px] flex justify-center items-center pl-12 p-6"
          >
            <Image
              src={Ninja4}
              alt="logo"
              className="h-fit mx-3"
              width={60}
              priority
            />
            <Image
              alt="logo-text"
              src={LogoText}
              width={160}
              className="px-4 py-2 right-6  relative h-fit"
              priority
            />
          </Link>
        ) : (
          <button
            className="w-[230px] flex justify-center items-center pl-12 p-6"
            onClick={() => scrollToTop()}
          >
            <Image
              src={Ninja4}
              alt="logo"
              className="h-fit mx-3"
              width={60}
              priority
            />
            <Image
              alt="logo-text"
              src={LogoText}
              width={160}
              className="px-4 py-2 right-6  relative h-fit"
              priority
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
              <div className="flex gap-2 items-center relative right-2  ">
                <p className="font-semibold text-base text-[#e3e3e3ae]  group-hover:text-white">
                  More
                </p>
                <BiChevronDown
                  onClick={handleOptions}
                  size={20}
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
                <h2 className="text-sm font-semibold text-[#e3e3e3ae]">
                  {" "}
                  Ninja Mode:{" "}
                </h2>
                <span className="text-white text-xs font-bold px-2">
                  {ninjaMode ? "ON" : "OFF"}
                </span>
              </MenuItem>
              <MenuDivider />

              <Link
                href={"/about"}
                className="flex items-center gap-4 w-full h-full py-2 group "
              >
                <MenuItem
                  bgColor={"transparent"}
                  _hover={{ bgColor: "#222222" }}
                  className=""
                >
                  <RiExternalLinkLine
                    color="#e3e3e3ae"
                    className="group-hover:fill-white transition-all duration-300 mr-3"
                  />
                  <h2 className="text-sm font-semibold text-[#e3e3e3ae] group-hover:text-white transition-all duration-300">
                    {" "}
                    About
                  </h2>
                </MenuItem>
              </Link>

              <Link
                href={"/support"}
                className="flex items-center gap-4 w-full h-full py-2"
              >
                <MenuItem
                  bgColor={"transparent"}
                  _hover={{ bgColor: "#222222" }}
                  className="group"
                >
                  <RiExternalLinkLine
                    color="#e3e3e3ae"
                    className="group-hover:fill-white transition-all duration-300 mr-3"
                  />
                  <h2 className="text-sm font-semibold text-[#e3e3e3ae] group-hover:text-white transition-all duration-300">
                    {" "}
                    Support
                  </h2>
                </MenuItem>
              </Link>
            </MenuList>
          </Menu>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
