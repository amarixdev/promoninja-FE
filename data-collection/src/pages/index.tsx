import { FormEvent, use, useContext, useState } from "react";
import {
  Button,
  Input,
  Text,
  VStack,
  useToast,
  Spinner,
} from "@chakra-ui/react";

import CreateSponsor from "../components/CreateSponsor";
import AppContext from "../context/context";
import { Select } from "@chakra-ui/react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import { Operations } from "../graphql/operations";
import Fuse from "fuse.js";
import Image from "next/image";

const App = () => {
  const toast = useToast();
  const [category, setCategory] = useState("");
  const [podcast, setPodcast] = useState("");
  const [display, setDisplay] = useState({
    sponsor: false,
    submit: false,
    preview: true,
    image: true,
    title: false,
  });

  const [text, setText] = useState("");
  const [createPodcast, { error }] = useMutation(
    Operations.Mutations.CreatePodcast
  );
  const { data, loading, refetch } = useQuery(Operations.Queries.GetPodcasts);

  const [getPodcastImage, { data: podcastImage, refetch: refetchImage }] =
    useLazyQuery(Operations.Queries.fetchSpotifyPodcast);

  if (loading)
    return (
      <div className="w-full h-screen items-center justify-center flex">
        <Spinner />
      </div>
    );

  const podcasts = data?.getPodcasts;

  let fusePreview;
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
      setText(e.target.value);
      setDisplay((prev) => ({
        ...prev,
        image: false,
        submit: false,
        sponsor: false,
        preview: true,
        title: false,
      }));
      setPodcast("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (
    e: FormEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>,
    preview: string,
    existingPodcast: boolean
  ) => {
    e.preventDefault();
    setText(preview);
    setPodcast(preview);
    setDisplay((prev) => ({
      ...prev,
      preview: false,
      sponsor: true,
      image: true,
      title: true,
    }));
    if (!text) {
      return;
    }

    if (!existingPodcast) {
      setDisplay((prev) => ({ ...prev, submit: true }));
    }

    if (!existingPodcast && text === podcast) {
      setDisplay((prev) => ({ ...prev, submit: false }));
    }

    if (!existingPodcast && display.submit) {
      setDisplay((prev) => ({ ...prev, submit: true }));
    }

    try {
      await getSpotify({
        variables: {
          input: { podcast: preview },
        },
      });

      await refetchSpotify();
    } catch (error) {
      console.log(error);
    }
  };

  const spotifyImage = podcastImage?.fetchSpotifyPodcast[0]?.images[0].url;
  const spotifyName = podcastImage?.fetchSpotifyPodcast[0]?.name;
  const spotifyPublisher = podcastImage?.fetchSpotifyPodcast[0]?.publisher;

  console.log(spotifyPublisher);

  const handleSave = async () => {
    try {
      await createPodcast({
        variables: {
          input: {
            podcast: spotifyName,
            category,
            image: spotifyImage,
            publisher: spotifyPublisher,
          },
        },
      });

      await refetch();
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
    setDisplay((prev) => ({ ...prev, image: false, title: false }));
    setCategory("");
    setText("");
  };

  console.log(imageURL);

  return (
    <div className="bg-[#1e1e1e] h-screen w-full flex flex-col items-center justify-center">
      <h1 className="text-white font-semibold text-3xl sm:text-4xl lg:text-5xl mb-4 fixed top-10">
        {spotifyName && display.title && spotifyName}
      </h1>
      <form
        onSubmit={(e) => handleSubmit(e, text, false)}
        className="w-[500px] flex flex-col justify-center items-center mb-4 h-[500px]"
      >
        <VStack spacing={5} className="h-full">
          <div className=" w-full flex-col items-center justify-center text-center">
            <Text color={"white"} mt={10}>
              Podcast Title
            </Text>
            <Input
              type="text"
              value={text}
              w={200}
              color={"white"}
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
          {imageURL && display.image && (
            <Image src={imageURL} width={125} height={125} alt="/" />
          )}

          {display.submit && (
            <Select
              placeholder="--Select Category--"
              textColor={"white"}
              textAlign={"center"}
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="comedy">Comedy</option>
              <option value="technology">Technology</option>
              <option value="news & politics">News & Politics</option>
              <option value="education">Education</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="science">Science</option>
              <option value="sports">Sports</option>
            </Select>
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
