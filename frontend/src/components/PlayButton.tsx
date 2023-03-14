import { useDisclosure } from "@chakra-ui/react";
import Image from "next/image";
import React, { useState } from "react";
import styles from "../../styles/style.module.css";
import { SponsorData } from "../utils/types";
import Logo from "../public/assets/logo.png";
import { FaForward, FaBackward } from "react-icons/fa";

interface Props {
  sponsorData: SponsorData[];
  isActive: boolean;
  setIsActive: any;
  handleScrub: (forward: boolean) => void;
  sponsorIndex: number;
}

const PlayButton = ({
  sponsorData,
  isActive,
  setIsActive,
  handleScrub,
  sponsorIndex,
}: Props) => {
  return (
    <div className="flex flex-col items-center justify-center mt-4 absolute base:top-[320px] xs:top-[340px] sm:top-[360px] ">
      {
        <div className=" mt-2 p-6 flex flex-col items-center justify-center">
          <>
            {isActive || (
              <div className="flex justify-evenly">
                <div className="flex flex-col items-center justify-center w-full">
                  <Image
                    src={sponsorData[sponsorIndex].imageUrl || Logo}
                    width={140}
                    height={140}
                    alt="/"
                    className="rounded-3xl xs:w-[140px] base:w-[110px] sm:w-[180px] cursor-pointer"
                    onClick={() => setIsActive((prev: any) => !prev)}
                  />
                  <p className="mt-3 font-bold text-sm whitespace-nowrap">
                    {sponsorData[sponsorIndex].name}
                  </p>
                </div>
              </div>
            )}
          </>
        </div>
      }
      {/* Play Button */}

      <div className="flex justify-evenly min-w-[60vw] absolute base:top-[180px] xs:top-[200px] sm:top-[220px] my-2">
        <FaBackward
          size={40}
          className="mt-6 xs:mt-14 base:w-[25px] xs:w-[40px] active:scale-95 mr-14 cursor-pointer"
          onClick={() => handleScrub(false)}
          color={""}
        />
        <div
          className="w-fit flex flex-col items-center justify-center cursor-pointer base:mt-2 xs:mt-10"
          onClick={() => setIsActive((prev: any) => !prev)}
        >
          <div
            className={`${styles.play} ${
              isActive && styles.clicked
            } mt-4 base:w-[25px] base:h-[25px] xs:w-[40px] xs:h-[40px] bg-white cursor-pointer transition-all duration-300 ease-in-out`}
          ></div>
        </div>
        <FaForward
          size={40}
          className="mt-6 xs:mt-14 base:w-[25px] xs:w-[40px] active:scale-95 ml-14 cursor-pointer"
          onClick={() => handleScrub(true)}
        />
      </div>
      {isActive || (
        <span className="w-full text-center text-xs relative bottom-3 font-medium">
          {sponsorIndex + 1}/{sponsorData.length}
        </span>
      )}
    </div>
  );
};

export default PlayButton;
