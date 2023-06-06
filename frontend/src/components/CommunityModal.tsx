import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import style from "../../styles/style.module.css";
import { capitalizeString } from "../utils/functions";

const CommunityModal = ({
  isOpen,
  onClose,
  currentSponsors,
  currentPodcasts,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentSponsors?: string[];
  currentPodcasts?: string[];
}) => {
  const removeTextAfterWith = (input: string): string => {
    const withIndex = input.toLowerCase().indexOf("with");
    if (withIndex !== -1) {
      input = input.substring(0, withIndex).trim();
    }
    return input.replace(/'/g, "");
  };

  const caseDesensitize = (array: string[] | undefined) => {
    return array?.map((string) => string.toLowerCase());
  };

  const messageRef = useRef<HTMLParagraphElement>(null);
  const specialCharacterFilter = /^[a-zA-Z0-9\s]*$/;
  const onlyNumbers = /^[0-9]+$/;
  const inputType = currentSponsors ? "Sponsor" : "Podcast";
  const inputArray = currentSponsors
    ? currentSponsors
    : currentPodcasts?.map((pod) => removeTextAfterWith(pod));

  const [submitted, setSubmitted] = useState(false);
  const [userInputList, setUserInputList] = useState<string[]>([]);
  const [formHeader, setFormHeader] = useState<string | undefined>("");
  const [error, setError] = useState(false);
  const [text, setText] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (text === "") {
      return;
    }

    if (caseDesensitize(userInputList)?.includes(text.toLowerCase())) {
      setError(true);
      setFormHeader("Oops, Developer Was Already Notified!");
      setText("");
    } else if (
      caseDesensitize(inputArray)?.includes(text.toLowerCase().trimEnd())
    ) {
      setError(true);
      setFormHeader(`${inputType} Already Exists`);
      setText("");
    } else if (!specialCharacterFilter.test(text)) {
      setError(true);
      setFormHeader("Sorry, No Special Characters");
      setText("");
    } else if (onlyNumbers.test(text)) {
      setError(true);
      setFormHeader("Please enter a valid character A-Z");
      setText("");
    } else if (text.length > 30) {
      setError(true);
      setFormHeader(
        ` This ${inputType.toLowerCase()} seems too long, try abbreviating.`
      );
      setText("");
    } else {
      setUserInputList((prev) => [...prev, text]);
      setError(false);
      setSubmitted(true);
      if (text) {
      }
      setFormHeader(capitalizeString(text));
      setText("");

      messageRef.current?.classList.add(`${style.flashText}`);
      setTimeout(() => {
        messageRef.current?.classList.remove(`${style.flashText}`);
      }, 1000);
    }
  };

  return (
    <>
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        colorScheme="black"
      >
        <ModalOverlay color={"black"} />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody className="bg-gradient-to-b from-[#222222] to-[#151515] shadow-lg shadow-black">
            <div className=" w-full flex justify-center items-center">
              <div className="gap-2 flex flex-col justify-center items-center py-4">
                <p className="font-extrabold text-2xl ">Community Input</p>
                <p
                  className={`${
                    formHeader && !error && "text-orange-300"
                  } font-bold`}
                >
                  {formHeader ? formHeader : `Add ${inputType}`}
                </p>
              </div>
            </div>
            <form onSubmit={(e) => handleSubmit(e)}>
              <Input
                autoFocus={true}
                focusBorderColor="#e09249"
                fontSize={"2xl"}
                variant={"filled"}
                value={text}
                placeholder={`${inputType}`}
                onChange={(e) => {
                  setText(e.target.value);
                }}
              />
              <div className="flex w-full justify-center">
                <Button
                  mt={10}
                  colorScheme="orange"
                  className={` active:scale-95`}
                  onClick={(e) => handleSubmit(e)}
                >
                  <p className="transition-all duration-300 ease-in">
                    {" "}
                    {"Submit"}
                  </p>
                </Button>
              </div>
            </form>
            <div className=" mt-6 pb-10 w-full flex justify-center items-center">
              {submitted && (
                <p ref={messageRef} className={`font-semibold `}>
                  {" "}
                  Thanks, the developer will be notified!
                </p>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CommunityModal;
