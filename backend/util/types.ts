import { PrismaClient } from "@prisma/client";


export interface GraphQLContext {
  prisma: PrismaClient;
  accessToken: String
  }