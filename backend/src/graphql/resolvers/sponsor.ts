import { GraphQLBoolean } from "graphql";
import {
  GraphQLContext,
  PodcastInput,
  SponsorInput,
} from "../../../util/types";

export const productResolvers = {
  Mutation: {
    createSponsor: async (
      parent: any,
      { input }: PodcastInput,
      context: GraphQLContext
    ) => {
      const { prisma } = context;
      let { podcast, sponsor, category } = input;
      category = category?.toLowerCase();

      console.log(category);

      const CATEGORY = await prisma.category.findFirst({
        where: {
          name: category,
        },
      });

      const existingPodcast = await prisma.podcast.findFirst({
        where: {
          title: podcast,
        },
      });

      if (!existingPodcast) {
        try {
          const createdSponsor = await prisma.sponsor.create({
            data: {
              name: sponsor.name,
              podcast: {
                create: {
                  title: podcast,
                  offer: {
                    sponsor: sponsor.name,
                    description: sponsor.description,
                  },
                  category: {
                    connect: {
                      id: CATEGORY?.id,
                    },
                  },
                },
              },
            },
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const updatedSponsor = await prisma.podcast.update({
            where: {
              title: podcast,
            },
            data: {
              offer: {
                push: {
                  sponsor: sponsor.name,
                  description: sponsor.description,
                },
              },
              sponsors: {
                create: {
                  name: sponsor.name,
                },
              },
            },
          });
        } catch (error) {
          console.log(error);
        }
      }

      //   console.log(createdSponsor);
      return true;
    },
  },
  Query: {},
};
