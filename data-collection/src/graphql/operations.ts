import gql from "graphql-tag";

export const Operations = {
  Queries: {},
  Mutations: {
    CreatePodcast: gql`
      mutation ($input: PodcastInput!) {
        createPodcast(input: $input)
      }
    `,
      CreateSponsor: gql`
      mutation ($input: PodcastInput!) {
        createSponsor(input: $input)
      }
    `
  },
};
