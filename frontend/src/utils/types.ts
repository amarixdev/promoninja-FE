export interface CategoryPodcast {
  [key: string]: PodcastData[] | undefined;
  comedy: PodcastData[];
  "news & politics": PodcastData[];
  technology: PodcastData[];
  educational: PodcastData[];
  society: PodcastData[];
  "true crime": PodcastData[];
  sports: PodcastData[];
}

export interface PodcastData {
  title: string;
  imageUrl: string;
  publisher: string;
  description: string;
  offer: OfferData[];
  sponsors: SponsorData[];
  backgroundColor: string;
  externalUrl: string;
  category: [Category];
}

export interface Category {
  name: string;
}

export interface SponsorData {
  name: string;
  imageUrl: string;
  url: string;
  summary: string;
  offer: string;
  podcast: PodcastData[] 
}

export interface OfferData {
  promoCode: string;
  sponsor: string;
  url: string;
}

export interface SponsorCategory {
  name: string;
  sponsor: SponsorData[]
}
