import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import fallbackImage from "../../public/assets/fallback.png";
import { convertToSlug, truncateString } from "../../utils/functions";
import { useHoverCard, useMediaQuery } from "../../utils/hooks";
import { PodcastData } from "../../utils/types";
import AnimatedLink from "../misc/AnimatedLink";
import SliderArrows from "../misc/SliderArrows";

interface PopularPodcastsProps {
  topPicksData: PodcastData[];
  ninjaMode: boolean;
}

const PopularPodcasts = ({ topPicksData, ninjaMode }: PopularPodcastsProps) => {
  const { activeIndex, setActiveIndex, handleHoverCard } = useHoverCard();
  const sliderRef = useRef<HTMLDivElement>(null);
  const isBreakPoint = useMediaQuery(1023);

  return (
    <section className="w-full flex flex-col justify-center items-center">
      <AnimatedLink
        location="/podcasts"
        title="Popular Podcasts"
        separateLink={true}
      />

      <div className="relative flex w-full items-center group z-[1]">
        <SliderArrows
          sliderRef={sliderRef}
          scrollDistance={1200}
          podcastPage={false}
        />
        <nav
          aria-label="popular-podcasts"
          className={`flex overflow-x-scroll scrollbar-hide scroll-smooth relative w-full py-10 lg:px-10`}
          ref={sliderRef}
        >
          {topPicksData.map((podcast: PodcastData, index: number) => (
            <Link
              href={`/podcasts/${convertToSlug(
                podcast.category[0].name
              )}/${convertToSlug(podcast.title)}`}
              key={podcast.title}
            >
              <div
                className={`${
                  ninjaMode
                    ? `bg-gradient-to-b from-[#212121] to-[#111111] ${
                        isBreakPoint ||
                        "hover:from-[#202020] hover:to-[#282828]"
                      } `
                    : `bg-gradient-to-b from-[#2a2a2a] to-[#181818] ${
                        isBreakPoint ||
                        "hover:from-[#202020] hover:to-[#343434]"
                      } `
                } hover:cursor-pointer ${
                  activeIndex === index
                    ? " scale-125 transition-all duration-300 relative z-20"
                    : "scale-100 transition-all duration-300 "
                } active:scale-95 transition-all ease-in-out duration-300 lg:active:scale-100 relative flex flex-col items-center min-w-[160px] xs:min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[220px] h-[228px] xs:h-[255px] sm:h-[283px] lg:h-[300px] rounded-lg mx-3`}
                key={podcast.title}
                onMouseOver={() => handleHoverCard(index, "mouseenter")}
                onMouseMove={() => handleHoverCard(index, "mouseenter")}
                onMouseLeave={() => {
                  handleHoverCard(index, "mouseleave");
                  setActiveIndex(null);
                }}
              >
                <Image
                  src={podcast.imageUrl || fallbackImage}
                  alt={podcast.title}
                  width={190}
                  height={190}
                  loading="eager"
                  className="rounded-xl mt-4 shadow-lg shadow-black base:w-[130px] xs:w-[150px] sm:w-[170px] "
                />
                <div>
                  <h2
                    className={`text-xs xs:text-sm sm:text-md lg:font-bold  text-center px-2 pt-6 font-semibold text-[#dadada] group-hover:text-white whitespace-nowrap`}
                  >
                    {!isBreakPoint
                      ? truncateString(podcast.title, 20)
                      : truncateString(podcast.title, 14)}
                  </h2>
                  <h3
                    className={`text-xs sm:text-sm text-center px-2 font-medium text-[#909090]`}
                  >
                    {!isBreakPoint
                      ? activeIndex !== index
                        ? truncateString(podcast.title, 20)
                        : "See Exclusive Deals: "
                      : truncateString(podcast.title, 14)}
                  </h3>
                </div>
                {
                  <div
                    className={`${
                      activeIndex === index ? "opacity-100" : "opacity-0"
                    } flex items-center gap-3 p-2 transition duration-300 `}
                  >
                    {podcast.sponsors?.map((sponsor) => (
                      <Image
                        src={sponsor?.imageUrl || fallbackImage}
                        alt={sponsor?.name}
                        width={30}
                        height={30}
                        className={
                          sponsor?.imageUrl
                            ? "rounded-md min-w-[30px] min-h-[30px]"
                            : "opacity-0"
                        }
                        key={sponsor?.imageUrl || index}
                      />
                    ))}
                    {podcast.sponsors?.length > 2 && (
                      <p className="text-[#b4b4b4] text-2xl font-thin">+</p>
                    )}
                  </div>
                }
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default PopularPodcasts;
