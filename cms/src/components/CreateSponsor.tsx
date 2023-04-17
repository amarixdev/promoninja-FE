import {
  ApolloQueryResult,
  OperationVariables,
  useLazyQuery,
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
import { useEffect, useRef, useState } from "react";
import { Operations } from "../graphql/operations";
import { Sponsor } from "../utils/types";
import { initState } from "../utils/reducer";
import SelectSponsorCategory from "./SelectSponsorCategory";
import { url } from "inspector";

interface Props {
  podcast: string;
  backgroundColor: string;
  category: string;
  spotifyPodcast: {
    spotifyImage: string;
    spotifyName: string;
    spotifyPublisher: string;
    spotifyDescription: string;
    spotifyExternalUrl: string;
  };
  refetchPodcast: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<any>>;
}

const CreateSponsor = ({
  podcast,
  refetchPodcast,
  spotifyPodcast,
  backgroundColor,
  category,
}: Props) => {
  const {
    data: sponsorList,
    loading,
    refetch: refetchGetSponsors,
  } = useQuery(Operations.Queries.GetSponsors);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = useRef(null);
  const [display, setDisplay] = useState({
    preview: false,
  });
  const [sponsor, setSponsor] = useState({
    name: "",
    url: "",
    baseUrl: "",
    promoCode: "",
    offer: "",
    image: "",
    category: "",
    summary: "",
  });
  const [urlPath, setUrlPath] = useState("");
  let baseUrl: any;
  let drawerData: any;

  const [currentCategory, setCurrentCategory] = useState("");

  const toast = useToast();
  const [createSponsor] = useMutation(Operations.Mutations.CreateSponsor);
  const [deletePodcastSponsor, {}] = useMutation(
    Operations.Mutations.DeletePodcastSponsor
  );
  const handleDelete = async (sponsorToDelete: string) => {
    await deletePodcastSponsor({
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

  const { data: sponsorData } = useQuery(Operations.Queries.GetSponsor, {
    variables: {
      input: {
        name: sponsor.name,
      },
    },
  });

  const [getSponsorCategory] = useLazyQuery(
    Operations.Queries.GetSponsorCategory
  );

  const isExistingSponsor = sponsorData?.getSponsor !== null;
  const [existingSponsor, setExistingSponsor] = useState(false);

  useEffect(() => {
    setExistingSponsor(isExistingSponsor);
  }, [sponsorData, isExistingSponsor]);

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

  const handleSponsorChange = (e: any) => {
    setSponsor((prev) => ({
      ...prev,
      name: e.target.value,
      baseUrl: "",
      url: "",
      category: "",
    }));
    setUrlPath("");
    setDisplay((prev) => ({
      ...prev,
      preview: true,
    }));
    if (e.target.value === "") {
      setDisplay((prev) => ({ ...prev, preview: false }));
    }
  };

  const currentSponsors = data?.fetchSponsors;

  const handleSearch = async (param: string, event: any, exists: boolean) => {
    event.preventDefault();

    if (sponsorList) {
      drawerData = sponsorList?.getSponsors.filter((current: any) => {
        return current.name === param;
      });
    }

    if (exists) {
      const { data: sponsorCategory } = await getSponsorCategory({
        variables: {
          input: {
            sponsor: param,
          },
        },
      });
      setCurrentCategory(sponsorCategory?.getSponsorCategory?.name);
      setExistingSponsor(true);
      setSponsor((prev) => ({
        ...prev,
        baseUrl: drawerData[0]?.url,
        url: drawerData[0]?.url,
        category: sponsorCategory?.getSponsorCategory?.name,
      }));
    }
    setSponsor((prev) => ({
      ...prev,
      name: param,
    }));
    setDisplay((prev) => ({ ...prev, preview: false }));

    if (!existingSponsor) {
      setDisplay((prev) => ({ ...prev, summary: true }));
      if (fusePreview) {
        if (param === fusePreview[0]) {
          setExistingSponsor(true);
        }
      } else {
        setExistingSponsor(false);
        setSponsor((prev) => ({ ...prev, url: "", baseUrl: "" }));
      }
    }
  };

  const handleUrlInput = (e: any) => {
    if (existingSponsor) {
      setUrlPath(e.target.value);
    } else {
      setSponsor((prev) => ({
        ...prev,
        url: e.target.value,
      }));
    }
  };

  const handleBlur = () => {
    if (sponsor.name === "") return;
  };

  const handleURLBlur = (e: any) => {
    if (!existingSponsor) {
      setSponsor((prev) => ({
        ...prev,
        baseUrl: e.target.value.split("/")[0],
        url: e.target.value,
      }));
    } else {
      setSponsor((prev) => ({
        ...prev,
        url: urlPath ? sponsor.baseUrl + "/" + urlPath : sponsor.baseUrl,
      }));
    }
  };

  const handleURLFocus = (e: any) => {
    if (!existingSponsor) return;
    else {
      setSponsor((prev) => ({
        ...prev,
        url: "",
      }));
    }
  };


  const handleSubmit = async () => {
    try {
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
      else {
        /* Fix URL: if (existing), set url to baseURL */
        await createSponsor({
          variables: {
            input: {
              podcast,
              sponsor,
              backgroundColor,
              category: currentCategory,
              image: spotifyPodcast.spotifyImage,
              publisher: spotifyPodcast.spotifyPublisher,
              description: spotifyPodcast.spotifyDescription,
              externalUrl: spotifyPodcast.spotifyExternalUrl,
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
          promoCode: "",
          name: "",
          url: "",
          image: "",
          baseUrl: "",
          category: "",
          summary: "",
          offer: "",
        });

        setDisplay({
          preview: false,
        });

        setExistingSponsor(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  if (loading) return <Spinner />;
  if (sponsorLoading) return <Spinner />;

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
                      handleSponsorChange(e);
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
                  {existingSponsor && (
                    <InputLeftAddon>{sponsor.baseUrl}</InputLeftAddon>
                  )}
                  <Input
                    type="url"
                    placeholder={existingSponsor ? "Path?" : "Please enter Url"}
                    value={existingSponsor ? urlPath : sponsor.url}
                    onChange={(e) => handleUrlInput(e)}
                    onBlur={(e) => handleURLBlur(e)}
                    onFocus={handleURLFocus}
                  />
                </InputGroup>
              </Box>
              <SelectSponsorCategory
                isExisting={existingSponsor}
                newCategory={sponsor.category}
                currentCategory={currentCategory}
                setSponsor={setSponsor}
              />
              <Box>
                <FormLabel>Promo Code</FormLabel>
                <Textarea
                  id="desc"
                  value={sponsor.promoCode}
                  onChange={(e) =>
                    setSponsor({
                      ...sponsor,
                      promoCode: e.target.value,
                    })
                  }
                  onBlur={handleBlur}
                />
              </Box>
              {existingSponsor || (
                <Box>
                  <FormLabel>
                    Summary
                    <span className="text-green-500 font-bold">
                      ( New Sponsor)
                    </span>
                  </FormLabel>
                  <InputGroup>
                    <Textarea
                      placeholder={"Please enter Summary"}
                      value={sponsor.summary}
                      onChange={(e) =>
                        setSponsor((prev) => ({
                          ...prev,
                          summary: e.target.value,
                        }))
                      }
                    />
                  </InputGroup>
                </Box>
              )}
              {existingSponsor || (
                <Box>
                  <FormLabel>
                    Offer{" "}
                    <span className="text-green-500 font-bold">
                      ( New Sponsor)
                    </span>{" "}
                  </FormLabel>
                  <Textarea
                    value={sponsor.offer}
                    onChange={(e) =>
                      setSponsor({
                        ...sponsor,
                        offer: e.target.value,
                      })
                    }
                    onBlur={handleBlur}
                  />
                </Box>
              )}
              {!existingSponsor && (
                <InputGroup>
                  <Box>
                    <FormLabel>
                      Image Url{" "}
                      <span className="text-green-500 font-bold">
                        ( New Sponsor)
                      </span>
                    </FormLabel>
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
