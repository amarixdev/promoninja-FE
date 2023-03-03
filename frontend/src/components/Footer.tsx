import React, { useEffect, useState } from "react";
import useScreenWidth from "../utils/hooks";

type Props = {};

const Footer = (props: Props) => {
  const screenWidth = useScreenWidth();
  
  return (
    <div
      className={
        screenWidth <= 640
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
