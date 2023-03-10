import Image from "next/image";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import * as LogoText from "../public/assets/logo-text.png";
import * as Ninja4 from "../public/assets/logo.png";
import { useMediaQuery } from "../utils/hooks";

type Props = {};

const Sidebar = (props: Props) => {
  const isBreakpoint = useMediaQuery(1023);

  return (
    <div
      className={
        !isBreakpoint
          ? "w-[245px] bg-black relative z-10 overflow-clip"
          : "hidden"
      }
    >
      <div className="w-[230px] flex justify-center items-center fixed top-5">
        <Image src={Ninja4} alt="" className="h-fit mx-3" width={60} />
        <Image
          alt="/"
          src={LogoText}
          width={130}
          className="p-6 sm:p-4 relative right-7 h-fit"
        />
      </div>
    </div>
  );
};

export default Sidebar;
