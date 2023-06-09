import { BiPodcast } from "react-icons/bi";
import { FaUserNinja } from "react-icons/fa";
import { useMediaQuery } from "../../utils/hooks";

import Link from "next/link";
import { useRouter } from "next/router";
import { IconType } from "react-icons/lib";
import {
  RiHome6Fill,
  RiHome6Line,
  RiSearch2Fill,
  RiSearch2Line,
} from "react-icons/ri";
import { NavContext } from "../../context/navContext";
import { scrollToTop } from "../../utils/functions";

export interface LinkWrapperProps {
  href: string;
  activeIcon: IconType;
  icon: IconType;
  pageTitle: string;
  current?: "home" | "podcasts" | "search" | "offers";
}

const Footer = () => {
  const { currentPage } = NavContext();
  const isBreakPoint = useMediaQuery(1023);
  const { pathname } = useRouter();

  const LinkWrapper = ({
    href,
    activeIcon: ActiveIcon,
    icon: Icon,
    pageTitle,
    current,
  }: LinkWrapperProps) => {
    if (href == pathname) {
      return (
        <button
          className={`flex flex-col items-center px-4`}
          onClick={() => scrollToTop()}
        >
          {currentPage[current || "home"] ? (
            <ActiveIcon
              color={"#d6d6d6"}
              size={24}
              className={`text-[#d6d6d6] active:scale-95 relative base:w-[22px] xs:w-[24px] `}
            />
          ) : (
            <Icon
              color={"#e3e3e3ae"}
              size={24}
              className={`relative active:scale-95 base:w-[22px] xs:w-[24px]`}
            />
          )}
          <p
            className={`base:text-[10px] xs:text-xs font-medium ${
              currentPage[current || "home"]
                ? "text-[#d6d6d6]"
                : "text-[#e3e3e3ae]"
            }`}
          >
            {pageTitle}
          </p>
        </button>
      );
    } else {
      return (
        <Link href={href} className={`flex flex-col items-center px-4`}>
          {currentPage[current || "home"] ? (
            <ActiveIcon
              color={"#d6d6d6"}
              size={24}
              className={`text-[#d6d6d6] active:scale-95 relative base:w-[22px] xs:w-[24px] `}
            />
          ) : (
            <Icon
              color={"#e3e3e3ae"}
              size={24}
              className={`relative  active:scale-95 base:w-[22px] xs:w-[24px] `}
            />
          )}
          <p
            className={`base:text-[10px] xs:text-xs font-medium ${
              currentPage[current || "home"]
                ? "text-[#d6d6d6]"
                : "text-[#e3e3e3ae]"
            }`}
          >
            {pageTitle}
          </p>
        </Link>
      );
    }
  };

  return (
    <div
      className={
        isBreakPoint
          ? `w-[100vw] fixed bottom-[0] z-[999] bg-black/60 backdrop-blur-md`
          : "hidden"
      }
    >
      <div className="flex justify-evenly relative items-center base:h-[60px] xs:h-[70px] ">
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
          activeIcon={BiPodcast}
          icon={BiPodcast}
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
    </div>
  );
};

export default Footer;
