import { FormEvent, useState, useReducer } from "react";
import {
  Button,
  Input,
  VStack,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";

import CreateSponsor from "../components/CreateSponsor";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Operations } from "../graphql/operations";
import Fuse from "fuse.js";
import SelectCategory from "../components/SelectCategory";
import Extractor from "../components/Extractor";
import { capitalizeString } from "../utils/functions";
import DeleteModal from "../components/DeleteModal";

const App = ({ image }: any) => {
  const [isExistingPodcast, setIsExistingPodcast] = useState(false);
  const [extractedColor, setExtractedColor] = useState("");
  const [display, setDisplay] = useState({
    sponsor: false,
    submit: false,
    preview: true,
    image: true,
    title: false,
    category: false,
    updateColor: true,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [category, setCategory] = useState("");
  const [podcast, setPodcast] = useState("");
  const [text, setText] = useState("");
  const [createPodcast] = useMutation(Operations.Mutations.CreatePodcast);
  const [updatePodcast] = useMutation(Operations.Mutations.UpdatePodcast);
  const [deletePodcast] = useMutation(Operations.Mutations.DeletePodcast);

  const [currentCategory, setCurrentCategory] = useState("");
  const [currentBgColor, setCurrentBgColor] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const { data, refetch: refetchPodcasts } = useQuery(
    Operations.Queries.GetPodcasts
  );
  const [fetchCategory] = useLazyQuery(Operations.Queries.FetchCategory);

  const [fetchSpotify, { data: spotifyData, refetch: refetchSpotify }] =
    useLazyQuery(Operations.Queries.FetchSpotifyPodcast);

  const [getPodcast, { data: podcastData, refetch: refetchCurrentPodcast }] =
    useLazyQuery(Operations.Queries.GetPodcast);

  const podcasts = data?.getPodcasts;

  let fusePreview: any;
  if (podcasts) {
    const fuse = new Fuse(podcasts, {
      keys: ["title"],
      includeScore: true,
    });

    fusePreview = fuse.search(text).map((preview: any) => {
      const { item } = preview;
      return item.title;
    });
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsExistingPodcast(false);
      setText(e.target.value);
      setDisplay((prev) => ({
        ...prev,
        image: false,
        submit: false,
        sponsor: false,
        preview: true,
        title: false,
        category: false,
      }));
      setExtractedColor("");
      setPodcast("");
    } catch (error) {
      console.log(error);
    }
  };

  /* Bug: Have to click preview to register as existing */

  const handleSubmit = async (
    e: FormEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>,
    preview: string,
    existingPodcast: boolean
  ) => {
    const podcastTitleList = podcasts.map((podcast: any) => {
      return podcast.title;
    });
    e.preventDefault();
    setText(preview);
    setPodcast(preview);
    setExtractedColor("");
    setDisplay((prev) => ({
      ...prev,
      preview: false,
      sponsor: true,
      image: true,
      title: true,
      category: false,
    }));

    if (!text) {
      return;
    }
    if (existingPodcast) {
      setIsExistingPodcast(true);
    }

    try {
      if (existingPodcast) {
        const getCategory = await fetchCategory({
          variables: {
            input: { podcast: preview },
          },
        });
        setCurrentCategory(getCategory.data.fetchCategory);
      }

      await Promise.all([
        /* Fetching new podcast */
        fetchSpotify({
          variables: {
            input: { podcast: preview },
          },
        }),
        /* Fetching existing podcast */
        getPodcast({
          variables: {
            input: { podcast: preview },
          },
        }),
      ]).then((result) => {
        let fetchBgColor;
        if (!result[1].data) {
          setCurrentBgColor("rgb(16,16,16)");
          setDisplay((prev) => ({ ...prev, submit: true }));
          setCurrentCategory("");
        } else {
          fetchBgColor = result[1].data.getPodcast?.backgroundColor;
          setCurrentBgColor(fetchBgColor);
          setCurrentTitle(result[1].data.getPodcast?.title);
          setCurrentImage(result[1].data.getPodcast?.imageUrl);
        }
        const fetchedSpotifyName = result[0].data.fetchSpotifyPodcast[0].name;

        if (!existingPodcast && text === podcast) {
          setDisplay((prev) => ({ ...prev, submit: false }));
        }
        if (!existingPodcast && display.submit) {
          setDisplay((prev) => ({ ...prev, submit: true }));
        }

        /* Register string match as existing podcast */
        if (podcastTitleList.includes(fetchedSpotifyName)) {
          const result = getPodcast({
            variables: {
              input: { podcast: fetchedSpotifyName },
            },
          });
          result.then((fetchData) => {
            const currentPodcastData = fetchData?.data.getPodcast;
            setCurrentBgColor(currentPodcastData.backgroundColor);
          });

          fetchCategory({
            variables: {
              input: { podcast: fetchedSpotifyName },
            },
          }).then((fetchData) => {
            setCurrentCategory(fetchData?.data.fetchCategory);
          });

          setDisplay((prev) => ({
            ...prev,
            submit: false,
            category: true,
          }));
        }
      });
      await refetchSpotify();
      await refetchPodcasts();
    } catch (error) {
      console.log(error);
    }
  };

  const spotifyImage = spotifyData?.fetchSpotifyPodcast[0]?.images[0].url;
  const spotifyName = spotifyData?.fetchSpotifyPodcast[0]?.name;
  const spotifyPublisher = spotifyData?.fetchSpotifyPodcast[0]?.publisher;
  const spotifyDescription = spotifyData?.fetchSpotifyPodcast[0]?.description;

  const handleSave = async () => {
    /* Add to database */
    try {
      await createPodcast({
        variables: {
          input: {
            category,
            podcast: spotifyName,
            image: spotifyImage,
            publisher: spotifyPublisher,
            description: spotifyDescription,
            backgroundColor: extractedColor,
          },
        },
      });

      await refetchPodcasts();
      await refetchSpotify();

      toast({
        title: "Success.",
        description: "Podcast added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      if (!category) {
        toast({
          title: "Error",
          description: "Please Enter Category.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else console.log(error);
    }
    setDisplay((prev) => ({
      ...prev,
      image: false,
      title: false,
      submit: false,
    }));
    setCategory("");
    setText("");
  };

  const handleUpdate = async () => {
    await updatePodcast({
      variables: {
        input: {
          backgroundColor: extractedColor,
          podcast,
        },
      },
    });
    setDisplay((prev) => ({
      ...prev,
      image: false,
      title: false,
      submit: false,
      sponsor: false,
    }));
    setCategory("");
    setText("");
    setPodcast("");
    refetchPodcasts();
    refetchSpotify();
    toast({
      title: "Success.",
      description: "Color Updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDelete = async () => {
    onClose();
    try {
      await deletePodcast({
        variables: {
          input: { podcast },
        },
      });
      setDisplay((prev) => ({
        ...prev,
        image: false,
        title: false,
        submit: false,
        sponsor: false,
      }));
      setCategory("");
      setText("");
      setPodcast("");
      refetchPodcasts();
      refetchSpotify();
      toast({
        title: "Success.",
        description: "Deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const gradientStyle = {
    backgroundImage: `linear-gradient(to bottom, ${
      currentBgColor ? currentBgColor : extractedColor
    }, #101010)`,
  };

  return (
    <div className="bg-[#101010] relative top-[200px] h-screen w-full flex flex-col items-center justify-center overflow-y-visible">
      <DeleteModal
        isOpen={isOpen}
        onClose={onClose}
        handleDelete={handleDelete}
      />
      {/* Theme Preview */}
      {spotifyName && display.title && (
        <div className="bg-[#101010] fixed w-full h-[320px] top-[170px] z-1">
          <div
            className="w-full h-[260px] fixed z-10"
            style={gradientStyle}
          ></div>
        </div>
      )}

      {/* Title */}
      <h1 className="text-white absolute font-extrabold top-[-180px] text-3xl sm:text-4xl lg:text-5xl mb-4 ">
        {isExistingPodcast && display.title
          ? currentTitle
          : spotifyName && display.title && spotifyName}
      </h1>
      {/* Category */}
      <h2 className="text-white absolute font-semibold top-[-115px] text-lg sm:text-2xl lg:text-xl mb-4 ">
        {spotifyName && display.title && capitalizeString(currentCategory)}
      </h2>

      {/* Image Color Extraction */}
      {display.image && podcast && (
        <div onClick={() => setCurrentBgColor(extractedColor)}>
          <Extractor
            image={isExistingPodcast ? currentImage : spotifyImage}
            extractedColor={extractedColor}
            setExtractedColor={setExtractedColor}
          />
        </div>
      )}

      <form
        onSubmit={(e) => handleSubmit(e, text, false)}
        className="w-[500px] flex flex-col justify-center items-center mb-4 h-[500px]"
      >
        <VStack spacing={5} className="h-full">
          <div className="flex-col h-[80px] items-center justify-center text-center">
            <Input
              type="text"
              value={text}
              w={200}
              color={"white"}
              placeholder={"Search Podcast Title"}
              onChange={(e) => handleInputChange(e)}
              mt={10}
            />
            <div className="w-[300px] bg-[#12121] flex flex-col items-center mt-10">
              <ul className="text-center">
                {text &&
                  display.preview &&
                  fusePreview?.map((preview: string) => (
                    <li key={preview}>
                      <Button
                        onClick={(e) => handleSubmit(e, preview, true)}
                        margin={1}
                      >
                        {preview}
                      </Button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {display.sponsor && podcast ? (
            <CreateSponsor
              podcast={spotifyName}
              createPodcast={createPodcast}
              displaySubmit={display.submit}
              category={category}
            />
          ) : null}

          {display.sponsor && !display.submit && display.updateColor && (
            <Button onClick={handleUpdate}>Update Color</Button>
          )}
          {display.sponsor && !display.submit && display.updateColor && (
            <Button colorScheme={"red"} onClick={onOpen}>
              Delete Podcast
            </Button>
          )}
          {display.submit && (
            <SelectCategory category={category} setCategory={setCategory} />
          )}
          {display.submit && (
            <Button
              onClick={handleSave}
              colorScheme={"purple"}
              w={"300px"}
              mt={10}
              p={4}
            >
              Add to Database
            </Button>
          )}
        </VStack>
      </form>
    </div>
  );
};

export default App;
