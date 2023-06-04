import {
  Button,
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import style from "../../styles/style.module.css";
import { useMediaQuery } from "../utils/hooks";

const BrokenLinkModal = ({
  isOpen,
  onClose,
  selected,
  notified,
  podcastState,
  setPodcastState,
}: {
  isOpen: boolean;
  selected: string;
  onClose: () => void;
  notified: boolean;
  podcastState: string[];
  setPodcastState: Dispatch<SetStateAction<string[]>>;
}) => {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = () => {
    if (!brokenLink && !expired) {
      return;
    }
    setPodcastState((prev: string[]) => [...prev, selected]);
    setSubmitted(true);
    setBrokenLink(false);
    setExpired(false);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const [brokenLink, setBrokenLink] = useState(false);
  const [expired, setExpired] = useState(false);

  const handleIssue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "broken_link") {
      setBrokenLink((prev) => !prev);
    }
    if (value === "expired") {
      setExpired((prev) => !prev);
    }
  };

  if (notified && podcastState.includes(selected)) {
    console.log("NOTIFIED");
  }

  const isBreakPoint = useMediaQuery(1023);
  const [modalSize, setModalSize] = useState("");

  useEffect(() => {
    if (isBreakPoint) {
      setModalSize("xs");
    } else {
      setModalSize("md");
    }
  }, [isBreakPoint]);

  console.log(modalSize);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        colorScheme={"gray"}
        blockScrollOnMount={false}
        isCentered
        size={modalSize}
      >
        <ModalOverlay />
        <ModalContent bgGradient="linear(to-b, #222222, #151515)" className="">
          <ModalHeader>{`${
            !notified && submitted && podcastState.includes(selected)
              ? "Thanks, Developer Notified!"
              : notified && podcastState.includes(selected)
              ? "The Developer Has Been Notified!"
              : "What's Wrong?"
          }`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!notified && submitted && podcastState.includes(selected) ? (
              <CheckboxGroup colorScheme="orange" isDisabled>
                <Stack spacing={[1, 5]} direction={["column"]}>
                  <Checkbox value="broken_link">Broken Link</Checkbox>
                  <Checkbox value="expired">Expired Promotion</Checkbox>
                </Stack>
              </CheckboxGroup>
            ) : notified && podcastState.includes(selected) ? (
              <CheckboxGroup colorScheme="orange"></CheckboxGroup>
            ) : (
              <CheckboxGroup colorScheme="orange">
                <Stack spacing={[1, 5]} direction={["column"]}>
                  <Checkbox
                    value="broken_link"
                    onChange={(e) => handleIssue(e)}
                  >
                    Broken Link
                  </Checkbox>
                  <Checkbox value="expired" onChange={(e) => handleIssue(e)}>
                    Expired Promotion
                  </Checkbox>
                </Stack>
              </CheckboxGroup>
            )}
            {notified && podcastState.includes(selected) && (
              <div className="flex flex-col gap-6">
                <p className="font-semibold">
                  This link will be fixed as soon as possible...
                </p>
                <div className="w-full items-center flex justify-center">
                  <span className={`${style.broken}`}></span>
                </div>
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="orange"
              className={`${
                submitted && podcastState.includes(selected)
                  ? "active:scale-100"
                  : "active:scale-95"
              }`}
              onClick={() => handleSubmit()}
              isDisabled={submitted && podcastState.includes(selected)}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BrokenLinkModal;
