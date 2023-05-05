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
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#282828a1] hover:text-[white] hover:cursor-pointer">
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
        </div>
      );
    }
    return (
      <Link href={href}>
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#282828a1] hover:text-[white]">
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
    <div className={!isBreakpoint ? "min-w-[250px] bg-black" : "hidden"}>
      <div className="fixed">
        <Link
          href={"/"}
          className="w-[230px] flex justify-center items-center p-4"
        >
          <Image src={Ninja4} alt="" className="h-fit mx-3" width={60} />
          <Image
            alt="/"
            src={LogoText}
            width={160}
            className="p-6 sm:p-4 relative right-6 h-fit"
          />
        </Link>

        <div className="flex flex-col text-[#cdcdcd] px-4 relative mt-4 gap-2">
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
