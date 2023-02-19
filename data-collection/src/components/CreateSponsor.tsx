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
import axios from "axios";
import { useContext, useRef, useState } from "react";
import AppContext from "../context/context";

interface Props {
  podcast: string;
}

const CreateSponsor = ({ podcast }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = useRef(null);
  const { sponsor, setSponsor } = useContext(AppContext);
  const [text, setText] = useState({ name: "", url: "", description: "" });
  const toast = useToast();

  const handleSubmit = async () => {
    // setSponsor({
    //   name: text.name,
    //   url: text.url,
    //   description: text.description,
    //   image: "",
    // });

    const sponsorReq = true;

    try {
      const response = await axios.post(
        "http://localhost:3333/create-podcast",
        {
          podcast,
          text,
          sponsorReq,
        }
      );

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
                  value={text.name}
                  onChange={(e) => {
                    setText({ ...text, name: e.target.value });
                  }}
                />
              </Box>

              <Box>
                <FormLabel htmlFor="url">Url</FormLabel>
                <InputGroup>
                  {/* <InputLeftAddon>http://</InputLeftAddon> */}
                  <Input
                    type="url"
                    id="url"
                    placeholder="Please enter domain"
                    value={text.url}
                    onChange={(e) => setText({ ...text, url: e.target.value })}
                  />
                  {/* <InputRightAddon>.com</InputRightAddon> */}
                </InputGroup>
              </Box>

              <Box>
                <FormLabel htmlFor="desc">Description</FormLabel>

                <Textarea
                  id="desc"
                  value={text.description}
                  onChange={(e) =>
                    setText({
                      ...text,
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
