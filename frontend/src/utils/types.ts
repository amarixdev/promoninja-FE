export interface CategoryPodcast {
  [key: string]: PodcastData[] | undefined;
  comedy: PodcastData[];
  "news & politics": PodcastData[];
  technology: PodcastData[];
  educational: PodcastData[];
  lifestyle: PodcastData[];
  "true crime": PodcastData[];
  sports: PodcastData[];
}

export interface PodcastData {
  title: string;
  imageUrl: string;
  publisher: string;
  description: string;
  offer: OfferData[];
  backgroundColor: string
}

export interface SponsorData {
  name: string;
  imageUrl: string;
}

export interface OfferData {
  description: string;
  sponsor: string;
  url: string;
}
