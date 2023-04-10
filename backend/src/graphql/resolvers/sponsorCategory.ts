import {
  GraphQLContext,
  SponsorCategory,
  SponsorCategoryInput,
} from "../../util/types";

export const sponsorCategory = {
  Query: {
    getSponsorCategories: async (
      parent: any,
      args: any,
      context: GraphQLContext
    ) => {
      const { prisma } = context;
      const sponsorCategories = await prisma.sponsorCategory.findMany();

      return sponsorCategories;
    },
    getSponsorCategory: async (
      parent: any,
      { input }: SponsorCategoryInput,
      context: GraphQLContext
    ) => {
      const { prisma } = context;
      console.log(input);
      const category = await prisma.sponsorCategory.findFirst({
        where: {
          name: input,
        },
      });
      return category;
    },
  },
  Mutation: {},
};
