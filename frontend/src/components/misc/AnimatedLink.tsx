import Link from "next/link";
import { ReactNode, RefObject, useEffect, useState } from "react";
import { MdChevronRight } from "react-icons/md";
import { NavContext } from "../../context/navContext";
import { useMediaQuery } from "../../utils/hooks";

interface AnimatedLinkProps {
  title: string | undefined;
  location: string;
  separateLink?: boolean;
  top?: boolean;
  sliderID?: HTMLElement | null;
  sliderRef?: RefObject<HTMLDivElement>;
}

const ConditionalLink = ({
  children,
  separateLink,
  location,
}: {
  children: ReactNode;
  separateLink: boolean | undefined;
  location: string;
}) => {
  if (separateLink) {
    return <span>{children}</span>;
  } else return <Link href={`${location}`}>{children}</Link>;
};

const AnimatedLink = ({
  title,
  location,
  separateLink,
  top,
  sliderID,
  sliderRef,
}: AnimatedLinkProps) => {
  const isBreakPoint = useMediaQuery(1023);
  const xsBreakPoint = useMediaQuery(389);
  const chevronSize = xsBreakPoint ? 25 : 30;
  const [hover, setHover] = useState(false);
  const { setCategoryIndex } = NavContext();
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    let hasScrolled = false;
    const slider = sliderRef?.current;
    const handleScroll = () => {
      if (slider) {
        slider.scrollLeft > 50 ? setAnimation(true) : setAnimation(false);
      }
    };
    if (slider) {
      slider.addEventListener("scroll", handleScroll);
      return () => slider.removeEventListener("scroll", handleScroll);
    }
  }, [sliderID, sliderRef, title, animation]);

  if (isBreakPoint) {
    /* Mobile */
    return (
      <section
        onClick={() => setCategoryIndex(-1)}
        className={`flex ${
          separateLink ? "justify-between" : "justify-start"
        } w-full items-center`}
      >
        <ConditionalLink location={location} separateLink={separateLink}>
          <div className="flex items-center z-10 hover:cursor-pointer relative">
            <h2
              className={` text-lg xs:text-xl font-bold px-3 text-white relative bottom-[2px] whitespace-nowrap`}
            >
              {title}
            </h2>
            {separateLink || (
              <>
                <MdChevronRight
                  color={"#9c9c9c"}
                  size={chevronSize}
                  className={`${
                    animation
                      ? "right-[-70px] opacity-100"
                      : "scale-100 right-[10px]"
                  }  bottom-[1px] relative transition-all duration-300 ease-in-out`}
                />
                <h2
                  className={`${
                    animation
                      ? "opacity-100 right-[-40px]"
                      : "right-[-35px] opacity-0"
                  } text-[#aaaaaa] transition-all duration-300 ease-in-out text-xs xs:text-sm font-semibold absolute  `}
                >
                  Explore All
                </h2>
              </>
            )}
          </div>
        </ConditionalLink>
        {separateLink && (
          <Link href={`${location}`} className="flex items-center pr-4">
            <h2
              onClick={() => setCategoryIndex(-1)}
              className="whitespace-nowrap text-sm text-[#9c9c9c] font-bold relative`"
            >
              Explore All
            </h2>
            <MdChevronRight color={"#9c9c9c"} size={20} className="relative" />
          </Link>
        )}
      </section>
    );
  } else {
    /* Desktop */
    return (
      <section
        className="w-full flex items-center justify-between group h-fit hover:cursor-point pt-6"
        onClick={() => setCategoryIndex(-1)}
      >
        <Link href={`${location}`}>
          <div
            className="flex items-center z-10 hover:cursor-pointer mb-4"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <h2
              className={`text-xl lg:text-2xl font-bold px-3 relative text-[#cdcdcd] bottom-[2px] group-hover:text-white whitespace-nowrap`}
            >
              {title}
            </h2>

            <div className="relative z-0 flex items-center right-5">
              <h3
                className={`${
                  hover ? "opacity-100 left-4" : "left-0 opacity-0"
                } transition-all duration-[500ms] ease-in-out  whitespace-nowrap text-xs text-[#9c9c9c] font-bold relative`}
              >
                Explore All
              </h3>
              <MdChevronRight
                color={"#9c9c9c"}
                className={`group-hover:block hidden relative ${
                  hover
                    ? "left-4 opacity-100 scale-75"
                    : "scale-100 left-[-60px]"
                } transition-all duration-200 ease-in rounded-full  cursor-pointer `}
                size={30}
              />
            </div>
          </div>
        </Link>
      </section>
    );
  }
};

export default AnimatedLink;
