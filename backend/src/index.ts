import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { prisma, PrismaClient } from "@prisma/client";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";
import Axios from "axios";
import express from "express";
import * as dotenv from "dotenv";
import { createServer } from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";
import cors from "cors";
import { env } from "../environment";
import fetch from "node-fetch";

const { CLIENT_ID, CLIENT_SECRET } = env;

const main = async () => {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  interface MyContext {
    prisma?: PrismaClient;
    test: string;
  }

  const server = new ApolloServer<MyContext>({
    schema,
  });

  const prisma = new PrismaClient();
  const PORT = 4000;

  const { url } = await startStandaloneServer(server, {
    context: async ({ req, res }) => {

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
