import {
  GraphQLContext,
  PodcastInput,
  SponsorCategoryInput,
} from "../../util/types";

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
      return category?.name;
    },
    getPodcastCategory: async (
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

      const category = await prisma.category.findFirst({
        where: {
          podcastId: {
            has: getPodcast?.id,
          },
        },
      });

      return category;
    },

    getCategoryPodcasts: async (
      parent: any,
      { category }: SponsorCategoryInput,
      context: GraphQLContext
    ) => {
      const { prisma } = context;

      const getCategory = await prisma.category.findFirst({
        where: {
          name: category,
        },
      });

      getCategory?.podcastId.forEach((id) =>
        prisma.podcast.findFirst({
          where: {
            id: id,
          },
        })
      );

      const podcasts = await prisma.podcast.findMany({
        where: {
          categoryId: {
            equals: getCategory?.id,
          },
        },
      });
      return podcasts;
    },
    getCategories: async (parent: any, args: any, context: GraphQLContext) => {
      const { prisma } = context;
      const categories = await prisma.category.findMany();
      return categories;
    },
  },
};
