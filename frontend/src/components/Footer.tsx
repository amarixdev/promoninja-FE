import React, { useEffect, useState } from "react";
import { useMediaQuery } from "../utils/hooks";

type Props = {};

const Footer = (props: Props) => {
  const isBreakPoint = useMediaQuery(1023);
  return (
    <div
      className={
        isBreakPoint
          ? "w-full bg-[#312f2f] fixed bottom-[0] mb-0 pb-[60px]"
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
