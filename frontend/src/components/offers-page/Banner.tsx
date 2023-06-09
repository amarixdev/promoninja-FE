import { RefObject, useEffect } from "react";
import { useBanner } from "../../utils/hooks";
import { capitalizeString, scrollToTop } from "../../utils/functions";

interface BannerProps {
  bannerBreakpointRef: RefObject<HTMLDivElement>;
  setIsScrolledToTop: (value: boolean) => void;
  isScrolledToTop: boolean;
  bannerCategory: string;
}

const Banner = ({
  bannerBreakpointRef,
  setIsScrolledToTop,
  isScrolledToTop,
  bannerCategory,
}: BannerProps) => {
  const { banner: displayCategory } = useBanner(bannerBreakpointRef, 160);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledToTop(window.scrollY === 0);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setIsScrolledToTop]);
  return (
    <div
      className={`fixed w-full lg:ml-[240px] cursor-pointer ${
        isScrolledToTop ? "z-0" : "z-50"
      }`}
      onClick={() => scrollToTop()}
    >
      {
        <div
          className={`flex w-full bg-[#000000] justify-center lg:justify-start h-[105px] lg:h-fit select-none backdrop-blur-md items-center relative transition-all duration-[200ms] ease-out z-50 ${
            displayCategory && !isScrolledToTop
              ? "bottom-0 opacity-100 "
              : "bottom-[500px] opacity-0"
          }`}
        >
          <div className={`flex items-center  p-4 sm:p-6 hover:cursor-pointer`}>
            <h1
              className={`font-extrabold relative text-3xl sm:text-5xl transition-all duration-300  `}
            >
              {capitalizeString(bannerCategory)}
            </h1>
          </div>
        </div>
      }
    </div>
  );
};

export default Banner;
