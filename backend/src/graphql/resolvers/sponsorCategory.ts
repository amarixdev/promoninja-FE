import { GraphQLContext, SponsorCategory } from "../../util/types";

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
      { input }: SponsorCategory,
      context: GraphQLContext
    ) => {
      const { prisma } = context;

      const { category, sponsor } = input;
      let result;

      if (sponsor === undefined) {
        result = await prisma.sponsorCategory.findFirst({
          where: {
            name: {
              equals: category,
              mode: "insensitive",
            },
          },
          include: {
            sponsor: {
              include: {
                podcast: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        });
      } else {
        const getSponsor = await prisma.sponsor.findFirst({
          where: {
            name: sponsor,
          },
        });

        result = await prisma.sponsorCategory.findFirst({
          where: {
            sponsorId: {
              has: getSponsor?.id,
            },
          },
        });
      }
      console.log(result);
      return result;
    },
    getCategorySponsors: async (
      parent: any,
      { input }: SponsorCategory,
      context: GraphQLContext
    ) => {
      const { prisma } = context;
      const { category, pageSize, offset } = input;
      console.log("offset", offset, "pageSize", pageSize);
      const getCategoryId = await prisma.sponsorCategory.findFirst({
        where: {
          name: {
            equals: category,
            mode: "insensitive",
          },
        },
      });

      const result = await prisma.sponsor.findMany({
        where: {
          sponsorCategoryId: {
            equals: getCategoryId?.id,
          },
        },
        skip: offset,
        take: pageSize,

        orderBy: {
          name: "asc",
        },
      });
      return result;
    },
  },
  Mutation: {},
};
