import { Spinner, Tab, TabList, Tabs } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import client from "../graphql/apollo-client";
import { Operations } from "../graphql/operations";
import { SponsorCategory } from "../utils/types";
import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { NavContext } from "../context/navContext";

interface Props {
  sponsorCategoryData: SponsorCategory[];
}

const CategoryTabs = ({ sponsorCategoryData }: Props) => {
  const [filled, setFilled] = useState(false);
  const { setPageNavigate } = NavContext();

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
      <Tabs>
        <TabList className="overflow-x-scroll scrollbar-hide px-2 relative">
          {sponsorCategoryData.map((category: SponsorCategory) => (
            <Link key={category.name} href={`/sponsors/${category.name}`}>
              <Tab
                className="text-xs font-light whitespace-nowrap"
                onClick={() => setPageNavigate(false)}
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
