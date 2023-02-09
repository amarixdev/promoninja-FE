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
  const [category, setCategory] = useState({ name: "", id: "" });
  const [podcast, setPodcast] = useState({
    title: "",
    category: category.id,
    creator: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // setPodcast({ title: text, category: category.id, creator: "" });
    try {
      if (category.id === "" || category.name === "") {
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
        }
      );

      toast({
        title: "Success.",
        description: "File written successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-[#1e1e1e] h-screen w-full flex flex-col items-center justify-center">
      <Tabs position={"absolute"} top={0} colorScheme={"yellow"}>
        <TabList color={"white"} fontSize={"smaller"}>
          <Tab
            onClick={() =>
              setCategory({ name: "Art", id: "63e0a72412cd90b5880ff7fd" })
            }
          >
            Art
          </Tab>
          <Tab
            onClick={() =>
              setCategory({ name: "Business", id: "63e0a85112cd90b5880ff8af" })
            }
          >
            Business
          </Tab>
          <Tab
            onClick={() =>
              setCategory({ name: "Comedy", id: "63e0a85712cd90b5880ff8ba" })
            }
          >
            Comedy
          </Tab>
          <Tab
            onClick={() =>
              setCategory({ name: "Education", id: "63e0a86212cd90b5880ff8c5" })
            }
          >
            Education
          </Tab>
          <Tab
            onClick={() =>
              setCategory({ name: "Fiction", id: "63e0a86a12cd90b5880ff8d0" })
            }
          >
            Fiction
          </Tab>
          <Tab
            onClick={() =>
              setCategory({ name: "Health", id: "63e0a87112cd90b5880ff8db" })
            }
          >
            Health
          </Tab>
          <Tab
            onClick={() =>
              setCategory({ name: "History", id: "63e0a87812cd90b5880ff8e6" })
            }
          >
            History
          </Tab>
          <Tab
            onClick={() =>
              setCategory({ name: "Leisure", id: "63e0a88012cd90b5880ff8f1" })
            }
          >
            Leisure
          </Tab>
          <Tab
            onClick={() =>
              setCategory({ name: "Music", id: "63e0a88712cd90b5880ff8fc" })
            }
          >
            Music
          </Tab>
          <Tab
            onClick={() =>
              setCategory({ name: "Politics", id: "63e0a88e12cd90b5880ff907" })
            }
          >
            Politics
          </Tab>
          <Tab
            onClick={() =>
              setCategory({
                name: "Religion & Spirituality",
                id: "63e0a89b12cd90b5880ff912",
              })
            }
          >
            Religion & Spirituality
          </Tab>
          <Tab
            onClick={() =>
              setCategory({ name: "Science", id: "63e0a8a412cd90b5880ff91d" })
            }
          >
            Science
          </Tab>
          <Tab
            onClick={() =>
              setCategory({ name: "Sports", id: "63e0a8b212cd90b5880ff933" })
            }
          >
            Sports
          </Tab>
          <Tab
            onClick={() =>
              setCategory({
                name: "Technology",
                id: "63e0a72e12cd90b5880ff808",
              })
            }
          >
            Technology
          </Tab>
        </TabList>
      </Tabs>

      <h1 className="text-white font-semibold text-5xl mb-4">
        {category.name}
      </h1>
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
                category: category.id,
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
                category: category.id,
                creator: e.target.value,
              })
            }
          />

          <Text color={"white"}>Category ID</Text>
          <Input
            type="text"
            value={category.id}
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
