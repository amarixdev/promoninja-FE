import {
  Button,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { SponsorCategory } from "../utils/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { NavContext } from "../context/navContext";
import style from "../../styles/style.module.css";

interface Props {
  sponsorCategoryData: SponsorCategory[];
  categoryData: SponsorCategory;
}

const CategoryTabs = ({ sponsorCategoryData, categoryData }: Props) => {
  const [filled, setFilled] = useState(false);
  const { setPageNavigate, categoryIndex, setCategoryIndex } = NavContext();

  const index = sponsorCategoryData?.findIndex(
    (category) => category.name === categoryData.name
  );

  useEffect(() => {
    setPageNavigate;
  }, []);

  const handleScroll = () => {
    const currentScrollPosition = window.pageYOffset;
    const navbarHeight = document.getElementById("navbar")?.offsetHeight;
    if (currentScrollPosition > navbarHeight!) {
      setFilled(true);
    } else {
      setFilled(false);
    }
  };


  useEffect(() => {
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
      <Tabs defaultIndex={index || categoryIndex} variant={"unstyled"}>
        <TabList
          className={` ${style.offset} overflow-x-scroll scrollbar-hide px-2 relative`}
        >
          {sponsorCategoryData.map((category: SponsorCategory) => (
            <Link key={category.name} href={`/sponsors/${category.name}`}>
              <Tab
                className={
                  "text-xs mx-2 font-medium whitespace-nowrap categoryRef"
                }
                onClick={() => setPageNavigate(false)}
                _selected={{ color: "black", bg: "white" }}
                rounded={"xl"}
                bg={"whiteAlpha.100"}
              >
                {category.name}
              </Tab>
            </Link>
          ))}
        </TabList>
      </Tabs>
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
