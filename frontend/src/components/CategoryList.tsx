import Image from "next/image";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import { NavContext } from "../context/navContext";
import { capitalizeString, truncateString } from "../utils/functions";
import { useMediaQuery } from "../utils/hooks";
import { CategoryPodcast, PodcastData } from "../utils/types";
interface CategoryProps {
  category: CategoryPodcast;
}

const CategoryList = ({ category }: CategoryProps) => {
  const categoryName = Object.keys(category)[0];
  const podcastData = category[categoryName];
  const isBreakPoint = useMediaQuery(1023);
  const { setPreviousPage, setCategoryType } = NavContext();

  const handlePreviousPage = () => {
    setCategoryType(null);
    setPreviousPage("podcasts");
  };

  return (
    <div
      className={`${
        isBreakPoint && "my-[-55px] xs:my-[-40px] sm:my-[-25px] md:my-[-15px]"
      }`}
    >
      <div className={`flex justify-between items-center my-5 md:my-6 lg:my-4`}>
        <Link href={`/podcasts/${categoryName}`}>
          <div className="flex items-center justify-center">
            <h1
              className={`text-lg sm:text-2xl font-bold text-white ${
                !isBreakPoint ? "ml-6 px-4" : "ml-2 text-xl p-4 relative z-15 "
              }`}
              onClick={() => setPreviousPage("podcasts")}
            >
              {capitalizeString(categoryName)}
            </h1>
            <FaChevronRight className="relative right-2 top-[1px]" />
          </div>
        </Link>
      </div>
      <div
        className={`flex overflow-x-scroll scrollbar-hide scroll-smooth relative ${
          !isBreakPoint ? "ml-6" : "ml-2 bottom-10"
        }`}
      >
        {podcastData?.slice(0, 8).map((podcast: PodcastData) => (

          <div
            className={
              !isBreakPoint
                ? `from-[#0d0d0d] bg-gradient-radial to-[#202020] hover:from-[#202020] hover:to-[#343434] hover:cursor-pointer flex flex-col items-center min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[240px] h-[255px] sm:h-[283px] md:h-[312px] lg:h-[340px] rounded-lg mx-3`
                : "hover:cursor-pointer flex flex-col items-center min-w-[120px] md:min-w-[140px] h-[255px] sm:h-[285px] ml-2 rounded-lg overflow-y-visible sm:mx-5"
            }
            key={podcast.title}
          >
            <Link
              href={`/podcasts/${categoryName}/${podcast.title}`}
              key={podcast.title}
            >
              <Image
                src={podcast.imageUrl}
                alt={podcast.title}
                width={190}
                height={190}
                loading="lazy"
                className="rounded-xl mt-4 shadow-lg shadow-black base:w-[90px] xs:w-[110px] sm:w-[170px] md:w-[190px] lg:w-[190px] "
                onClick={handlePreviousPage}
              />
            </Link>

            <div>
              <h1
                className={`text-sm sm:text-md lg:text-lg base:text-left lg:text-center px-2 pt-6 font-semibold text-white whitespace-nowrap`}
              >
                {!isBreakPoint
                  ? truncateString(podcast.title, 20)
                  : truncateString(podcast.title, 14)}
              </h1>
              <p className="text-xs sm:text-sm lg:text-md base:text-left lg:text-center px-2 font-medium text-[#909090]">
                {!isBreakPoint
                  ? podcast.publisher
                  : truncateString(podcast.publisher, 30)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
