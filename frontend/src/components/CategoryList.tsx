import Image from "next/image";
import Link from "next/link";
import { CategoryPodcast, PodcastData } from "../utils/types";
import { capitalizeString, truncateString } from "../utils/functions";
import { useMediaQuery } from "../utils/hooks";

interface CategoryProps {
  category: CategoryPodcast;
}

const CategoryList = ({ category }: CategoryProps) => {

  const categoryName = Object.keys(category)[0];
  const podcastData = category[categoryName];
  const isBreakPoint = useMediaQuery(639);

  return (
    <div className={`${isBreakPoint && "my-[-40px]"} `}>
      <div className={`flex justify-between items-center my-4`}>
        <h1
          className={`text-lg sm:text-2xl p-5 font-bold text-white ${
            !isBreakPoint ? "ml-6" : "ml-2 text-xl"
          }`}
        >
          {capitalizeString(categoryName)}
        </h1>
        <Link
          href={`/podcasts/${categoryName}`}
          className="p-4 text-gray-300 font-bold text-xs relative whitespace-nowrap "
        >
          SHOW ALL
        </Link>
      </div>
      <div
        className={`flex overflow-x-scroll scrollbar-hide scroll-smooth relative ${
          !isBreakPoint ? "ml-6" : "ml-2 bottom-10 "
        }`}
      >
        {podcastData?.map((podcast: PodcastData) => (
          <div
            key={podcast.title}
            className={
              !isBreakPoint
                ? `from-[#0d0d0d] bg-gradient-radial to-[#202020] hover:bg-[#292727]  hover:cursor-pointer flex flex-col items-center min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[240px] h-[255px] sm:h-[283px] md:h-[312px] lg:h-[340px] rounded-lg mx-3`
                : "hover:cursor-pointer flex flex-col items-center min-w-[120px] h-[255px] ml-2 rounded-lg overflow-y-visible"
            }
          >
            <Image
              src={podcast.imageUrl}
              alt=""
              width={190}
              height={190}
              className="rounded-xl mt-4 shadow-lg shadow-black w-[100px] sm:w-[150px] md:w-[170px] lg:w-[190px] "
            />

            <h1 className="text-sm sm:text-md lg:text-lg text-center px-2 pt-6 font-semibold text-white whitespace-nowrap">
              {!isBreakPoint
                ? truncateString(podcast.title, 20)
                : truncateString(podcast.title, 15)}
            </h1>
            <p className="text-xs sm:text-sm lg:text-md text-center px-2 font-medium text-[#909090] mt-5 ">
              {!isBreakPoint
                ? podcast.publisher
                : truncateString(podcast.publisher, 42)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
