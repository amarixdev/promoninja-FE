import gql from "graphql-tag";

export const Operations = {
  Queries: {
    GetPodcasts: gql`
      query {
        getPodcasts {
          title
        }
      }
    `,
    FetchSponsors: gql`
      query ($input: PodcastInput!) {
        fetchSponsors(input: $input) {
          name
          imageUrl
          url
        }
      }
    `,
    GetSponsors: gql`
      query {
        getSponsors {
          name
          url
        }
      }
    `,
    FetchSpotifyPodcast: gql`
      query ($input: SpotifyAPI!) {
        fetchSpotifyPodcast(input: $input) {
          id
          name
          publisher
          description
          images {
            url
          }
        }
      }
    `,
    FetchCategory: gql`
      query ($input: PodcastInput!) {
        fetchCategory(input: $input)
      }
    `,
  },
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
    `,
    DeleteSponsor: gql`
      mutation ($input: DeleteInput) {
        deleteSponsor(input: $input)
      }
    `,
    UpdatePodcast: gql`
      mutation ($input: PodcastInput!) {
        updatePodcast(input: $input)
      }
    `,
  },
};
