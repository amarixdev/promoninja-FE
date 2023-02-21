import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    getPodcasts: [Podcast]
    getSponsors(input: PodcastInput!): [Sponsor]
  }

  type Mutation {
    createPodcast(input: PodcastInput!): Boolean
    updatePodcast: Boolean
    createSponsor(input: PodcastInput!): Boolean
    updateSponsor: Boolean
  }

  input PodcastInput {
    sponsor: SponsorInput
    podcast: String!
    category: String
  }

  input SponsorInput {
    name: String!
    url: String
    description: String
    image: String
  }

  type Podcast {
    id: ID!
    title: String!
    imageUrl: String
    categoryId: ID
    offer: [Offer]
    sponsorId: [ID]
  }

  type Category {
    id: ID!
    name: String!
  }
  type Offer {
    sponsor: String!
    description: String!
  }
  type Sponsor {
    id: ID!
    name: String!
    imageUrl: String
    podcastsId: [ID]
  }
`;

export default typeDefs;
