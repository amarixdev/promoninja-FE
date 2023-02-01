import { GraphQLContext } from "../../../util/types";

export const productResolvers = {
  Mutation: {
        createProduct(parent: any, args: any, context: GraphQLContext) {
   
      return true;
    },
  },
};
