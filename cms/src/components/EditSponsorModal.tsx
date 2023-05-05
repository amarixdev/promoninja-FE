import {
  ApolloQueryResult,
  OperationVariables,
  useMutation
} from "@apollo/client";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Operations } from "../graphql/operations";
import { Sponsor } from "../pages/sponsors";
import DeleteModal from "./DeleteModal";
import SelectSponsorCategory from "./SelectSponsorCategory";

interface Props {
  onOpen: () => void;
  isOpen: boolean;
  onClose: () => void;
  sponsor: Sponsor;
  sponsorsData: Sponsor[] | undefined;
  refetchSponsors: any;
  currentCategory: string;
  setCurrentCategory: Dispatch<SetStateAction<string>>;
  refetchSponsorCategory: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<any>>;
}

const EditSponsorModal = ({
  refetchSponsorCategory,
  onClose,
  isOpen,
  sponsor,
  refetchSponsors,
  currentCategory,
  setCurrentCategory,
}: Props) => {
  const finalRef = useRef(null);
  const toast = useToast();
  const [newCategory, setNewCategory] = useState("");
  const {
    onOpen: onOpenDelete,
    isOpen: isOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const [updateCategory] = useMutation(Operations.Mutations.UpdateCategory);
  const [deleteSponsor] = useMutation(Operations.Mutations.DeleteSponsor);
  const handleDeleteSponsor = async (sponsor: Sponsor | undefined) => {
    onCloseDelete();
    await deleteSponsor({
      variables: {
        input: {
          sponsor: sponsor?.name,
          category: currentCategory,
        },
      },
    });
    await refetchSponsors();

    toast({
      title: "Success.",
      description: "Deleted.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUpdate = async () => {
    await updateCategory({
      variables: {
        input: {
          newCategory,
          oldCategory: currentCategory,
          sponsorName: sponsor.name,
        },
      },
    });
    await refetchSponsors();
    await refetchSponsorCategory();
    toast({
      title: "Success.",
      description: "Updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <>
      <Box
        ref={finalRef}
        tabIndex={-1}
        aria-label="Focus moved to this box"
      ></Box>
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor={"gray"}>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <Image
                src={sponsor.imageUrl}
                width={50}
                height={50}
                alt={sponsor.name}
                className="rounded-full"
              />
              <h1 className="font-5xl font-extrabold">{sponsor.name}</h1>
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex items-center gap-4 ">
              <h1 className="font-extrabold text-xl">Category: </h1>
              <p className="font-md font-bold text-green-400">
                {currentCategory}
              </p>
            </div>
            <div className="w-full items-center justify-start flex font-bold mt-5">
              Update Category
            </div>
            <SelectSponsorCategory
              setCurrentCategory={setCurrentCategory}
              currentCategory={currentCategory}
              setNewCategory={setNewCategory}
              editing={true}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={"blue"} mr={3} onClick={handleUpdate}>
              Update
            </Button>
            <Button colorScheme={"red"} mr={3} onClick={onOpenDelete}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <DeleteModal
              isOpen={isOpenDelete}
              onClose={onCloseDelete}
              handleDeleteSponsor={handleDeleteSponsor}
              sponsor={sponsor}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditSponsorModal;
