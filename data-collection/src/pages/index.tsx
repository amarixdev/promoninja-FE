import { use, useContext, useState } from "react";
import axios from "axios";
import { Button, Input, Text, VStack, useToast } from "@chakra-ui/react";

import CreateSponsor from "../components/CreateSponsor";
import AppContext from "../context/context";
import { Select } from "@chakra-ui/react";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import { Operations } from "../graphql/operations";

const App = () => {
  const toast = useToast();
  const [category, setCategory] = useState("");
  const [podcast, setPodcast] = useState("");
  const [displaySponsor, setDisplaySponsor] = useState(false);
  const [displaySubmit, setDisplaySubmit] = useState(false);
  const [text, setText] = useState("");
  const { sponsor } = useContext(AppContext);
  const [searchPreview, setSearchPreview] = useState([]);
  const [createPodcast, { loading, error }] = useMutation(
    Operations.Mutations.CreatePodcast
  );

  const { data } = useQuery(gql`
    query {
      getPodcasts {
        title
      }
    }
  `);

  const handleInputChange = async (e: any) => {
    try {
      console.log(data)
      setText(e.target.value);
      const podcasts = data.getPodcasts.map((obj: any) => obj.title);
      const preview = podcasts.filter((title: string) =>
        title.toLowerCase().includes(text.toLowerCase())
      );
      setDisplaySubmit(false);
      setDisplaySponsor(false);
      setSearchPreview(preview);
      setPodcast("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (
    e: any,
    preview: string,
    existingPodcast: boolean
  ) => {
    e.preventDefault();
    setText(preview);
    setPodcast(preview);
    setSearchPreview([]);
    setDisplaySponsor(true);

    if (!existingPodcast) {
      setDisplaySubmit(true);
    }

    if (!existingPodcast && text === podcast) {
      setDisplaySubmit(false);
    }

    if (!existingPodcast && displaySubmit) {
      setDisplaySubmit(true);
    }

    try {
      if (podcast === "") {
        return;
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    const sponsorReq = false;

    try {
      createPodcast({
        variables: { input: { podcast, category } },
      });

      toast({
        title: "Success.",
        description: "Podcast added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Error.",
        description: error.response.data.message.podcast,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setCategory("");
    setText("");
    setPodcast("");
  };

  return (
    <div className="bg-[#1e1e1e] h-screen w-full flex flex-col items-center justify-center">
      {/* Create Podcast and Sponsor page */}
      <h1 className="text-white font-semibold text-3xl sm:text-4xl lg:text-5xl mb-4 fixed top-10">
        {podcast}
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
                  searchPreview.map((preview) => (
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
          {displaySponsor && podcast ? (
            <CreateSponsor
              podcast={podcast}
              createPodcast={createPodcast}
              displaySubmit={displaySubmit}
              category={category}
            />
          ) : null}

          {displaySubmit && (
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
          {displaySubmit && (
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
