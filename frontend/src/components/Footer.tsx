import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../utils/hooks";
import { HiHome } from "react-icons/hi";
import { BiPodcast, BiSearch } from "react-icons/bi";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { IoMdContact } from "react-icons/io";
import styles from "../../styles/style.module.css";

import Link from "next/link";

const Footer = () => {
  const isBreakPoint = useMediaQuery(1023);
  return (
    <div
      className={
        isBreakPoint
          ? `w-[100vw] bg-[#212124ae] fixed bottom-[0] footer backdrop-blur-md`
          : "hidden"
      }
    >
      <div className="flex justify-evenly relative items-center base:h-[60px] xs:h-[70px] ">
        <Link href={"/"} className="flex flex-col items-center">
          <HiHome
            color={"#b8b8b8ae"}
            size={28}
            className="relative base:w-[22px] xs:w-[28px]"
          />
          <p className="base:text-[10px] xs:text-xs font-medium text-[#b8b8b8ae]">
            Home
          </p>
        </Link>
        <Link href={"/podcasts"} className="flex flex-col items-center">
          <BiPodcast
            color={"#b8b8b8ae"}
            size={28}
            className="relative base:w-[22px] xs:w-[28px]"
          />
          <p className="base:text-[10px] xs:text-xs font-medium text-[#b8b8b8ae]">
            Podcasts
          </p>
        </Link>
        <Link href="/" className="flex flex-col items-center">
          <RiMoneyDollarCircleFill
            color={"#b8b8b8ae"}
            size={28}
            className="relative base:w-[22px] xs:w-[28px]"
          />
          <p className="base:text-[10px] xs:text-xs font-medium text-[#b8b8b8ae]">
            Sponsors
          </p>
        </Link>
        <Link href="/" className="flex flex-col items-center">
          <IoMdContact
            color={"#b8b8b8ae"}
            size={28}
            className="relative base:w-[22px] xs:w-[28px]"
          />
          <p className="base:text-[10px] xs:text-xs font-medium text-[#b8b8b8ae]">
            About
          </p>
        </Link>
        <Link href="/" className="flex flex-col items-center">
          <BiSearch
            color={"#b8b8b8ae"}
            size={28}
            className="relative base:w-[22px] xs:w-[28px]"
          />
          <p className="base:text-[10px] xs:text-xs font-medium text-[#b8b8b8ae]">
            Search
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
