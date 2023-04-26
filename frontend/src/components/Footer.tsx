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
import { BsSearch } from "react-icons/bs";

const Footer = (href: any) => {
  const { homePage, setPageNavigate } = NavContext();
  const isBreakPoint = useMediaQuery(1023);
  const { pathname } = useRouter();
  console.log(pathname === "/");

  interface LinkWrapperProps {
    href: string;
    activeIcon: IconType;
    icon: IconType;
    page: string;
    homeButton?: boolean;
  }

  const LinkWrapper = ({
    href,
    activeIcon: ActiveIcon,
    icon: Icon,
    page,
    homeButton,
  }: LinkWrapperProps) => {
    if (href == pathname) {
      return (
        <div className={`flex flex-col items-center ${styles.hoverIcon}`}>
          {homeButton && homePage ? (
            <ActiveIcon
              color={"#e3e3e3ae"}
              size={24}
              className={`relative base:w-[22px] xs:w-[24px] ${styles.hoverIcon}`}
            />
          ) : (
            <Icon
              color={"#e3e3e3ae"}
              size={24}
              className={`relative base:w-[22px] xs:w-[24px] ${styles.hoverIcon}`}
            />
          )}
          <p className="base:text-[10px] xs:text-xs font-medium text-[#e3e3e3ae]">
            Home
          </p>
        </div>
      );
    }
    return (
      <Link
        href={href}
        className={`flex flex-col items-center ${styles.hoverIcon}`}
      >
        {homeButton && homePage ? (
          <ActiveIcon
            color={"#e3e3e3ae"}
            size={24}
            className={`relative base:w-[22px] xs:w-[24px] ${styles.hoverIcon}`}
          />
        ) : (
          <Icon
            color={"#e3e3e3ae"}
            size={24}
            className={`relative base:w-[22px] xs:w-[24px] ${styles.hoverIcon}`}
          />
        )}
        <p className="base:text-[10px] xs:text-xs font-medium text-[#e3e3e3ae]">
          Home
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
          page="Home"
          homeButton={true}
        />
        <LinkWrapper
          href="/search"
          activeIcon={BsSearch}
          icon={BiSearch}
          page="Search"
        />

        <LinkWrapper
          href="/podcasts"
          activeIcon={BiPodcast}
          icon={BiPodcast}
          page="Podcasts"
        />

        <LinkWrapper
          href="/"
          activeIcon={IoMdContact}
          icon={IoMdContact}
          page="About"
        />
      </div>
    </div>
  );
};

export default Footer;
