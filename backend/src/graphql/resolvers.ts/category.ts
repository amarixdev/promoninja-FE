import { GraphQLContext } from "../../../util/types";

export const categoryResolvers = {
  Mutation: {
    createCategory: async (parent: any, args: any, context: GraphQLContext) => {
      const { prisma } = context;
      await prisma.category.create({
        data: {
          name: "Test",
        },
      });
      console.log("Success");
      return "HELLO FROM SERVER";
    },
  },
  Query: {
    test(parent: any, args: any, context: any) {
      return "Success";
    },
  },
};
