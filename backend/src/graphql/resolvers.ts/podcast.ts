

export const podcastResolvers = {
  Mutation: {
    createPodcast: async (parent: any, args: any, context: any) => {
          const { prisma } = context;
          console.log (prisma)
    },
  },
  Query: {
 
  }
};
