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

  type Mutation {
    createPodcast(input: PodcastInput!): Boolean
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
  }

  type Image {
    height: Int
    url: String
    width: Int
  }

  input DeleteInput {
    sponsor: String
    podcast: String
  }

  input PodcastInput {
    sponsor: SponsorInput
    podcast: String
    category: String
    image: String
    publisher: String
    description: String
    backgroundColor: String
    offer: [OfferInput]
  }

  input OfferInput {
    sponsor: String!
    description: String!
    url: String!
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
    backgroundColor: String
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
