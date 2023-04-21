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
  useToast,
} from "@chakra-ui/react";
import React, { Dispatch } from "react";
import SelectCategory from "./SelectCategory";
import {
  REDUCER_ACTION_TYPE,
  ReducerAction,
  initState,
} from "../utils/reducer";
import {
  ApolloQueryResult,
  OperationVariables,
  useMutation,
} from "@apollo/client";
import { Operations } from "../graphql/operations";
import SelectSponsorCategory from "./SelectSponsorCategory";

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  sponsor: string;
  oldCategory: string;
  dispatch: Dispatch<ReducerAction>;
  state: typeof initState;
  refetchCurrentPodcast: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<any>>;
}

function EditSponsorCategory({
  isOpen,
  onOpen,
  onClose,
  sponsor,
  oldCategory,
  state,
  dispatch,
  refetchCurrentPodcast,
}: Props) {
  const finalRef = React.useRef(null);
  const toast = useToast();

  const [updateCategory] = useMutation(Operations.Mutations.UpdateCategory);

  const handleUpdate = async (newCategory: string, oldCategory: string) => {
    try {
      const { data } = await updateCategory({
        variables: {
          input: {
            newCategory,
            oldCategory,
            sponsorName: sponsor,
          },
        },
      });

      const status = data.updateCategory;

      if (status) {
        toast({
          title: "Success.",
          description: "Updated Successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      }
      dispatch({
        type: REDUCER_ACTION_TYPE.UPDATE_CURRENT_PODCAST,
        payload: { category: newCategory },
      });
      await refetchCurrentPodcast();
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

  return (
    <>
      <Box ref={finalRef} tabIndex={-1} aria-label="Focus moved to this box">
        {/* Some other content that'll receive focus on close. */}
      </Box>
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor={"#222"} color={"white"}>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SelectSponsorCategory setSponsor={setSponsor} />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleUpdate(state.category, oldCategory)}
            >
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
}

export default EditSponsorCategory;
