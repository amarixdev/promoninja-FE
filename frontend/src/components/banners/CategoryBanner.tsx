import { capitalizeString, scrollToTop } from "../../utils/functions";

import React from "react";

const CategoryBanner = ({
  banner,
  categoryName,
}: {
  banner: boolean;
  categoryName: string;
}) => {
  return (
    <div className={`fixed w-full z-50 lg:ml-[240px]`}>
      {
        <div
          className={`flex w-full bg-[#00000073] top-[-5px] lg:top-0 backdrop-blur-md items-center relative transition-all ease-in-out duration-300 ${
            banner ? "opacity-100 z-50" : "opacity-0 z-0"
          } `}
        >
          <div
            className={`flex items-center p-4 sm:p-6 hover:cursor-pointer`}
            onClick={() => scrollToTop()}
          >
            <h1
              className={`font-extrabold relative text-3xl sm:text-5xl transition-all duration-300  `}
            >
              {capitalizeString(categoryName)}
            </h1>
          </div>
        </div>
      }
    </div>
  );
};

export default CategoryBanner;
