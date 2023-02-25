import { GraphQLBoolean } from "graphql";
import {
  DeleteInput,
  GraphQLContext,
  PodcastInput,
  SponsorInput,
} from "../../util/types";

export const productResolvers = {
  Mutation: {
    createSponsor: async (
      parent: any,
      { input }: PodcastInput,
      context: GraphQLContext
    ) => {
      const { prisma } = context;
      let { podcast, sponsor, category, publisher } = input;
      category = category?.toLowerCase();

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
          await prisma.sponsor.create({
            data: {
              name: sponsor.name,
              podcast: {
                create: {
                  title: podcast,
                  offer: {
                    sponsor: sponsor.name,
                    description: sponsor.description,
                  },
                  publisher,
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
          console.log("updating... ");
          await prisma.podcast.update({
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
                connectOrCreate: {
                  where: {
                    name: sponsor.name,
                  },
                  create: {
                    name: sponsor.name,
                  },
                },
              },
            },
          });
        } catch (error) {
          console.log(error);
        }
      }

      return true;
    },
    deleteSponsor: async (
      parent: any,
      { input }: DeleteInput,
      context: GraphQLContext
    ) => {
      const { prisma } = context;
      const { sponsor: deletedSponsor, podcast } = input;

      try {
        const getPodcast = await prisma.podcast.findFirst({
          where: {
            title: podcast,
          },
        });

        const getSponsor = await prisma.sponsor.findFirst({
          where: {
            name: deletedSponsor,
          },
        });

        /* Remove the sponsor offer from podcast */
        await prisma.podcast.update({
          where: {
            id: getPodcast?.id,
          },
          data: {
            offer: {
              deleteMany: {
                where: {
                  sponsor: deletedSponsor,
                },
              },
            },
          },
        });

        /* Disconnect sponsor-to-podcast relationship */
        await prisma.sponsor.update({
          where: {
            id: getSponsor?.id,
          },
          data: {
            podcast: {
              disconnect: {
                id: getPodcast?.id,
              },
            },
          },
        });

        return true;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Query: {
    fetchSponsors: async (
      parent: any,
      { input }: PodcastInput,
      context: GraphQLContext
    ) => {
      const { prisma } = context;
      const { podcast } = input;

      try {
        const selectedPodcast = await prisma.podcast.findFirst({
          where: {
            title: podcast,
          },
        });
        let sponsors;

        if (selectedPodcast) {
          /* Find all sponsors for given podcast */
          sponsors = await prisma.sponsor.findMany({
            where: {
              podcastId: {
                has: selectedPodcast?.id,
              },
            },
          });
        }

        return sponsors;
      } catch (error: any) {
        console.log(error);
      }
    },
    getSponsors: async (parent: any, args: any, context: GraphQLContext) => {
      const { prisma } = context;
      const sponsors = prisma.sponsor.findMany();
      return sponsors;
    },
  },
};
