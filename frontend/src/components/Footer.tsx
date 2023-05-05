import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../utils/hooks";
import { BiPodcast, BiSearch } from "react-icons/bi";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { IoMdContact } from "react-icons/io";
import styles from "../../styles/style.module.css";
import { HiOutlineShoppingCart } from "react-icons/hi";

import Link from "next/link";
import { NavContext } from "../context/navContext";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { useRouter } from "next/router";
import { IconType } from "react-icons/lib";
import { RiSearch2Fill, RiSearch2Line } from "react-icons/ri";
import { RiHome2Fill } from "react-icons/ri";

export interface LinkWrapperProps {
  href: string;
  activeIcon: IconType;
  icon: IconType;
  pageTitle: string;
  current?: "home" | "podcasts" | "search";
}

const Footer = () => {
  const { currentPage, setPageNavigate } = NavContext();
  const isBreakPoint = useMediaQuery(1023);
  const { pathname } = useRouter();

  const LinkWrapper = ({
    href,
    activeIcon: ActiveIcon,
    icon: Icon,
    pageTitle,
    current,
  }: LinkWrapperProps) => {

    if (href == pathname) {
      return (
        <div className={`flex flex-col items-center`}>
          {currentPage[current || "home"] ? (
            <ActiveIcon
              color={"#d6d6d6"}
              size={24}
              className={`text-[#d6d6d6] active:scale-95 relative base:w-[22px] xs:w-[24px] `}
            />
          ) : (
            <Icon
              color={"#e3e3e3ae"}
              size={24}
              className={`relative active:scale-95 base:w-[22px] xs:w-[24px]`}
            />
          )}
          <p
            className={`base:text-[10px] xs:text-xs font-medium ${
              currentPage[current || "home"]
                ? "text-[#d6d6d6]"
                : "text-[#e3e3e3ae]"
            }`}
          >
            {pageTitle}
          </p>
        </div>
      );
    }
    return (
      <Link href={href} className={`flex flex-col items-center `}>
        {currentPage[current || "home"] ? (
          <ActiveIcon
            color={"#d6d6d6"}
            size={24}
            className={`text-[#d6d6d6] active:scale-95 relative base:w-[22px] xs:w-[24px] `}
          />
        ) : (
          <Icon
            color={"#e3e3e3ae"}
            size={24}
            className={`relative  active:scale-95 base:w-[22px] xs:w-[24px] `}
          />
        )}
        <p
          className={`base:text-[10px] xs:text-xs font-medium ${
            currentPage[current || "home"]
              ? "text-[#d6d6d6]"
              : "text-[#e3e3e3ae]"
          }`}
        >
          {pageTitle}
        </p>
      </Link>
    );
  };

  return (
    <div
      onClick={() => setPageNavigate(true)}
      className={
        isBreakPoint
          ? `w-[100vw] fixed bottom-[0] bg-black/60 backdrop-blur-md`
          : "hidden"
      }
    >
      <div className="flex justify-evenly relative items-center base:h-[60px] xs:h-[70px] ">
        <LinkWrapper
          href="/"
          activeIcon={AiFillHome}
          icon={AiOutlineHome}
          pageTitle="Home"
          current="home"
        />
        <LinkWrapper
          href="/search"
          activeIcon={RiSearch2Fill}
          icon={RiSearch2Line}
          pageTitle="Search"
          current="search"
        />

        <LinkWrapper
          href="/podcasts"
          activeIcon={BiPodcast}
          icon={BiPodcast}
          pageTitle="Podcasts"
          current="podcasts"
        />

        <LinkWrapper
          href=""
          activeIcon={IoMdContact}
          icon={IoMdContact}
          pageTitle="About"
        />
      </div>
    </div>
  );
};

export default Footer;
