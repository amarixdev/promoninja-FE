import React, { useEffect, useState } from "react";
import { useMediaQuery } from "../utils/hooks";

type Props = {};

const Footer = (props: Props) => {
  const isBreakPoint = useMediaQuery(1023);
  return (
    <div
      className={
        isBreakPoint
          ? "w-[100%] bg-[#312f2f] fixed bottom-[0] base:pb-[50px] xs:pb-[60px] sm:pb-[65px]"
          : "hidden"
      }
    >
      <div>
        <div></div>
      </div>
    </div>
  );
};

export default Footer;
