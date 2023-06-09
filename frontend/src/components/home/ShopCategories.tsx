import { Dispatch, SetStateAction, useState } from "react";
import { useCarouselSpeed, useMediaQuery, useRotate } from "../../utils/hooks";
import Carousel from "./Carousel";
import { Button } from "@chakra-ui/react";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { SponsorCategory } from "../../utils/types";

interface ShopCategoriesProps {
  setNinjaMode: Dispatch<SetStateAction<boolean>>;
  categoryData: SponsorCategory[];
  setCategoryIndex: (value: number) => void;
  categoryIndex: number;
}

const ShopCategories = ({
  setNinjaMode,
  categoryData,
  setCategoryIndex,
  categoryIndex,
}: ShopCategoriesProps) => {
  const isBreakPoint = useMediaQuery(1023);
  const [clickCount, setClickCount] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const { easterEgg, setEaserEgg } = useCarouselSpeed(
    clickCount,
    startTime,
    setNinjaMode
  );
  const [currDeg, handleRotate] = useRotate(
    clickCount,
    setClickCount,
    setStartTime
  );

  return (
    <div className="w-full items-center relative">
      {/* Sponsor Carousel */}

      <div className="mt-16 lg:mt-28">
        <div className="w-full flex items-center justify-start">
          <h1
            className={`text-base  lg:text-2xl font-bold px-4 mb-12 relative top-9 text-[#cdcdcd]
             z-20"`}
          >
            Shop Categories
          </h1>
        </div>
        <div className="flex flex-col items-center relative bottom-14 py-6 rounded-lg">
          <div
            className={` absolute ${isBreakPoint && "right-10"} ${
              easterEgg ? "opacity-100 " : "opacity-0"
            } transition duration-300 ease-in-out font-bold text-s lg:text-sm text-[#aaaaaa] italic`}
          >
            Nice Speed!
          </div>

          <Carousel
            handleRotate={handleRotate}
            currDeg={currDeg}
            categoryData={categoryData}
            setCategoryIndex={setCategoryIndex}
            categoryIndex={categoryIndex}
          />
          <div className="flex gap-10 relative bottom-10 z-20">
            <Button
              w={100}
              colorScheme="gray"
              onClick={() => handleRotate("next")}
              className={`active:scale-95 `}
              onMouseLeave={() => {
                setClickCount(0);
                setEaserEgg(false);
              }}
            >
              <AiFillCaretLeft />
            </Button>
            <Button
              w={100}
              onClick={() => handleRotate("prev")}
              className="active:scale-95"
              onMouseLeave={() => {
                setClickCount(0);
                setEaserEgg(false);
              }}
            >
              <AiFillCaretRight />
            </Button>
          </div>
        </div>
      </div>

      {/* <div className="w-full flex justify-center items-center relative bottom-10 lg:bottom-10">
          <div className="max-w-[60%] max-h-[100px] py-2">
            <p className="font-light text-md sm:text-lg  text-[#909090] tracking-widest italic">
              "Did you know some podcast sponsorships are for charitable
              causes? For example, {""}
              <span>
                <Link
                  href={`/podcasts/society/${"crime-junkie"}`}
                  target="_blank"
                  className="hover:text-yellow-200 font-semibold mr-1 italic"
                >
                  Crime Junkie
                </Link>
              </span>
              has partnered with organizations such as the National
              Center for Missing and Exploited Children."
            </p>
          </div>
        </div> */}

      {/* Sponsors A-Z */}

     
    </div>
  );
};

export default ShopCategories;
