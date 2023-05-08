import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { MdOutlinePodcasts, MdPodcasts } from "react-icons/md";
import { RiSearch2Fill, RiSearch2Line } from "react-icons/ri";
import { NavContext } from "../context/navContext";
import * as LogoText from "../public/assets/logo-text.png";
import * as Ninja4 from "../public/assets/logo.png";
import { useMediaQuery } from "../utils/hooks";
import { LinkWrapperProps } from "./Footer";
import { scrollToTop } from "../utils/functions";

interface Props {}

const Sidebar = (props: Props) => {
  let isBreakpoint = useMediaQuery(1023);
  const { currentPage } = NavContext();
  const { pathname } = useRouter();

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
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#282828a1] hover:cursor-pointer"
          onClick={() => scrollToTop()}
        >
          {currentPage[current || "home"] ? (
            <ActiveIcon
              size={28}
              color={"#d6d6d6"}
              className="active:scale-95"
            />
          ) : (
            <Icon color={"#e3e3e3ae"} size={28} className={`active:scale-95`} />
          )}
          <p
            className={`font-semibold text-sm  ${
              currentPage[current || "home"]
                ? "text-[#d6d6d6]"
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
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#282828a1] ">
          {currentPage[current || "home"] ? (
            <ActiveIcon
              size={28}
              color={"#d6d6d6"}
              className="active:scale-95"
            />
          ) : (
            <Icon color={"#e3e3e3ae"} size={28} className={`active:scale-95`} />
          )}
          <p
            className={`font-semibold text-sm ${
              currentPage[current || "home"]
                ? "text-[#d6d6d6]"
                : "text-[#e3e3e3ae]"
            }`}
          >
            {pageTitle}
          </p>
        </div>{" "}
      </Link>
    );
  };

  return (
    <div
      className={!isBreakpoint ? "min-w-[250px] bg-black z-[100]" : "hidden"}
    >
      <div className="fixed">
        {pathname !== "/" ? (
          <Link
            href={"/"}
            className="w-[230px] flex justify-center items-center pl-8 p-6"
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
            className="w-[230px] flex justify-center items-center pl-8 p-6"
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
            activeIcon={AiFillHome}
            icon={AiOutlineHome}
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
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
