import express from "express";
import * as fs from "fs";
import cors from "cors";
import { prisma } from "../prisma";

const app = express();

app.use(cors());

// Use express.json middleware to parse JSON requests
app.use(express.json());

app.post("/create-podcast", async (req, res) => {
  try {
    const { podcastTitle } = req.body;

    const createdPodcast = prisma.podcasts.create({
      data: {
        podcastTitle: podcastTitle,
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
