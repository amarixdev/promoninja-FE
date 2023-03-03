import React, { useEffect, useState } from "react";
import { useMediaQuery } from "../utils/hooks";

type Props = {};

const Footer = (props: Props) => {
  const isBreakPoint = useMediaQuery(639);
  return (
    <div
      className={
        isBreakPoint
          ? "w-full bg-[#312f2f] min-h-[75px] fixed bottom-[0] mb-0 pb-[75px]"
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
