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
  backgroundColor: string;
  externalUrl: string;
}

export interface SponsorData {
  name: string;
  imageUrl: string;
  url: string;
  summary: string;
  offer: string;
}

export interface OfferData {
  promoCode: string;
  sponsor: string;
  url: string;
}

export interface SponsorCategory {
  name: string;
  imageUrl: string;
}
