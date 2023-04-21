import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    getPodcasts: [Podcast]
    getPodcast(input: PodcastInput!): Podcast
    getPodcastCategory(input: PodcastInput!): Category
    getSponsors: [Sponsor]
    getSponsor(input: SponsorInput!): Sponsor
    getSponsorCategories: [SponsorCategory]
    getSponsorCategory(input: SponsorCategoryInput!): SponsorCategory
    getSponsorPodcasts(input: SponsorInput!): [Podcast]
    getCategorySponsors(input: SponsorCategoryInput!): [Sponsor]
    getCategoryPodcasts(input: String!): [Podcast]
    fetchCategory(input: PodcastInput!): String
    getCategories: [Category]
    fetchSponsors(input: PodcastInput!): [Sponsor]
    fetchSpotifyPodcast(input: SpotifyAPI!): [Items]
    fetchCategoryPodcasts(input: PodcastInput!): [Podcast]
  }

  type Mutation {
    createPodcast(input: PodcastInput!): Boolean
    updateCategory(input: UpdateCategoryInput!): Boolean
    updateColor(input: PodcastInput!): Boolean
    updateOffers(input: PodcastInput!): Boolean
    createSponsor(input: PodcastInput!): Boolean
    updateSponsor: Boolean
    deletePodcastSponsor(input: DeleteInput): Boolean
    deleteSponsor(input: DeleteInput): Boolean
    deletePodcast(input: PodcastInput!): Boolean
  }

  input SpotifyAPI {
    podcast: String
  }

  type Items {
    id: ID
    images: [Image]
    name: String
    publisher: String
    description: String
    external_urls: External_urls
  }

  type Image {
    height: Int
    url: String
    width: Int
  }

  type External_urls {
    spotify: String
  }

  input DeleteInput {
    sponsor: String
    podcast: String
    category: String
  }

  input PodcastInput {
    sponsor: SponsorInput
    podcast: String
    category: String
    image: String
    publisher: String
    description: String
    backgroundColor: String
    externalUrl: String
    offer: [OfferInput]
  }

  input OfferInput {
    sponsor: String!
    promoCode: String!
    url: String!
  }

  input SponsorInput {
    name: String!
    url: String
    description: String
    image: String
    baseUrl: String
    category: String
    summary: String
    promoCode: String
    offer: String
  }

  type Podcast {
    id: ID!
    title: String!
    imageUrl: String
    categoryId: ID
    offer: [Offer]
    sponsorId: [ID]
    publisher: String
    description: String
    backgroundColor: String
    externalUrl: String
  }

  type Category {
    id: ID!
    name: String!
    podcastId: [ID]
  }
  type Offer {
    sponsor: String!
    promoCode: String!
    url: String!
  }
  type Sponsor {
    id: ID!
    name: String!
    imageUrl: String
    podcastsId: [ID]
    url: String!
    summary: String
    offer: String
  }

  input SponsorCategoryInput {
    sponsor: String
    category: String
  }

  input UpdateCategoryInput {
    oldCategory: String!
    newCategory: String!
    podcastTitle: String
    sponsorName: String
  }

  type SponsorCategory {
    name: String!
    imageUrl: String
  }
`;

export default typeDefs;
