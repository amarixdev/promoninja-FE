export interface Sponsor {
  name: string;
  url: string;
  promoCode: string;
  image: string;
  baseUrl: string;
  category: string;
  offer: string;
}

export interface Podcasts {
  podcasts: PodcastData[];
}

export interface PodcastData {
  title: string;
  imageUrl: string;
}
