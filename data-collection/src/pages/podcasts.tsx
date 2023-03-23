import { GetStaticProps } from "next";
import Image from "next/image";
import React from "react";
import client from "../graphql/apollo-client";
import { Operations } from "../graphql/operations";
import { PodcastData, Podcasts } from "../utils/types";

const podcasts = ({ podcasts }: Podcasts) => {
  console.log(podcasts);

  console.log(podcasts[0].imageUrl);
  return (
    <div className="grid grid-cols-8 mt-10 space-y-4 px-6">
      {podcasts.map((pod) => (
        <div key={pod.title}>
          <Image
            src={pod?.imageUrl}
            alt={pod?.title}
            width={100}
            height={100}
            className={"rounded-3xl"}
          />
          <h1 className="text-white text-xs font-semibold">{pod.title}</h1>
        </div>
      ))}
    </div>
  );
};

export default podcasts;

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await client.query({
    query: Operations.Queries.GetPodcasts,
  });

  const podcasts = data?.getPodcasts;
  return {
    props: { podcasts },
  };
};
