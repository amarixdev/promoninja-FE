import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import dotenv from "dotenv";
import gql from "graphql-tag";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Button } from "@chakra-ui/react";

type Props = {};

interface Item {
  name: string;
}

const Layout = (props: Props) => {
  const QUERY = gql`
    query {
      shows {
        items {
          name
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(QUERY);

  const [getPodcasts, {data: newData }] = useLazyQuery(QUERY);

  const handlePodcasts = () => {

    getPodcasts()
  }

  if (loading) return <div>LOADING....</div>;
  if (error) return <div>ERROR</div>;

  const {
    shows: { items },
  } = data;

  console.log(items);

  return (
    <>
      <Header />
      <Hero />
      <Button onClick={handlePodcasts}>CLICK</Button>

      {items.map((item: any, index: any) => (
        <div key={index}>
          <p>{item.name}</p>
        </div>
      ))}
    </>
  );
};

export default Layout;
