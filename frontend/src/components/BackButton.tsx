import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useMediaQuery } from "../utils/hooks";

interface Props {
  sponsorPage?: boolean;
}

const BackButton = ({ sponsorPage }: Props) => {
  const isBreakPoint = useMediaQuery(1023);
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  if (isBreakPoint) {
    return (
      <div className="z-[999] absolute p-4" onClick={handleBack}>
        <MdOutlineKeyboardBackspace size={22} />
      </div>
    );
  } else {
    return (
      <div className={`z-[999] absolute p-6 ${sponsorPage && "left-[240px]"}`}>
        <Button
          onClick={handleBack}
          bgColor={"blackAlpha.900"}
          _hover={{ bgColor: "blackAlpha.700" }}
        >
          <MdOutlineKeyboardBackspace size={25} />
        </Button>
      </div>
    );
  }
};

export default BackButton;
