import { GraphQLContext, PodcastInput, SpotifyAPI } from "../../util/types";
import fetch from "node-fetch";
import { prisma } from "@prisma/client";

export const podcastResolvers = {
  Mutation: {
    createPodcast: async (
      parent: any,
      { input }: PodcastInput,
      context: GraphQLContext
    ) => {
      const { prisma } = context;

      let {
        podcast,
        category,
        image,
        publisher,
        description,
        backgroundColor,
      } = input;
      category = category?.toLowerCase();

      const getCategory = await prisma.category.findFirst({
        where: {
          name: category,
        },
      });

      await prisma.podcast.create({
        data: {
          title: podcast,
          imageUrl: image,
          publisher,
          backgroundColor,
          description,
          category: {
            connect: {
              id: getCategory?.id,
            },
          },
        },
      });

      const getPodcast = await prisma.podcast.findFirst({
        where: {
          title: podcast,
        },
      });

      await prisma.category.update({
        where: {
          id: getCategory?.id,
        },
        data: {
          podcast: {
            connect: {
              id: getPodcast?.id,
            },
          },
        },
      });

      return true;
    },
    updatePodcast: async (
      parent: any,
      { input }: PodcastInput,
      context: GraphQLContext
    ) => {
      const { prisma } = context;
      const { backgroundColor, podcast } = input;
      console.log("updating...");
      await prisma.podcast.update({
        where: {
          title: podcast,
        },
        data: {
          backgroundColor,
        },
      });
      return true;
    },
    deletePodcast: async (
      parent: any,
      { input }: PodcastInput,
      context: GraphQLContext
    ) => {
      try {
        const { prisma } = context;
        const { podcast } = input;

        await prisma.podcast.delete({
          where: {
            title: podcast,
          },
        });
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Query: {
    getPodcasts: async (parent: any, args: any, context: GraphQLContext) => {
      const { prisma } = context;
      try {
        const all_podcasts = await prisma.podcast.findMany();

        return all_podcasts;
      } catch (error) {
        console.log(error);
      }
    },
    getPodcast: async (
      parent: any,
      { input }: PodcastInput,
      context: GraphQLContext
    ) => {
      const { prisma } = context;
      const { podcast: podcastTitle } = input;

      try {
        const podcast = await prisma.podcast.findFirst({
          where: {
            title: podcastTitle,
          },
        });

        if (!podcast) {
          return false;
        }

        return podcast;
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
      try {
        const result = await fetch(
          `https://api.spotify.com/v1/search?q=${podcast}&type=show&market=US&limit=1`,
          {
            method: "GET",
            headers: { Authorization: "Bearer " + accessToken },
          }
        );

        const data = await result.json();
        return data?.shows?.items;
      } catch (error) {
        console.log(error);
      }
    },
    fetchCategoryPodcasts: async (
      parent: any,
      { input }: PodcastInput,
      context: GraphQLContext
    ) => {
      const { prisma } = context;
      const { category } = input;

      try {
        const getCategory = await prisma.category.findFirst({
          where: {
            name: category,
          },
        });

        const category_podcasts = await prisma.podcast.findMany({
          where: {
            categoryId: {
              equals: getCategory?.id,
            },
          },
        });

        return category_podcasts;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
