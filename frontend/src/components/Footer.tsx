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

const Footer = () => {
  const { homePage, setHomePage } = NavContext();
  const isBreakPoint = useMediaQuery(1023);
  return (
    <div
      className={
        isBreakPoint
          ? `w-[100vw] bg-[#0e0e0eae] fixed bottom-[0] backdrop-blur-md`
          : "hidden"
      }
    >
      <div className="flex justify-evenly relative items-center base:h-[60px] xs:h-[70px] ">
        <Link
          href={"/"}
          className={`flex flex-col items-center ${styles.hoverIcon}`}
        >
          {homePage ? (
            <AiFillHome
              color={"#e3e3e3ae"}
              size={24}
              className={`relative base:w-[22px] xs:w-[24px] ${styles.hoverIcon}`}
            />
          ) : (
            <AiOutlineHome
              color={"#e3e3e3ae"}
              size={24}
              className={`relative base:w-[22px] xs:w-[24px] ${styles.hoverIcon}`}
            />
          )}
          <p className="base:text-[10px] xs:text-xs font-medium text-[#e3e3e3ae]">
            Home
          </p>
        </Link>
        <Link href="/search" className="flex flex-col items-center">
          <BiSearch
            color={"#e3e3e3ae"}
            size={24}
            className="relative base:w-[22px] xs:w-[24px]"
          />
          <p className="base:text-[10px] xs:text-xs font-medium text-[#e3e3e3ae]">
            Search
          </p>
        </Link>
        <Link href={"/podcasts"} className="flex flex-col items-center">
          <BiPodcast
            color={"#e3e3e3ae"}
            size={24}
            className={`relative base:w-[22px] xs:w-[24px] ${styles.hoverIcon}`}
          />
          <p className="base:text-[10px] xs:text-xs font-medium text-[#e3e3e3ae]">
            Podcasts
          </p>
        </Link>
        <Link href="/" className="flex flex-col items-center">
          <IoMdContact
            color={"#e3e3e3ae"}
            size={24}
            className="relative base:w-[22px] xs:w-[24px]"
          />
          <p className="base:text-[10px] xs:text-xs font-medium text-[#e3e3e3ae]">
            About
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
