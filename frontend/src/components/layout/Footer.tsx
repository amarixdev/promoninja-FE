import React from "react";
import { BsSpotify } from "react-icons/bs";
import { currentYear } from "../../utils/functions";

const Footer = () => {
  return (
    <div className="flex pb-6 flex-col gap-1 font-bold text-[#9f9f9f] text-xs items-center justify-center">
      <p className="flex mt-10 font-bold text-[#9f9f9f] text-xs w-full items-center justify-center lg:px-4">
        {`© PromoNinja ${currentYear}`}
      </p>

      <div className=" font-semibold flex items-center gap-1 text-xsm ">
        Powered By Spotify <BsSpotify />
      </div>
    </div>
  );
};

export default Footer;
