import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { prisma, PrismaClient } from "@prisma/client";
import resolvers from "./graphql/resolvers.ts";
import typeDefs from "./graphql/typeDefs";

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

const main = async () => {
  interface MyContext {
    prisma?: PrismaClient;
    test: String;
  }

  const server = new ApolloServer<MyContext>({
    resolvers,
    typeDefs,
  });
  const prisma = new PrismaClient();
  const PORT = 4000;

  const { url } = await startStandaloneServer(server, {
    context: async () => {
      return {
        test: "test",
        prisma,
      };
    },
    listen: { port: PORT },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

main().catch((err) => console.log(err));
