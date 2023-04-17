export interface Sponsor {
  name: string;
  url: string;
  promoCode: string;
  image: string;
  baseUrl: string;
  category: string;
  offer: string;
  summary: string;
}

export interface Podcasts {
  podcasts: PodcastData[];
}

export interface PodcastData {
  title: string;
  imageUrl: string;
  publisher: string;
  offer: OfferData;
  id: string;
}

export interface OfferData {
  sponsor: string;
  url: string;
  promoCode: string;
}
