import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import resolvers from "./graphql/resolvers.ts";
import typeDefs from "./graphql/typeDefs";

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

const main = async () => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
  });

  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests

  const PORT = 4000;

  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

main().catch((err) => console.log(err));
