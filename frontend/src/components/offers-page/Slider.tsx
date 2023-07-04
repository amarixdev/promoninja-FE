import { useRef } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import useSlider, { useMediaQuery } from "../../utils/hooks";
import { SponsorCategory, SponsorData } from "../../utils/types";

interface SliderProps {
  sponsorsData: SponsorData[];
  sponsorCategoryData: SponsorCategory[];
  getCategorySponsors: any;
  getSponsorsCount: any;
  setRendering: (value: boolean) => void;
  isScrolledToTop: boolean;
  setFilteredSponsors: (value: SponsorData[]) => void;
  setPageTitle: (value: string) => void;
  setCurrentCategory: (category: string) => void;
  setCategoryIndex: (value: number) => void;
  setBannerCategory: (category: string) => void;
  setCategoryCount: (value: number) => void;

  categoryIndex: number;
  contextIndex: number;
}

const Slider = ({
  sponsorsData,
  sponsorCategoryData,
  getCategorySponsors,
  setRendering,
  isScrolledToTop,
  setFilteredSponsors,
  setPageTitle,
  setCurrentCategory,
  setCategoryIndex,
  setBannerCategory,
  categoryIndex,
  contextIndex,
  getSponsorsCount,
  setCategoryCount,
}: SliderProps) => {
  const categoryTabRef = useRef<HTMLButtonElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { slideTopPicks, showLeftArrow, showRightArrow } = useSlider(
    sliderRef.current,
    600,
    false
  );

  const isBreakPoint = useMediaQuery(1023);

  const filterCategory = async (category: string, index: number) => {
    if (!isScrolledToTop) {
      setRendering(true);
    }
    try {
      const { data } = await getCategorySponsors({
        variables: {
          input: {
            category,
            pageSize: 15,
            offset: 0,
          },
        },
      });
      let { data: countData } = await getSponsorsCount({
        variables: {
          input: {
            category,
            isCategory: true,
          },
        },
      });
      countData = countData?.getSponsorsCount;

      const renderDelay = !isScrolledToTop ? 250 : 0;
      await new Promise((resolve) => setTimeout(resolve, renderDelay));

      window.scrollTo({ top: 0, behavior: "auto" });
      setFilteredSponsors(data?.getCategorySponsors);
      setRendering(false);
      setPageTitle("Offers");
      setCurrentCategory(category);
      setCategoryIndex(index + 1);
      setRendering(false);

      await new Promise((resolve) => setTimeout(resolve, 250));
      setBannerCategory(category);
      setCategoryCount(countData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="fixed  lg:mt-0 scrollbar-hide lg:top-24 top-20 bg-[#151515] z-[100] overflow-x-scroll scroll-smooth w-full lg:w-[85%] flex pt-5 lg:pt-0 items-center"
      ref={isBreakPoint ? null : sliderRef}
    >
      {isBreakPoint || (
        <button
          className={`fixed bg-[#151515] z-[200] p-4 hover:cursor-pointer`}
        >
          {
            <BiChevronLeft
              size={35}
              className={`active:scale-95 ${
                showLeftArrow ? "opacity-100" : "opacity-0"
              } duration-200 transition-all`}
              onClick={() => slideTopPicks("left")}
            />
          }
        </button>
      )}

      <div className=" flex gap-5 px-6 lg:px-24 lg:pr-44  xl:pr-32 pb-4 lg:py-4">
        <button
          onClick={() => {
            if (!isScrolledToTop) {
              setRendering(true);
            }

            setTimeout(() => {
              setCategoryIndex(0);
              setCurrentCategory("All Offers");
              setPageTitle("Offers");
              setFilteredSponsors(sponsorsData);
              setRendering(false);
              window.scrollTo({ top: 0 });
            }, 250);

            setTimeout(() => {
              setBannerCategory("All Offers");
            }, 500);
          }}
          className={` ${
            categoryIndex === 0 ? "bg-[#cccccc] " : "bg-[#323131]"
          } ease-in-out min-w-[150px] py-2 px-4 rounded-lg transition-all duration-150 active:scale-95 `}
        >
          <p
            className={`text-base ${
              categoryIndex === 0 ? "text-black" : "text-[#cccccc]"
            } font-semibold transition-all duration-150`}
          >
            All{" "}
          </p>
        </button>

        {isBreakPoint
          ? /* Mobile */
            sponsorCategoryData.map((category, index) => (
              <button
                onClick={() => filterCategory(category.name, index)}
                key={index}
                ref={contextIndex === index ? categoryTabRef : undefined}
                className={`${
                  categoryIndex === index + 1 ? "bg-[#cccccc] " : "bg-[#323131]"
                }  min-w-[180px] px-4 whitespace-nowrap font-medium rounded-lg transition-all duration-150 active:scale-95`}
              >
                <p
                  className={`text-base font-semibold  ${
                    categoryIndex === index + 1
                      ? "text-black"
                      : "text-[#cccccc]"
                  } transition-all duration-150`}
                >
                  {category.name}
                </p>
              </button>
            ))
          : /* Desktop */
            sponsorCategoryData.map((category, index) => (
              <button
                onClick={() => filterCategory(category.name, index)}
                key={index}
                ref={contextIndex === index ? categoryTabRef : undefined}
                className={`${
                  categoryIndex === index + 1 ? "bg-[#cccccc] " : "bg-[#323131]"
                }  min-w-[250px]  px-4 whitespace-nowrap font-medium rounded-lg transition-all duration-150 active:scale-95`}
              >
                <p
                  className={`text-base font-semibold ${
                    categoryIndex === index + 1
                      ? "text-black"
                      : "text-[#cccccc]"
                  } transition-all duration-150`}
                >
                  {category.name}
                </p>
              </button>
            ))}
      </div>
      {isBreakPoint || (
        <button
          className={`fixed bg-[#151515] right-0 z-[200] p-4 hover:cursor-pointer`}
        >
          {
            <BiChevronRight
              size={35}
              className={`active:scale-95 mt-1 2xl:w-[100px] 4xl:w-[200px] ${
                showRightArrow ? "opacity-100" : "opacity-0"
              } duration-200 transition-all`}
              onClick={() => slideTopPicks("right")}
            />
          }
        </button>
      )}
    </div>
  );
};

export default Slider;
