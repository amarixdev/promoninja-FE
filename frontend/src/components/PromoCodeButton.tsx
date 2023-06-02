import { Button, useToast } from "@chakra-ui/react";

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
      description: `Promocode: ${promoCode.toUpperCase()}`,
      status: "success",
      duration: 2000,
      isClosable: true,
      colorScheme: "gray",
    });
  };

  if (!promoCode) return <div>{""}</div>;
  return (
    <div>
      <Button
        onClick={() => handleCopy(promoCode)}
        className="border-dashed border-[#e1e1e1] border-2 p-4 active:scale-95"
      >
        <p className="font-bold text-xl">{promoCode.toUpperCase()} </p>
      </Button>
    </div>
  );
};

export default PromoCodeButton;
