import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../../utils/hooks";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

export const ToggleChat = () => {
  const toggleButtonRef = useRef<HTMLDivElement>(null);
  const isBreakPoint = useMediaQuery(1023);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        isBreakPoint &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setInView(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isBreakPoint]);
  return (
    <div
      ref={toggleButtonRef}
      className=" w-full relative flex items-center justify-center select-none"
      onClick={() => {
        setInView((prev) => !prev);
      }}
    >
      <div
        className={` relative active:scale-95 w-[50%] lg:w-[30%] rounded-lg flex justify-center items-center cursor-pointer gap-3 py-2 bg-gradient-to-r from-[#2c2c2c] to-[#202020] lg:hover:bg-gradient-t-b lg:hover:to-[#2f2f2f] lg:hover:from-[#3b3b3b] shadow-lg shadow-black active:shadow-none transition-all duration-150 ease-in-out`}
      >
        <IoChatboxEllipsesOutline size={50} color="#777" />
      </div>
    </div>
  );
};




