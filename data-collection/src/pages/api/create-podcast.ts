// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
export const prisma = new PrismaClient();

interface Data {
  message: {
    podcast: string;
    sponsor: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    await prisma.$connect();
    console.log("connected");
    let { podcast, category, text: sponsor, sponsorReq } = req.body;
    console.log("req: " + sponsorReq);

    if (sponsorReq) {
      /* Add sponsor.update feature */
      const createdSponsor = await prisma.podcast.update({
        where: {
          title: podcast,
        },
        data: {
          offer: {
            push: {
              sponsor: sponsor.name,
              description: sponsor.description,
            },
          },
          sponsors: {
            create: {
              name: sponsor.name,
            },
          },
        },
      });

      console.log("sponsor-created");
    } else {
      category = category.toLowerCase();
      const CATEGORY = await prisma.category.findFirst({
        where: {
          name: category,
        },
      });

      console.log(category);
      const createdPodcast = await prisma.podcast.create({
        data: {
          title: podcast,
          category: {
            connect: {
              id: CATEGORY?.id,
            },
          },
        },
      });
      console.log("podcast-created");
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: {
        podcast: "Podcast already exists!",
        sponsor: "Sponsor already exists!",
      },
    });
  }
}
