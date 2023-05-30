import { prisma } from "@prisma/client";
import {
  CountInput,
  DeleteInput,
  GraphQLContext,
  Pagination,
  PodcastInput,
  SponsorInput,
  TrendingOffersInput,
} from "../../util/types";

export const productResolvers = {
  Mutation: {
    createSponsor: async (
      parent: any,
      { input }: PodcastInput,
      context: GraphQLContext
    ) => {
      const { prisma } = context;
      let { podcast, sponsor } = input;

      const getSponsorCategory = await prisma.sponsorCategory.findFirst({
        where: {
          name: sponsor.category,
        },
      });

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
                promoCode: sponsor.promoCode,
                url: sponsor.url,
              },
            },

            sponsors: {
              connectOrCreate: {
                where: {
                  name: sponsor.name,
                },
                create: {
                  name: sponsor.name,
                  imageUrl: sponsor.image,
                  url: sponsor.baseUrl,
                  offer: sponsor.offer,
                  summary: sponsor.summary,
                },
              },
              update: {
                where: {
                  name: sponsor.name,
                },
                data: {
                  sponsorCategory: {
                    connect: {
                      id: getSponsorCategory?.id,
                    },
                  },
                },
              },
            },
          },
        });
      } catch (error) {
        error;
      }

      return true;
    },

    deletePodcastSponsor: async (
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
            sponsors: {
              disconnect: {
                id: getSponsor?.id,
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
    deleteSponsor: async (
      parent: any,
      { input }: DeleteInput,
      context: GraphQLContext
    ) => {
      const { prisma } = context;
      const { sponsor, podcast, category } = input;

      const getSponsor = await prisma.sponsor.findFirst({
        where: {
          name: sponsor,
        },
      });

      const getSponsorCategory = await prisma.sponsorCategory.findFirst({
        where: {
          name: category,
        },
      });

      await prisma.sponsorCategory.update({
        where: {
          id: getSponsorCategory?.id,
        },
        data: {
          sponsor: {
            disconnect: {
              id: getSponsor?.id,
            },
          },
        },
      });

      /* Delete individual offers from podcasts */

      await prisma.podcast.updateMany({
        where: {
          sponsorId: {
            has: getSponsor?.id,
          },
        },
        data: {
          offer: {
            deleteMany: {
              where: {
                sponsor: {
                  equals: sponsor,
                },
              },
            },
          },
        },
      });

      /* Disconnect Sponsors from multiple podcasts */
      await prisma.sponsor.update({
        where: {
          name: sponsor,
        },
        data: {
          podcast: {
            set: [],
          },
        },
      });

      /* Delete sponsor */

      await prisma.sponsor.delete({
        where: {
          name: sponsor,
        },
      });
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
            title: {
              equals: podcast,
              mode: "insensitive",
            },
          },
        });
        let sponsors;

        if (selectedPodcast) {
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
    getSponsors: async (
      parent: any,
      { input }: Pagination,
      context: GraphQLContext
    ) => {
      const { prisma } = context;
      const { offset, pageSize, offerPage } = input;
      console.log("running");
      if (!offerPage) {
        const sponsors = await prisma.sponsor.findMany({
          select: {
            name: true,
            imageUrl: true,
            url: true,
          },
        });
        return sponsors;
      } else {
        const sponsors = await prisma.sponsor.findMany({
          include: {
            sponsorCategory: true,
          },
          orderBy: {
            name: "asc",
          },
          skip: offset,
          take: pageSize,
        });

        return sponsors;
      }
    },
    getSponsorsCount: async (
      parent: any,
      { input }: CountInput,
      context: GraphQLContext
    ) => {
      const { prisma } = context;
      const { isCategory, category } = input;

      if (isCategory) {
        const getCategory = await prisma.sponsorCategory.findFirst({
          where: {
            name: category,
          },
        });

        const sponsors = await prisma.sponsor.findMany({
          where: {
            sponsorCategoryId: {
              equals: getCategory?.id,
            },
          },
        });

        return sponsors.length;
      } else {
        return await prisma.sponsor.count();
      }
    },

    getSponsor: async (
      parent: any,
      { input }: SponsorInput,
      context: GraphQLContext
    ) => {
      const { prisma } = context;
      const { name } = input;

      const sponsor = await prisma.sponsor.findFirst({
        where: {
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
        include: {
          podcast: {
            include: {
              category: true,
            },
            orderBy: {
              title: "asc",
            },
          },
          sponsorCategory: true,
        },
      });
      return sponsor;
    },
    getTrendingOffers: async (
      parent: any,
      { input }: TrendingOffersInput,
      context: GraphQLContext
    ) => {
      const { prisma } = context;
      const { sponsors } = input;

      const trendingOffers = await prisma.sponsor.findMany({
        where: {
          name: {
            in: sponsors,
          },
        },
      });

      return trendingOffers.sort(() => Math.random() - 0.5);
    },
  },
};
