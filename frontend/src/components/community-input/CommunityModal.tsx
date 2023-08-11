import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import style from "../../../styles/style.module.css";
import { capitalizeString } from "../../utils/functions";
import { useMediaQuery } from "../../utils/hooks";
import emailjs from "@emailjs/browser";
import { ENV } from "../../../environment";

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
  const formRef = useRef<any>(null);
  const specialCharacterFilter = /^[a-zA-Z0-9\s]*$/;
  const onlyNumbers = /^[0-9]+$/;
  const inputType = currentSponsors ? "Sponsor" : "Podcast";
  const inputArray = currentSponsors
    ? currentSponsors
    : currentPodcasts?.map((pod) => removeTextAfterWith(pod));

  const [submitted, setSubmitted] = useState(false);
  const [userInputList, setUserInputList] = useState<string[]>([]);
  const [formHeader, setFormHeader] = useState<string | undefined>("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const isBreakPoint = useMediaQuery(1023);
  const modalSize = isBreakPoint ? "xs" : "md";
  const inputFormFontSize = isBreakPoint ? "md" : "xl";
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!isOnline) {
      setText("");
      setSubmitted(false);
      setFormHeader("Message Failed To Send: Internet Connection");
      return;
    }

    if (text === "") {
      setSubmitted(false);
      setFormHeader("");
      return;
    }

    if (caseDesensitize(userInputList)?.includes(text.toLowerCase())) {
      setSubmitted(false);
      setFormHeader("Oops, Developer Was Already Notified!");
      setText("");
    } else if (
      caseDesensitize(inputArray)?.includes(text.toLowerCase().trimEnd())
    ) {
      setSubmitted(false);
      setFormHeader(`${inputType} Already Exists`);
      setText("");
    } else if (!specialCharacterFilter.test(text)) {
      setSubmitted(false);
      setFormHeader("Sorry, No Special Characters");
      setText("");
    } else if (onlyNumbers.test(text)) {
      setSubmitted(false);
      setFormHeader("Please enter a valid character A-Z");
      setText("");
    } else if (text.length > 30) {
      setSubmitted(false);
      setFormHeader(
        ` This ${inputType.toLowerCase()} seems too long, try abbreviating.`
      );
      setText("");
    } else if (!loading) {
      setLoading(true);
      setUserInputList((prev) => [...prev, text]);
      try {
        await emailjs.sendForm(
          ENV.SERVICE_ID,
          ENV.TEMPLATE_ID,
          formRef.current,
          ENV.PUBLIC_KEY
        );
        setSubmitted(true);
        setLoading(false);
        setFormHeader(capitalizeString(text));
        setText("");
        messageRef.current?.classList.add(`${style.flashText}`);
        setTimeout(() => {
          messageRef.current?.classList.remove(`${style.flashText}`);
        }, 1000);
      } catch (error) {
        setText("");
        setFormHeader("Message Failed To Send: Server Error");
      }
    }
  };

  return (
    <>
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        colorScheme="black"
        size={modalSize}
      >
        <ModalOverlay color={"black"} />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody className="bg-gradient-to-b from-[#222222] to-[#151515] shadow-lg shadow-black">
            <div className=" w-full flex justify-center items-center">
              <div className="gap-2 flex flex-col justify-center items-center py-4">
                <h2 className="font-extrabold text-2xl ">Community Input</h2>
                <p className={`font-bold`}>
                  {loading ? (
                    <Spinner />
                  ) : formHeader && submitted ? (
                    <span className="text-white">
                      {`${inputType}:`}{" "}
                      <span className="text-orange-300"> {formHeader}</span>
                    </span>
                  ) : formHeader && !submitted ? (
                    `${formHeader}`
                  ) : inputType === "Sponsor" ? (
                    `Which sponsor did we leave out?`
                  ) : (
                    "Podcast Recommendation: "
                  )}
                </p>
              </div>
            </div>
            <form onSubmit={(e) => handleSubmit(e)} ref={formRef}>
              <Input
                name="message"
                autoFocus={true}
                focusBorderColor="#e09249"
                fontSize={inputFormFontSize}
                variant={"filled"}
                value={text}
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
                  {"Submit"}
                </Button>
              </div>
            </form>
            <div className=" mt-6 pb-10 w-full flex justify-center items-center">
              {submitted && (
                <p
                  ref={messageRef}
                  className={`font-semibold text-sm lg:text-base `}
                >
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
