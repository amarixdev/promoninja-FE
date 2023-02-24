import { prisma } from "@prisma/client";
import { GraphQLContext, PodcastInput, SpotifyAPI } from "../../util/types";
import fetch from "node-fetch";

export const podcastResolvers = {
  Mutation: {
    createPodcast: async (
      parent: any,
      { input }: PodcastInput,
      context: GraphQLContext
    ) => {
      const { prisma } = context;

      let { podcast, category, image } = input;

      category = category?.toLowerCase();

      const CATEGORY = await prisma.category.findFirst({
        where: {
          name: category,
        },
      });

      const createdPodcast = await prisma.podcast.create({
        data: {
          title: podcast,
          imageUrl: image,
          category: {
            connect: {
              id: CATEGORY?.id,
            },
          },
        },
      });

      return true;
    },
  },
  Query: {
    getPodcasts: async (parent: any, args: any, context: GraphQLContext) => {
      const { prisma } = context;
      try {
        const podcasts = await prisma.podcast.findMany({
          take: 6,
        });
        return podcasts;
      } catch (error) {
        console.log(error);
      }
    },
    fetchSpotifyPodcast: async (
      parent: any,
      { input }: SpotifyAPI,
      context: GraphQLContext
    ) => {
      const { accessToken, prisma } = context;
      const { podcast } = input;
      console.log(podcast);

      try {
        const result = await fetch(
          `https://api.spotify.com/v1/search?q=${podcast}&type=show&market=US&limit=1`,
          {
            method: "GET",
            headers: { Authorization: "Bearer " + accessToken },
          }
        );

        const data = await result.json();
        console.log(data.shows.items.name);
        return data?.shows?.items;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
