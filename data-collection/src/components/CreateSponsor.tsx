import {
  ApolloQueryResult,
  OperationVariables,
  useMutation,
  useQuery,
} from "@apollo/client";
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
  InputLeftAddon,
  Spinner,
  Stack,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Fuse from "fuse.js";
import { Dispatch, useRef, useState } from "react";
import { Operations } from "../graphql/operations";
import { Sponsor } from "../utils/types";
import { ReducerAction, initState } from "../utils/reducer";

interface Props {
  podcast: string;
  state: typeof initState;
  refetchPodcast: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<any>>;
}

const CreateSponsor = ({ podcast, state, refetchPodcast }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = useRef(null);
  const [existingSponsor, setExistingSponsor] = useState(false);
  const [display, setDisplay] = useState({
    preview: false,
    image: true,
    baseUrl: false,
    fullPath: false,
  });
  const [sponsor, setSponsor] = useState({
    name: "",
    url: "",
    baseUrl: "",
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
    await refetchSponsors();
  };

  const {
    data,
    refetch: refetchSponsors,
    loading: sponsorLoading,
  } = useQuery(Operations.Queries.FetchSponsors, {
    variables: {
      input: { podcast },
    },
  });

  const {
    data: sponsorList,
    loading,
    refetch: refetchGetSponsors,
  } = useQuery(Operations.Queries.GetSponsors);

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
    setDisplay((prev) => ({
      ...prev,
      preview: true,
      baseUrl: false,
      image: true,
    }));
    if (e.target.value === "") {
      setDisplay((prev) => ({ ...prev, preview: false, image: true }));
    }
  };

  const currentSponsors = data?.fetchSponsors;
  const handleSearch = (
    param: string,
    event: any,
    isExistingSponsor: boolean
  ) => {
    event.preventDefault();
    setSponsor({ ...sponsor, name: param });
    setDisplay((prev) => ({ ...prev, preview: false }));
    if (isExistingSponsor) {
      setDisplay((prev) => ({ ...prev, image: false, baseUrl: true }));
      setExistingSponsor(true);
    }
    if (!isExistingSponsor) {
      if (fusePreview) {
        if (param === fusePreview[0]) {
          setDisplay((prev) => ({ ...prev, image: false, baseUrl: true }));
          setExistingSponsor(true);
        }
      } else {
        setDisplay((prev) => ({
          ...prev,
          image: true,
          baseUrl: false,
          fullPath: false,
        }));
        setExistingSponsor(false);
        setSponsor((prev) => ({ ...prev, url: "" }));
      }
    }
  };

  const handleBlur = () => {
    if (sponsor.name === "") return;
    if (existingSponsor) {
      setDisplay((prev) => ({
        ...prev,
        image: false,
        baseUrl: false,
        fullPath: true,
      }));
    } else {
      setDisplay((prev) => ({
        ...prev,
        image: true,
        baseUrl: false,
        fullPath: false,
      }));
    }
  };

  const handleURLBlur = (e: any) => {
    if (!existingSponsor) {
      setSponsor((prev) => ({
        ...prev,
        baseUrl: e.target.value.split("/")[0],
        url: e.target.value,
      }));
      setDisplay((prev) => ({ ...prev, fullPath: true, baseUrl: false }));
    } else {
      setDisplay((prev) => ({
        ...prev,
        fullPath: true,
        baseUrl: false,
      }));
      setSponsor((prev) => ({
        ...prev,
        url: baseUrl + "/" + e.target.value,
      }));
    }
  };

  const handleURLFocus = (e: any) => {
    if (!existingSponsor) return;
    else {
      setDisplay((prev) => ({
        ...prev,
        fullPath: false,
        baseUrl: true,
        image: false,
      }));
      setSponsor((prev) => ({
        ...prev,
        url: "",
      }));
    }
  };
  const handleSubmit = async () => {
    try {
      const url = "test" + (baseUrl + "/" + sponsor.url);
      setSponsor((prev) => ({ ...prev, url: url }));

      let duplicate;
      if (existingSponsor) {
        currentSponsors?.forEach((current: any) => {
          if (current.name.includes(sponsor.name)) {
            toast({
              title: "Error",
              description: "Sponsor already exists",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            duplicate = true;
          }
        });
      }

      if (duplicate) return;

      if (existingSponsor && !sponsor.url) {
        toast({
          title: "Error",
          description: "Please add a url",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      if (!existingSponsor && !sponsor.baseUrl) {
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
              category: state.category,
            },
          },
        });
        await refetchSponsors();
        await refetchGetSponsors();
        await refetchPodcast();

        toast({
          title: "Success!",
          description: "Sponsor added successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setSponsor({
          description: "",
          name: "",
          url: "",
          image: "",
          baseUrl: "",
        });

        setDisplay({
          preview: false,
          image: true,
          baseUrl: false,
          fullPath: false,
        });

        setExistingSponsor(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  if (loading) return <Spinner />;
  if (sponsorLoading) return <Spinner />;

  const drawerData = sponsorList?.getSponsors.filter((current: any) => {
    return current.name === sponsor.name;
  });
  const baseUrl = drawerData[0]?.url;

  return (
    <div className="">
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
              <form onSubmit={(e) => handleSearch(sponsor.name, e, false)}>
                <Box>
                  <FormLabel>Sponsor</FormLabel>
                  <Input
                    ref={firstField}
                    placeholder="Please enter sponsor name"
                    value={sponsor.name}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                  />
                  {display.preview && (
                    <Box
                      // bg={"#2D3748"}
                      bg={"white"}
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
                          onClick={(e) => handleSearch(sponsor, e, true)}
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
                  {display.baseUrl ? (
                    <InputLeftAddon>{baseUrl}</InputLeftAddon>
                  ) : null}
                  <Input
                    type="url"
                    placeholder={display.baseUrl ? "Path?" : "Please enter Url"}
                    value={
                      display.fullPath
                        ? sponsor.url
                        : display.baseUrl
                        ? sponsor.url
                        : sponsor.baseUrl
                    }
                    onChange={
                      display.baseUrl
                        ? (e) =>
                            setSponsor({
                              ...sponsor,
                              url: e.target.value,
                            })
                        : (e) =>
                            setSponsor((prev) => ({
                              ...prev,
                              baseUrl: e.target.value,
                            }))
                    }
                    onBlur={(e) => handleURLBlur(e)}
                    onFocus={handleURLFocus}
                  />
                </InputGroup>
              </Box>
              <Box>
                <FormLabel>Description</FormLabel>
                <Textarea
                  id="desc"
                  value={sponsor.description}
                  onChange={(e) =>
                    setSponsor({
                      ...sponsor,
                      description: e.target.value,
                    })
                  }
                  onBlur={handleBlur}
                />
              </Box>
              {display.image && (
                <InputGroup>
                  <Box>
                    <FormLabel>Image Url</FormLabel>
                    <Input
                      type="url"
                      placeholder="Please enter image URL"
                      value={sponsor.image}
                      onChange={(e) =>
                        setSponsor({ ...sponsor, image: e.target.value })
                      }
                      onBlur={handleBlur}
                    />
                  </Box>
                </InputGroup>
              )}
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
