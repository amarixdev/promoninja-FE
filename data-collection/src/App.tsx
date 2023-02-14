import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Input,
  Text,
  VStack,
  useToast,
  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react";

const App = () => {
  const toast = useToast();
  const [category, setCategory] = useState("");
  const [podcast, setPodcast] = useState({
    title: "",
    creator: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // setPodcast({ title: text, category: category.id, creator: "" });
    try {
      if (category === "") {
        console.log("ERROR");
        toast({
          title: "Error.",
          description: "Please Select A Category",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      if (podcast.title === "") {
        console.log("ERROR");
        toast({
          title: "Error.",
          description: "Please Enter A Podcast",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
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
    try {
      const response = await axios.post(
        "http://localhost:3333/create-podcast",
        {
          podcast,
          category,
        }
      );

      toast({
        title: "Success.",
        description: "Podcast added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      console.log(response.data);
      setPodcast({ title: "", creator: "" });
    } catch (error: any) {
      const { message } = error.response.data;
      toast({
        title: "Error.",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setPodcast({ title: "", creator: "" });
    }
  };

  return (
    <div className="bg-[#1e1e1e] h-screen w-full flex flex-col items-center justify-center">
      <Tabs position={"absolute"} top={0} colorScheme={"yellow"}>
        <TabList color={"white"} fontSize={"smaller"}>
          <Tab onClick={() => setCategory("Comedy")}>Comedy</Tab>
          <Tab onClick={() => setCategory("Education")}>Education</Tab>
          <Tab onClick={() => setCategory("Lifestyle")}>Lifestyle</Tab>
          <Tab onClick={() => setCategory("Politics")}>Politics</Tab>
          <Tab onClick={() => setCategory("Science")}>Science</Tab>
          <Tab onClick={() => setCategory("Sports")}>Sports</Tab>
          <Tab onClick={() => setCategory("Technology")}>Technology</Tab>
        </TabList>
      </Tabs>

      <h1 className="text-white font-semibold text-5xl mb-4">{category}</h1>
      <form
        onSubmit={handleSubmit}
        className="w-[500px] flex flex-col justify-center items-center mb-4"
      >
        <VStack spacing={5}>
          <Text color={"white"}>Podcast Title</Text>
          <Input
            type="text"
            value={podcast.title}
            w={200}
            color={"white"}
            onChange={(e) =>
              setPodcast({
                title: e.target.value,
                creator: podcast.creator,
              })
            }
          />
          <Text color={"white"}>Creator</Text>
          <Input
            type="text"
            value={podcast.creator}
            w={200}
            color={"white"}
            onChange={(e) =>
              setPodcast({
                title: podcast.title,
                creator: e.target.value,
              })
            }
          />

          <Text color={"white"}>Category ID</Text>
          <Input
            type="text"
            value={category}
            w={200}
            color={"white"}
            readOnly
          />
          <Button
            type="submit"
            colorScheme={"purple"}
            w={"300px"}
            mt={10}
            p={4}
          >
            Add Podcast
          </Button>
        </VStack>
      </form>
    </div>
  );
};

export default App;
