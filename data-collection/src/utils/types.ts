export interface Sponsor {
  name: string;
  url: string;
  description: string;
  image: string;
  baseUrl: string;
}

export interface Podcasts {
  podcasts: PodcastData[];
}

export interface PodcastData {
  title: string;
  imageUrl: string;
}
