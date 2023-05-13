import { Spinner, Tab, TabList, Tabs } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NavContext } from "../context/navContext";
import { convertToSlug } from "../utils/functions";
import { SponsorCategory } from "../utils/types";
import { useMediaQuery } from "../utils/hooks";

interface Props {
  sponsorCategoryData: SponsorCategory[];
  categoryData: SponsorCategory;
  setPressed: React.Dispatch<React.SetStateAction<boolean>>;
  pressed: boolean;
}

const CategoryTabs = ({
  sponsorCategoryData,
  categoryData,
  setPressed,
  pressed,
}: Props) => {
  const [filled, setFilled] = useState(false);
  const { categoryIndex } = NavContext();

  const [shouldRender, setShouldRender] = useState(true);

  const index = sponsorCategoryData?.findIndex(
    (category) => category.name === categoryData.name
  );

  const TabRef = useRef<HTMLDivElement>(null);
  const tab = TabRef.current;
  const isBreakPoint = useMediaQuery(1023);

  useEffect(() => {
    console.log(pressed);
    setPressed(false);
    if (tab && !isBreakPoint) {
      tab.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
    if (tab && isBreakPoint) {
      console.log(tab);
      tab.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [tab, isBreakPoint, index, categoryIndex]);

  if (!sponsorCategoryData) return <Spinner />;
  return (
    <div
      className={`z-[99] fixed top-0 shadow-2xl py-8 transition ease-in-out duration-300 overflow-x-scroll scrollbar-hide flex justify-center  ${
        !filled && ""
      }`}
      id="navbar"
    >
      {shouldRender ? (
        <Tabs
          defaultIndex={index || categoryIndex}
          variant={"unstyled"}
          className="lg:w-[98%] w-full overflow-x-scroll scrollbar-hide px-[40%] xs:px-[40%] sm:px-[30%] md:px-[20%] lg:px-[10%]"
        >
          <TabList className={` relative w-fit overflow-x-auto`}>
            {sponsorCategoryData.map((category: SponsorCategory, i) => (
              <Link
                key={category.name}
                href={`/category/${convertToSlug(category.name)}`}
                className="mx-2 rounded-2xl"
              >
                <Tab
                  className={
                    "text-xs text-[#cdcdcd] font-medium whitespace-nowrap "
                  }
                  _selected={{ color: "black", bg: "#cdcdcd" }}
                  rounded={"xl"}
                  bg={"#222222"}
                  tabIndex={categoryIndex}
                >
                  <div
                    ref={
                      index === i || categoryIndex === i ? TabRef : undefined
                    }
                  >
                    <p>{category.name} </p>
                  </div>
                </Tab>
              </Link>
            ))}
          </TabList>
        </Tabs>
      ) : null}
    </div>
  );
};

export default CategoryTabs;

export const getStaticPaths = async () => {
  const paths = [{ params: { sponsorCategory: "" } }];
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }: any) => {
  const { sponsorCategory: category } = params;

  return {
    props: {
      category,
    },
  };
};
