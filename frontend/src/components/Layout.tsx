import React, { createContext, useContext, useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import dotenv from "dotenv";
import gql from "graphql-tag";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Button } from "@chakra-ui/react";
import APIContext from "../context/context";
import Image from "next/image";
import Link from "next/link";
("../context/context");

type Props = {};

interface Item {
  name: string;
}

const Layout = (props: Props) => {
  const { offset, setOffset } = useContext(APIContext);
  const [id, setId] = useState("");

  const SHOWS_QUERY = gql`
    query ($input: Int) {
      shows(input: $input) {
        items {
          name
          images {
            url
          }
          id
          external_urls {
            spotify
          }
          total_episodes
        }
      }
    }
  `;

  const EPISODES_QUERY = gql`
    query ($input: String!) {
      episodes(input: $input) {
        items {
          html_description
        }
      }
    }
  `;
  const [getPodcasts, { data, loading, error }] = useLazyQuery(SHOWS_QUERY, {
    variables: {
      input: offset,
    },
  });

  const [getEpisodes, { data: episodeData }] = useLazyQuery(EPISODES_QUERY, {
    variables: {
      input: id,
    },
  });

  const handleEpisodes = (id: string) => {
    const phrasesToFilter = [
      "brought to you by",
      "sponsor",
      "promo",
      "discount",
      "sponsored",
      "partner",
      "support",
      "free",
      "%",
    ];
    setId(id);
    getEpisodes();
    // console.log("episode_data", episodeData?.episodes?.items);
    const descriptions = episodeData?.episodes?.items;

    const possibleCodes = descriptions?.map((description: any) => {
      return description.html_description;
    });

    console.log(
      possibleCodes?.filter((string: any) =>
        phrasesToFilter.some((phrase) => string.toLowerCase().includes(phrase))
      )
    );
  };

  const handlePodcasts = () => {
    getPodcasts();
    setOffset((prev: number) => prev + 50);
  };

  if (loading) return <div>LOADING....</div>;
  if (error) return <div>ERROR</div>;

  const podcasts = data?.shows?.items;

  // console.log(data?.shows?.items[0]?.external_urls.spotify);

  return (
    <>
      <Header />
      <Hero />
      {/* <div className="w-full h-screen flex flex-col items-center text-white">
        <Button
          className="mb-10 p-8"
          onClick={handlePodcasts}
          colorScheme={"blue"}
        >
          Render Podcasts
        </Button>
        <div className="grid grid-cols-6 gap-5">
          {podcasts?.map((item: any, index: any) => (
            <div key={index} className="bg-black">
              <p>{item.name}</p>

              <Image
                src={item?.images[0]?.url}
                alt={item?.name}
                width={120}
                height={120}
                className="rounded-full"
                onClick={() => handleEpisodes(item.id)}
              />

              <p>{item?.total_episodes}</p>
            </div>
          ))}
        </div>
      </div> */}
    </>
  );
};

export default Layout;
