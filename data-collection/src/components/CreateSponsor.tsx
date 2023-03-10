import { useMutation, useQuery } from "@apollo/client";
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
  Spinner,
  Stack,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Fuse from "fuse.js";
import { useRef, useState } from "react";
import { Operations } from "../graphql/operations";
import { Sponsor } from "../utils/types";

interface Props {
  podcast: string;
  category: string;
  displaySubmit: boolean;
  createPodcast: ({}) => void;
}

const CreateSponsor = ({ podcast, category }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = useRef(null);
  const [displayPreview, setDisplayPreview] = useState(false);
  const [sponsor, setSponsor] = useState({
    name: "",
    url: "",
    description: "",
    image: "",
  });
  const toast = useToast();
  const [createSponsor, { error }] = useMutation(
    Operations.Mutations.CreateSponsor
  );

  const [deleteSponsor, {}] = useMutation(Operations.Mutations.DeleteSponsor);

  const handleDelete = async (sponsorToDelete: string) => {
    await deleteSponsor({
      variables: {
        input: { sponsor: sponsorToDelete, podcast },
      },
    });
    await refetch();
  };

  const { data, refetch } = useQuery(Operations.Queries.FetchSponsors, {
    variables: {
      input: { podcast },
    },
  });

  const { data: sponsorList, loading } = useQuery(
    Operations.Queries.GetSponsors
  );

  let fusePreview: string[] | undefined = undefined;

  if (sponsorList) {
    const fuse = new Fuse(sponsorList?.getSponsors, {
      keys: ["name"],
      includeScore: true,
    });

    fusePreview = fuse.search(sponsor?.name).map((preview: any) => {
      const { item } = preview;
      return item.name;
    });
  }

  const handleChange = (e: any) => {
    setSponsor({ ...sponsor, name: e.target.value });
    setDisplayPreview(true);
    if (e.target.value === "") {
      setDisplayPreview(false);
    }
  };

  const currentSponsors = data?.fetchSponsors;

  const handleSearch = (param: string, event: any) => {
    event.preventDefault();
    setSponsor({ ...sponsor, name: param });
    setDisplayPreview(false);
  };

  const handleSubmit = async () => {
    try {
      if (fusePreview) {
        for (const name of fusePreview) {
          if (name === sponsor.name) {
            toast({
              title: "Error",
              description: "Sponsor already exists",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            return;
          }
        }
      }

      if (!sponsor.url) {
        toast({
          title: "Error",
          description: "Please add a url",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      } else {
        await createSponsor({
          variables: {
            input: {
              podcast,
              sponsor,
              category,
            },
          },
        });
        await refetch();
        toast({
          title: "Success!",
          description: "Sponsor added successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setSponsor({ description: "", name: "", url: "", image: "" });
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  // const currentSponsors = ["Athletic Greens", "Onnit", "NeuroGum"];
  if (loading) return <Spinner />;
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
              <form onSubmit={(e) => handleSearch(sponsor.name, e)}>
                <Box>
                  <FormLabel>Sponsor</FormLabel>
                  <Input
                    ref={firstField}
                    placeholder="Please enter sponsor name"
                    value={sponsor.name}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                  {displayPreview && (
                    <Box
                      bg={"#2D3748"}
                      h={"500px"}
                      w={"275px"}
                      pos="fixed"
                      zIndex={"10"}
                      rounded="3xl"
                    >
                      {fusePreview?.map((sponsor: any) => (
                        <Button
                          key={sponsor}
                          margin={2}
                          onClick={(e) => handleSearch(sponsor, e)}
                        >
                          {sponsor}
                        </Button>
                      ))}
                    </Box>
                  )}
                </Box>
              </form>

              <Box>
                <FormLabel>Url</FormLabel>
                <InputGroup>
                  <Input
                    type="url"
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
              <InputGroup>
                <Input
                  type="url"
                  placeholder="Please enter image URL"
                  value={sponsor.image}
                  onChange={(e) =>
                    setSponsor({ ...sponsor, image: e.target.value })
                  }
                />
              </InputGroup>
              <Box>
                <FormLabel>Current Sponsors</FormLabel>
                {currentSponsors?.map((sponsor: Sponsor, index: number) => (
                  <div key={index} className="w-full flex justify-between">
                    <h1>{sponsor.name}</h1>
                    <p
                      className="text-sm hover:text-red-300 active:text-red-400 hover:cursor-pointer"
                      onClick={() => handleDelete(sponsor.name)}
                    >
                      remove
                    </p>
                  </div>
                ))}
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
