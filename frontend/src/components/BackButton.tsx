import { Button, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { useMediaQuery } from "../utils/hooks";
import { OptionsDrawer } from "./Header";

interface Props {
  sponsorPage?: boolean;
}

const BackButton = ({ sponsorPage }: Props) => {
  const isBreakPoint = useMediaQuery(1023);
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleBack = () => {
    router.back();
  };
  if (isBreakPoint) {
    return (
      <div className="z-[999] absolute flex justify-between w-full items-center ">
        <div className="p-3" onClick={handleBack}>
          <MdOutlineKeyboardBackspace size={24} />
        </div>
        <div className="p-3" onClick={() => onOpen()}>
          {<RxHamburgerMenu size={24} />}
        </div>

        <OptionsDrawer isOpen={isOpen} onClose={onClose} />
      </div>
    );
  } else {
    return (
      <div className={`z-[999] absolute p-6 ${sponsorPage && "left-[240px]"} `}>
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
