import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    podcast: [Podcast]
    sponsor: [Sponsor]
  }

  type Mutation {
    createPodcast: Boolean
    updatePodcast: Boolean
  }

  type Podcast {
    id: ID!
    title: String!
    imageUrl: String
    sponsors: [Sponsor]
    category: [Category]
    offer: [PodcastSponsor]
  }

  type Category {
    id: ID!
    name: String!
  }

  type Sponsor {
    id: ID!
    name: String!
    imageUrl: String
    podcasts: [Sponsor]
  }

`;

export default typeDefs;
