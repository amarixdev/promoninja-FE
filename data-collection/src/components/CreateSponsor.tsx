import { gql, useMutation } from "@apollo/client";
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Input,
  InputGroup,
  Stack,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Operations } from "../graphql/operations";

interface Props {
  podcast: string;
  category: string;
  displaySubmit: boolean;
  createPodcast: ({}) => void;
}

const CreateSponsor = ({
  podcast,
  category,
  createPodcast,
  displaySubmit,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = useRef(null);
  // const { sponsor, setSponsor } = useContext(AppContext);
  const [sponsor, setSponsor] = useState({
    name: "",
    url: "",
    description: "",
  });
  const toast = useToast();

  const [createSponsor, { loading, error }] = useMutation(
    Operations.Mutations.CreateSponsor
  );

  const handleSubmit = async () => {
    console.log("sponsor", sponsor);

    createSponsor({
      variables: {
        input: {
          podcast,
          sponsor,
          category,
        },
      },
    });

    setSponsor({ description: "", name: "", url: "" });

    try {
      toast({
        title: "Success.",
        description: "Podcast added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      const { message } = error.response.data.message.sponsor;
      toast({
        title: "Error.",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="mt-[100px]">
      <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={onOpen}>
        Create Sponsor
      </Button>

      <Drawer
        isOpen={isOpen}
        placement="right"
        initialFocusRef={firstField}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <div className=" justify-center w-full text-center">
              <h1>Create a new sponsor for</h1>
              <p className="text-purple-400">{podcast}</p>
            </div>
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <FormLabel htmlFor="username">Sponsor</FormLabel>
                <Input
                  ref={firstField}
                  id="username"
                  placeholder="Please enter sponsor name"
                  value={sponsor.name}
                  onChange={(e) => {
                    setSponsor({ ...sponsor, name: e.target.value });
                  }}
                />
              </Box>

              <Box>
                <FormLabel htmlFor="url">Url</FormLabel>
                <InputGroup>
                  <Input
                    type="url"
                    id="url"
                    placeholder="Please enter domain"
                    value={sponsor.url}
                    onChange={(e) =>
                      setSponsor({ ...sponsor, url: e.target.value })
                    }
                  />
                </InputGroup>
              </Box>

              <Box>
                <FormLabel htmlFor="desc">Description</FormLabel>

                <Textarea
                  id="desc"
                  value={sponsor.description}
                  onChange={(e) =>
                    setSponsor({
                      ...sponsor,
                      description: e.target.value,
                    })
                  }
                />
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button colorScheme="blue" onClick={handleSubmit} width={"300px"}>
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CreateSponsor;
