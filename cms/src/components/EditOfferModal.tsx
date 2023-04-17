import {
  ApolloQueryResult,
  OperationVariables,
  useMutation,
  useQuery,
} from "@apollo/client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Operations } from "../graphql/operations";
import { AiFillCloseCircle, AiFillEdit } from "react-icons/ai";
import DeleteModal from "./DeleteModal";
import { off } from "process";
import { OfferData } from "../utils/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  podcastTitle: string;
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<any>>;
};

interface Data {
  getPodcast: {
    sponsor: string;
    backgroundColor: string;
    imageUrl: string;
    publisher: string;
    description: string;
    offer: OfferData[];
  };
}

const EditModal = ({ isOpen, onClose, podcastTitle, refetch }: Props) => {
  const toast = useToast();
  const {
    data,
    loading,
    refetch: refetchPodcast,
  } = useQuery<Data>(Operations.Queries.GetPodcast, {
    variables: { input: { podcast: podcastTitle } },
  });
  const [deletePodcastSponsor] = useMutation(
    Operations.Mutations.DeletePodcastSponsor
  );
  const [updateOffers] = useMutation(Operations.Mutations.UpdateOffers);
  const [sponsorToDelete, setSponsorToDelete] = useState<string | undefined>(
    ""
  );
  const [offerStates, setOfferStates] = useState<any>({});
  const [editing, setEditing] = useState("");
  const {
    onOpen: onOpenSponsor,
    isOpen: isOpenSponsor,
    onClose: onCloseSponsor,
  } = useDisclosure();

  const { refetch: refetchSponsors } = useQuery(
    Operations.Queries.FetchSponsors,
    {
      variables: {
        input: { podcast: podcastTitle },
      },
    }
  );

  useEffect(() => {
    if (!loading && data) {
      const podcastOffers = data?.getPodcast.offer;
      const initOfferStates = podcastOffers.map((offer: OfferData) => ({
        sponsor: offer.sponsor,
        url: offer.url,
        promoCode: offer.promoCode,
      }));
      setOfferStates(initOfferStates);
    }
  }, [loading, data]);

  if (loading) {
    return <Spinner />;
  }

  const handleEditing = (offerInput: string) => {
    setEditing(offerInput);
    if (editing === offerInput) {
      setEditing("");
    }
  };

  const handleChange = (event: any, index: number, type: string) => {
    const newStates = [...offerStates];

    if (type === "url") {
      newStates[index].url = event.target.value;
    }
    if (type === "sponsor") {
      newStates[index].sponsor = event.target.value;
    }

    if (type === "promoCode") {
      newStates[index].promoCode = event.target.value;
    }

    setOfferStates(newStates);
  };

  const handleUpdate = async () => {
    try {
      const status = await updateOffers({
        variables: {
          input: {
            podcast: podcastTitle,
            offer: offerStates,
          },
        },
      });

      await refetchPodcast();

      if (status) {
        toast({
          title: "Success.",
          description: "Updated Successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      if (err) {
        toast({
          title: "Error",
          description: "Failed to update",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      console.log(err);
    }
  };

  const openDeleteModal = (sponsor: string) => {
    setSponsorToDelete(sponsor);
    onOpenSponsor();
  };

  const handleDeletePodcastSponsor = async (sponsor: string | undefined) => {
    try {
      await deletePodcastSponsor({
        variables: {
          input: {
            sponsor: sponsorToDelete,
            podcast: podcastTitle,
          },
        },
      });
      toast({
        title: "Success.",
        description: "Deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await refetchPodcast();
      await refetchSponsors();
      onCloseSponsor();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <DeleteModal
          isOpen={isOpenSponsor}
          onClose={onCloseSponsor}
          handleDeletePodcastSponsor={handleDeletePodcastSponsor}
          podcastSponsor={sponsorToDelete}
        />
        <ModalOverlay />
        <ModalContent bgColor={"#aaaaaa"}>
          <ModalHeader className="tracking-wider">{podcastTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="h-[250px] overflow-y-scroll">
              <h1 className="font-extrabold text-3xl ">Edit Offers</h1>
              {data?.getPodcast.offer.map((offer: OfferData, index: number) => (
                <div
                  className="w-full p-2 flex flex-col font-medium border-b-[1px] border-black"
                  key={offer.sponsor}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {editing !== offer.sponsor ? (
                        <p className="font-bold text-lg">
                          {offerStates[index]?.sponsor}
                        </p>
                      ) : (
                        <Input
                          value={offerStates[index].sponsor}
                          type="text"
                          h="30px"
                          w={"fit"}
                          onChange={(e) => handleChange(e, index, "sponsor")}
                          onBlur={() => setEditing("")}
                          className="font-bold"
                        />
                      )}
                      <AiFillEdit
                        className="ml-4 hover:cursor-pointer"
                        onClick={() => handleEditing(offer.sponsor)}
                      />
                    </div>
                    <Tooltip label="Delete">
                      <div>
                        <AiFillCloseCircle
                          className="relative right-10 hover:cursor-pointer"
                          onClick={() => openDeleteModal(offer.sponsor)}
                        />
                      </div>
                    </Tooltip>
                  </div>
                  <div className="flex items-center">
                    {editing !== offer.url ? (
                      <p className="font-medium text-lg">
                        {offerStates[index]?.url}
                      </p>
                    ) : (
                      <Input
                        value={offerStates[index]?.url}
                        type="text"
                        h="30px"
                        w={"fit"}
                        onChange={(e) => handleChange(e, index, "url")}
                        onBlur={() => setEditing("")}
                      />
                    )}
                    <AiFillEdit
                      className="ml-4 hover:cursor-pointer"
                      onClick={() => handleEditing(offer.url)}
                    />
                  </div>
                  <div className="flex items-center pt-2 w-[250px]">
                    {editing !== offer.promoCode ? (
                      <p className="text-sm font-light">
                        {offerStates[index]?.promoCode}
                      </p>
                    ) : (
                      <Textarea
                        value={offerStates[index]?.promoCode}
                        onChange={(e) => handleChange(e, index, "promoCode")}
                        className="text-sm font-light"
                        onBlur={() => setEditing("")}
                      />
                    )}
                    <AiFillEdit
                      className="ml-4 hover:cursor-pointer w-10"
                      onClick={() => handleEditing(offer.promoCode)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditModal;
