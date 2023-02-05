import fetch from "node-fetch";
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
    async shows(parent: any, args: any, context: GraphQLContext) {
      let offset = 0
      const { accessToken } = context;
      console.log(accessToken);
      const result = await fetch(
        `https://api.spotify.com/v1/search?q=shows&type=show&market=US&limit=50&offset=${offset}
        `,
        {
          method: "GET",
          headers: { Authorization: "Bearer " + accessToken },
        }
      );
      const data = await result.json();
      console.log(data.shows.items[0]);
      const { shows } = data;
      offset+=50
      return shows;
    },
  },
};
