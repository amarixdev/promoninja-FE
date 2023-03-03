
export interface CategoryPodcast {
  comedy: PodcastData[];
  technology: PodcastData[];
  "news & politics": PodcastData[];
  lifestyle: PodcastData[];
  educational: PodcastData[];
}

export interface PodcastData {
  title: string;
  imageUrl: string;
  publisher:string
}
