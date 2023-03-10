import { Button, useDisclosure } from "@chakra-ui/react";
import Image from "next/image";
import React, { useState } from "react";
import styles from "../../styles/style.module.css";
import { SponsorData } from "../utils/types";
import Logo from "../public/assets/logo.png";
import { FaForward, FaBackward } from "react-icons/fa";

interface Props {
  sponsorData: SponsorData[];
}

const PlayButton = ({ sponsorData }: Props) => {
  const [sponsorName, setSponsorName] = useState("");

  const [isActive, setIsActive] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <div
        className="w-full flex flex-col items-center justify-center cursor-pointer"
        onClick={() => setIsActive((prev) => !prev)}
      >
        <div
          className={`${styles.play} ${
            isActive && styles.clicked
          } mt-4 w-[40px] h-[40px] bg-white cursor-pointer transition-all duration-300 ease-in-out`}
        ></div>
        {isActive || <h1 className="font-bold py-4 mt-2">Show Sponsors</h1>}
      </div>
      {isActive && (
        <div className=" mt-2 p-6 flex flex-col items-center justify-center">
          {sponsorData.map((sponsor) => (
            <div className="flex justify-evenly">
              <FaBackward size={50} className="mt-14 mr-10 active:scale-95" />
              <div className="flex flex-col items-center justify-center w-full">
                <Image
                  src={sponsor.imageUrl || Logo}
                  width={140}
                  height={140}
                  alt="/"
                  className="rounded-3xl xs:w-[140px] base:w-[110px] sm:w-[220px]"
                />
                <p className="mt-3 font-semibold">{sponsor.name}</p>
              </div>
              <FaForward size={50} className="mt-14 ml-10 active:scale-95" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayButton;
