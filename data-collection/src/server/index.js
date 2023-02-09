import express from "express";
import * as fs from "fs";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

const app = express();

app.use(cors());

app.use(express.json());

app.post("/create-podcast", async (req, res) => {
  try {
    await prisma.$connect();
    const { podcast, category } = req.body;
    console.log(podcast);
    const createdPodcast = await prisma.podcasts.create({
      data: {
        podcastTitle: podcast.title,
        category: category.id,
        creator: podcast.creator,
      },
    });

    res.json({ createdPodcast });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.listen(3333, () => {
  console.log("Listening on port 3333");
});
