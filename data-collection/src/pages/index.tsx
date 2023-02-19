import { useContext, useState } from "react";
import axios from "axios";
import {
  Button,
  Input,
  Text,
  VStack,
  useToast
} from "@chakra-ui/react";

import CreateSponsor from "../components/CreateSponsor";
import { Sponsor } from "../utils/types";
import AppContext from "../context/context";
import { Select } from "@chakra-ui/react";

const App = () => {
  const toast = useToast();
  const [category, setCategory] = useState("");
  const [podcast, setPodcast] = useState("");
  const [displaySponsor, setDisplaySponsor] = useState(false);
  const [text, setText] = useState("");
  const { sponsor } = useContext(AppContext);

  const handleInputChange = (e: any) => {
    setText(e.target.value);
    if (text === "") {
      console.log(true);
    }
  };

  const handleSubmit = async (e: any) => {
    setPodcast(text);
    setDisplaySponsor(true);
    e.preventDefault();
    // setPodcast({ title: text, category: category.id, creator: "" });
    try {
      // if (category === "") {
      //   console.log("ERROR");
      //   toast({
      //     title: "Error.",
      //     description: "Please Select A Category",
      //     status: "error",
      //     duration: 3000,
      //     isClosable: true,
      //   });
      //   return;
      // }
      if (podcast === "") {
        console.log("ERROR");
        // toast({
        //   title: "Error.",
        //   description: "Please Enter A Podcast",
        //   status: "error",
        //   duration: 3000,
        //   isClosable: true,
        // });
        return;
      } else {
        console.log(podcast);

        await handleSave();
      }
      // setText("");
    } catch (error) {
      console.log(error);
    }
  };

  /* Send data to server-endpoint via POST request */

  const handleSave = async () => {
    const sponsorReq = false;
    try {
      const response = await axios.post("/api/create-podcast", {
        podcast,
        category,
        sponsorReq,
      });

      toast({
        title: "Success.",
        description: "Podcast added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // console.log(response.data);
      setPodcast("");
    } catch (error: any) {
      // const { message } = error.response.data;
      toast({
        title: "Error.",
        description: error.response.data.message.podcast,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setPodcast("");
    }
  };

  return (
    <div className="bg-[#1e1e1e] h-screen w-full flex flex-col items-center justify-center">
      {/* Create Podcast and Sponsor page */}
      <h1 className="text-white font-semibold text-5xl mb-4">
        {podcast}
      </h1>
      <h1 className="font-bold">Hello</h1>
      <form
        onSubmit={handleSubmit}
        className="w-[500px] flex flex-col justify-center items-center mb-4"
      >
        <VStack spacing={5}>
          <Text color={"white"}>Podcast Title</Text>
          <Input
            type="text"
            value={text}
            w={200}
            color={"white"}
            onChange={(e) => handleInputChange(e)}
          />
          <Button type="submit" colorScheme={"green"} w={"150px"} p={4}>
            Save Title
          </Button>

          {displaySponsor && podcast ? (
            <CreateSponsor podcast={podcast} />
          ) : null}

          <Select
            placeholder="--Select Category--"
            textColor={"white"}
            textAlign={"center"}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="comedy">Comedy</option>
            <option value="technology">Technology</option>
            <option value="news & politics">News & Politics</option>
            <option value="education">Education</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="Science">Science</option>
            <option value="Sports">Sports</option>
          </Select>
          <Button
            type="submit"
            colorScheme={"purple"}
            w={"300px"}
            mt={10}
            p={4}
          >
            Add to Database
          </Button>
        </VStack>
      </form>
    </div>
  );
};

export default App;
