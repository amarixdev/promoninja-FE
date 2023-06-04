import { Button, useToast } from "@chakra-ui/react";
import { useCopyToClipboard, useMediaQuery } from "../utils/hooks";

interface Props {
  promoCode: string;
}

const PromoCodeButton = ({ promoCode }: Props) => {
  const { handleCopy } = useCopyToClipboard(promoCode);

  if (!promoCode) return <div>{""}</div>;
  return (
    <div>
      <Button
        onClick={() => handleCopy()}
        className="border-dashed border-[#e1e1e1] border-2 p-4 active:scale-95"
      >
        <p className="font-bold base:text-lg text-xl">
          {promoCode.toUpperCase()}{" "}
        </p>
      </Button>
    </div>
  );
};

export default PromoCodeButton;
