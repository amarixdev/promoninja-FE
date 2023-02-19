import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
export const prisma = new PrismaClient();


interface Data {
  response: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const ALL_PODCASTS = await prisma.podcast.findMany({
      select: {},
    });
    // console.log(podcasts);
  } catch (error) {
    res.status(500).json({});
  }
}
