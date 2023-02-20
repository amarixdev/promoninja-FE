import { prisma } from "@prisma/client";
import { GraphQLContext, PodcastInput } from "../../../util/types";

export const podcastResolvers = {
  Mutation: {
    createPodcast: async (
      parent: any,
      { input }: PodcastInput,
      context: GraphQLContext
    ) => {
      console.log("connected");
      const { prisma } = context;

      let { podcast, category } = input;

      category = category?.toLowerCase();

      const CATEGORY = await prisma.category.findFirst({
        where: {
          name: category,
        },
      });

      const createdPodcast = await prisma.podcast.create({
        data: {
          title: podcast,
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
          take: 10,
        });
        return podcasts;
      } catch (error) {}
    },
  },
};
