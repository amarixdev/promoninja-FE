import { PrismaClient } from "@prisma/client";
import { Sponsor } from "../../../data-collection/src/utils/types";

export interface GraphQLContext {
  prisma: PrismaClient;
  accessToken: string;
}

export interface PodcastInput {
  input: PodcastData;
}

export interface PodcastData {
  sponsor: Sponsor;
  podcast: string;
  category: string;
}

export interface SponsorInput {
  input: SponsorData;
}

export interface SponsorData {
  name: string;
  url: string;
  description: string;
  image?: string;
}
