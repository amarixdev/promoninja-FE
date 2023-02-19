import Image from "next/image";
import Link from "next/link";
import {
  useContext,

} from "react";
import Context from "../context/context";
import * as Hero from "../public/assets/comedy.png";

type CategoryProps = {
  category: string;
  podcasts: string[];
};

const CategoryList = ({ category, podcasts }: CategoryProps) => {
  const { currentCategory, setCurrentCategory } = useContext(Context);

  // const podcasts = [1, 2, 3, 4, 5];
  return (
    <>
      <div className="flex justify-between items-center my-4">
        <h1 className="text-lg sm:text-2xl md:text-3xl p-5 font-bold text-white">
          {category}
        </h1>
        <Link
          href={"/category"}
          className="p-4 text-gray-300 font-bold text-xs"
          onClick={() => setCurrentCategory(category)}
        >
          SHOW ALL
        </Link>
      </div>

      <div className=" flex justify-between overflow-x-scroll sm:grid-cols-5 sm:gap-20 md:gap-6 lg:gap-4 sm:grid p-5">
        {podcasts.map((pod, i) => (
          <div
            key={i}
            className="bg-[#1e1e1e] flex flex-col items-center min-w-[150px] sm:min-w-[120px] h-[180px] sm:h-[150px] md:h-[180px] lg:h-[230px] scroll-smooth rounded-3xl mx-4 "
          >
            <Image src={Hero} alt="here" />
            <h1 className="text-3xl text-white">{pod}</h1>
            <button className="text-white text-sm bg-red-500 p-2 rounded-full">
              SPONSORS
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoryList;
