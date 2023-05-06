import { Button, useToast } from "@chakra-ui/react";
import React from "react";

interface Props {
  promoCode: string;
}

const PromoCodeButton = ({ promoCode }: Props) => {
  const toast = useToast();

  const handleCopy = async (promoCode: string) => {
    try {
      await navigator.clipboard.writeText(promoCode);
      CopyToast();
    } catch (error) {
      console.error("Failed to copy");
    }
  };

  const CopyToast = () => {
    return toast({
      title: "Copied To Clipboard",
      description: `Thanks for supporting the Podcast! `,
      status: "success",
      duration: 9000,
      isClosable: true,
      colorScheme: "gray",
    });
  };

  if (!promoCode) return <div>{""}</div>;
  return (
    <div>
      <Button
        onClick={() => handleCopy(promoCode)}
        className=" border-dashed border-white border-2 p-4 active:scale-95"
      >
        <p className="font-extrabold text-xl">{promoCode.toUpperCase()} </p>
      </Button>
    </div>
  );
};

export default PromoCodeButton;
