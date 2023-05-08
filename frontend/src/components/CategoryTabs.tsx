import { Spinner, Tab, TabList, Tabs } from "@chakra-ui/react";
import Link from "next/link";
import { SetStateAction, useEffect, useRef, useState } from "react";
import style from "../../styles/style.module.css";
import { NavContext } from "../context/navContext";
import { SponsorCategory } from "../utils/types";
import { convertToSlug } from "../utils/functions";
import { useRouter } from "next/router";

interface Props {
  sponsorCategoryData: SponsorCategory[];
  categoryData: SponsorCategory;
  setPressed: React.Dispatch<React.SetStateAction<boolean>>;
}

const CategoryTabs = ({
  sponsorCategoryData,
  categoryData,
  setPressed,
}: Props) => {
  const [filled, setFilled] = useState(false);
  const { categoryIndex } = NavContext();

  const [shouldRender, setShouldRender] = useState(true);

  const index = sponsorCategoryData?.findIndex(
    (category) => category.name === categoryData.name
  );

  const handleScroll = () => {
    const currentScrollPosition = window.pageYOffset;
    let navbarHeight = document.getElementById("navbar")?.offsetHeight;
    if (navbarHeight) {
      navbarHeight -= 50;
    }
    if (currentScrollPosition > navbarHeight!) {
      setFilled(true);
    } else {
      setFilled(false);
    }
  };

  useEffect(() => {
    setPressed(false);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [filled]);

  if (!sponsorCategoryData) return <Spinner />;
  return (
    <div
      className={`z-[99] fixed top-0 w-full py-5 transition ease-in-out duration-500  ${
        filled && "bg-black/60 backdrop-blur-lg"
      }`}
      id="navbar"
    >
      {shouldRender ? (
        <Tabs defaultIndex={index || categoryIndex} variant={"unstyled"}>
          <TabList
            className={` ${style.offset} overflow-x-scroll scrollbar-hide px-2 relative`}
          >
            {sponsorCategoryData.map((category: SponsorCategory) => (
              <Link
                key={category.name}
                href={`/category/${convertToSlug(category.name)}`}
                className=" mx-2 rounded-2xl"
              >
                <Tab
                  className={"text-xs font-medium whitespace-nowrap "}
                  _selected={{ color: "black", bg: "white" }}
                  rounded={"xl"}
                  bg={"whiteAlpha.100"}
                >
                  <p>{category.name} </p>
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
