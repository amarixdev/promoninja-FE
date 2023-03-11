import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    getPodcasts: [Podcast]
    getPodcast(input: PodcastInput!): Podcast
    getSponsors: [Sponsor]
    fetchCategory(input: PodcastInput!): String
    fetchSponsors(input: PodcastInput!): [Sponsor]
    fetchSpotifyPodcast(input: SpotifyAPI!): [Items]
    fetchCategoryPodcasts(input: PodcastInput!): [Podcast]
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
  }

  type Image {
    height: Int
    url: String
    width: Int
  }

  type Mutation {
    createPodcast(input: PodcastInput!): Boolean
    updatePodcast: Boolean
    createSponsor(input: PodcastInput!): Boolean
    updateSponsor: Boolean
    deleteSponsor(input: DeleteInput): Boolean
  }

  input DeleteInput {
    sponsor: String!
    podcast: String!
  }

  input PodcastInput {
    sponsor: SponsorInput
    podcast: String
    category: String
    image: String
    publisher: String
    description: String
  }

  input SponsorInput {
    name: String!
    url: String
    description: String
    image: String
    baseUrl: String
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
  }

  type Category {
    id: ID!
    name: String!
  }
  type Offer {
    sponsor: String!
    description: String!
    url: String!
  }
  type Sponsor {
    id: ID!
    name: String!
    imageUrl: String
    podcastsId: [ID]
    url: String!
  }
`;

export default typeDefs;
