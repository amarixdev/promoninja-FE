import express from "express";
import * as fs from "fs";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

const app = express();

app.use(cors());

app.use(express.json());

app.post("/create-podcast", async (req, res) => {
  const removeLeadingSpaces = (str) => {
    return str.replace(/^\s+/, "");
  };

  try {
    await prisma.$connect();
    let { podcast, category } = req.body;
    category = category.toLowerCase();

    console.log(category);

    const CATEGORY = await prisma.category.findFirst({
      where: {
        name: category,
      },
    });

    const createdPodcast = await prisma.podcast.create({
      data: {
        title: podcast.title,
        category: {
          connect: {
            id: CATEGORY?.id,
          },
        },
      },
    });


    console.log(FIND_PODCASTS);

    res.json({ createdPodcast });
  } catch (error) {
    res.status(500).json({ message: "Podcast already exists!" });
  }
});

app.listen(3333, () => {
  console.log("Listening on port 3333");
});
