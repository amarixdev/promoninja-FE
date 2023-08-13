import React, { useEffect, useRef, useState } from "react";
import style from "../../../styles/style.module.css";
import Logo from "../../public/assets/logo.png";
import Image from "next/image";
import { Button, Tooltip, useDisclosure } from "@chakra-ui/react";
import { AiFillCloseCircle } from "react-icons/ai";
import { useMediaQuery } from "../../utils/hooks";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { NavContext } from "../../context/navContext";
import CommunityModal from "./CommunityModal";

const ChatBubble = ({
  message,
  page,
  currentSponsors,
  currentPodcasts,
}: {
  message: string;
  page: string;
  currentSponsors?: string[];
  currentPodcasts?: string[];
}) => {
  const { ninjaMode } = NavContext();
  const isBreakPoint = useMediaQuery(1023);
  const [inView, setInView] = useState(false);

  const {
    isOpen: isOpenCommunity,
    onOpen: onOpenCommunity,
    onClose: onCloseCommunity,
  } = useDisclosure();

  const toggleButtonRef = useRef<HTMLDivElement>(null);
  const navigateButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        isBreakPoint &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target) &&
        !navigateButtonRef.current?.contains(event.target)
      ) {
        setInView(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isBreakPoint]);

  const ToggleButton = () => {
    return (
      <div
        ref={toggleButtonRef}
        className=" w-full relative flex items-center justify-center select-none"
        onClick={() => {
          setInView((prev) => !prev);
        }}
      >
        <Button
          px={20}
          py={8}
          borderRadius={"xl"}
          className="active:scale-95 transition-all duration-300 ease-in-out"
        >
          <IoChatboxEllipsesOutline size={40} color="#777" />
        </Button>
      </div>
    );
  };

  const mobileImageSize = page === "sponsor" ? 50 : 70;

  return (
    <div>
      <ToggleButton />
      <CommunityModal
        isOpen={isOpenCommunity}
        onClose={onCloseCommunity}
        currentSponsors={currentSponsors}
        currentPodcasts={currentPodcasts}
      />
      {isBreakPoint ? (
        <div
          className={`  ${style.speech} ${
            style.bottom
          } px-4 pt-2 pb-6 w-[90%] ${
            inView ? "bottom-10 opacity-100" : "bottom-[-300px] opacity-50"
          } transition-all duration-[500ms] right-4 z-[100]`}
        >
          <div className="flex flex-col items-center gap-1 select-none">
            <Image
              alt="Logo"
              src={Logo}
              width={mobileImageSize}
              height={mobileImageSize}
            />
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 justify-center items-center">
                {page === "sponsor" ? (
                  <p className="font-light text-[#f1f1f1] text-sm xs:text-base sm:text-base text-center">
                    <span className="font-bold">Did you know</span> {message}
                  </p>
                ) : (
                  <p className="font-semibold text-[#f1f1f1] text-sm xs:text-base sm:text-lg">
                    {message}
                  </p>
                )}
                <button
                  className="absolute p-3 right-0 top-0 w-[40%] justify-end flex"
                  onClick={() => setInView(false)}
                >
                  {" "}
                  <AiFillCloseCircle color="#444" size={25} />
                </button>
              </div>
            </div>
          </div>
          {page === "sponsor" || (
            <Button
              className="w-full bg-[#222] mt-2 rounded-lg py-2"
              ref={navigateButtonRef}
              onClick={() => onOpenCommunity()}
            >
              <p className="text-[#f1f1f1] font-semibold active:scale-95 text-sm xs:text-base sm:text-lg">
                Click Here
              </p>
            </Button>
          )}
        </div>
      ) : (
        <div
          className={`${style.speech} ${
            style.bottom
          } max-w-[360px] pl-5 pr-10 pt-6 pb-10 ${
            inView ? "bottom-0 opacity-100" : "bottom-[-300px] opacity-50"
          } transition-all duration-[500ms] right-10 z-[999]`}
        >
          <div className="flex items-center gap-2 select-none">
            <Image alt="Logo" src={Logo} width={70} height={70} />
            <div className="flex flex-col gap-4">
              <Tooltip label="Close" placement="top">
                <button
                  className="absolute right-1 top-1 cursor-pointer"
                  onClick={() => setInView(false)}
                >
                  <AiFillCloseCircle
                    color={"#444"}
                    className="active:scale-95"
                    size={20}
                  />
                </button>
              </Tooltip>
              {page === "sponsor" ? (
                <p className=" font-light text-sm">
                  {" "}
                  <span className="font-bold">Did you know </span>
                  {message}
                </p>
              ) : (
                <p className="font-semibold text-base">{message}</p>
              )}
              {page === "sponsor" || (
                <Button onClick={() => onOpenCommunity()}>Click Here</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
