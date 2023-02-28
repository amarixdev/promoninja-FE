import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import Context from "../context/context";
import * as Hero from "../public/assets/comedy.png";
import { CategoryPodcast, PodcastData } from "../utils/types";
import { capitalizeString, truncateString } from "../utils/functions";

interface CategoryProps {
  category: any;
}

const CategoryList = ({ category }: CategoryProps) => {
  const { setCurrentCategory } = useContext(Context);
  const categoryName = Object.keys(category)[0];
  const podcastData = category[categoryName];

  return (
    <>
      <div className="flex justify-between items-center my-4">
        <h1 className="text-lg sm:text-2xl md:text-3xl p-5 font-bold text-white">
          {capitalizeString(categoryName)}
        </h1>
        <Link
          href={"/category"} /* TODO: dynamically set*/
          className="p-4 text-gray-300 font-bold text-xs"
          onClick={() => setCurrentCategory(categoryName)}
        >
          SHOW ALL
        </Link>
      </div>

      <div className=" flex overflow-x-scroll ">
        {podcastData?.map((podcast: PodcastData) => (
          <div
            key={podcast.title}
            className="bg-[#1e1e1e] flex flex-col items-center min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[240px] h-[255px] sm:h-[283px] md:h-[312px] lg:h-[340px] scroll-smooth rounded-lg mx-3 "
          >
            <Image
              src={podcast.imageUrl}
              alt="here"
              loading="lazy"
              width={250}
              height={250}
              className="rounded-3xl p-4"
            />
            <h1 className="text-sm sm:text-md lg:text-lg text-center px-2 font-semibold text-white whitespace-nowrap">
              {truncateString(podcast.title, 20)}
            </h1>
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoryList;
