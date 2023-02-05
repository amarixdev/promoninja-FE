import React, { createContext, useContext } from "react";
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

  const QUERY = gql`
    query ($input: Int) {
      shows(input: $input) {
        items {
          name
          images {
            url
          }
          external_urls {
            spotify
          }
        }
      }
    }
  `;

  const [getPodcasts, { data, loading, error }] = useLazyQuery(QUERY, {
    variables: {
      input: offset,
    },
  });

  const handlePodcasts = () => {
    getPodcasts();
    setOffset((prev: number) => prev + 50);
  };

  if (loading) return <div>LOADING....</div>;
  if (error) return <div>ERROR</div>;

  const podcasts = data?.shows?.items;

  console.log(data?.shows?.items[0]?.external_urls.spotify);

  return (
    <>
      <Header />
      <Hero />
      <div className="w-full h-screen flex flex-col items-center">
        <Button className="mb-10 p-8" onClick={handlePodcasts}>
          Render Podcasts
        </Button>
        <div className="grid grid-cols-6 gap-5">
          {podcasts?.map((item: any, index: any) => (
            <div key={index} className="bg-black">
              <p>{item.name}</p>
              <Link href={item?.external_urls.spotify} target="_blank">
                <Image
                  src={item?.images[0]?.url}
                  alt={item?.name}
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Layout;
