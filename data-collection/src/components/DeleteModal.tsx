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
import { Sponsor } from "../pages/sponsors";

interface Props {
  isOpen: boolean;
  podcastSponsor?: string | undefined;
  sponsor?: Sponsor | undefined;
  onClose: () => void;
  handleDeletePodcast?: () => Promise<void>;
  handleDeletePodcastSponsor?: (
    podcastSponsor: string | undefined
  ) => Promise<void>;
  handleDeleteSponsor?: (podcastSponsor: Sponsor | undefined) => Promise<void>;
}

const DeleteModal = ({
  isOpen,
  onClose,
  handleDeletePodcast,
  handleDeletePodcastSponsor,
  handleDeleteSponsor,
  podcastSponsor,
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
                  : handleDeletePodcastSponsor
                  ? () => handleDeletePodcastSponsor?.(podcastSponsor)
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
