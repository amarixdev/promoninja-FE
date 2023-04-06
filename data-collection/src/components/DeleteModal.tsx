import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  sponsor?: string | undefined;
  onClose: () => void;
  handleDeletePodcast?: () => Promise<void>;
  handleDeleteSponsor?: (sponsor: string | undefined) => Promise<void>;
}

const DeleteModal = ({
  isOpen,
  onClose,
  handleDeletePodcast,
  handleDeleteSponsor,
  sponsor,
}: Props) => {

  return (
    <>
      {/* <Button onClick={onOpen}>Open Modal</Button> */}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure?</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={
                handleDeletePodcast
                  ? handleDeletePodcast
                  : () => handleDeleteSponsor?.(sponsor)
              }
            >
              {handleDeletePodcast
                ? " Yes, Delete Podcast"
                : `Yes, Delete Sponsor`}
            </Button>
            <Button colorScheme={"blue"} variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteModal;
