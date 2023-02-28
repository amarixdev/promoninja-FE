import { GraphQLContext, PodcastInput } from "../../util/types";

export const categoryResolvers = {
  Mutation: {},
  Query: {
    fetchCategory: async (
      parent: any,
      { input }: PodcastInput,
      context: GraphQLContext
    ) => {
      const { prisma } = context;
      const { podcast } = input;
      const getPodcast = await prisma.podcast.findFirst({
        where: {
          title: podcast,
        },
      });

      // console.log(getPodcast)

      const category = await prisma.category.findFirst({
        where: {
          podcastId: {
            has: getPodcast?.id,
          },
        },
        select: {
          name: true,
        },
      });

      console.log(category?.name);

      return category?.name;
    },
  },
};
