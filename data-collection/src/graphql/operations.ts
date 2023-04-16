import gql from "graphql-tag";

export const Operations = {
  Queries: {
    GetPodcasts: gql`
      query {
        getPodcasts {
          title
          imageUrl
        }
      }
    `,
    GetPodcast: gql`
      query ($input: PodcastInput!) {
        getPodcast(input: $input) {
          title
          imageUrl
          publisher
          description
          backgroundColor
          offer {
            sponsor
            promoCode
            url
          }
        }
      }
    `,
    GetSponsor: gql`
      query ($input: SponsorInput!) {
        getSponsor(input: $input) {
          name
          imageUrl
          url
        }
      }
    `,

    GetSponsorCategory: gql`
      query ($input: SponsorCategoryInput!) {
        getSponsorCategory(input: $input) {
          name
          imageUrl
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
          imageUrl
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
          external_urls {
            spotify
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
    DeletePodcastSponsor: gql`
      mutation ($input: DeleteInput) {
        deletePodcastSponsor(input: $input)
      }
    `,
    DeleteSponsor: gql`
      mutation ($input: DeleteInput) {
        deleteSponsor(input: $input)
      }
    `,
    UpdateColor: gql`
      mutation ($input: PodcastInput!) {
        updateColor(input: $input)
      }
    `,
    UpdateOffers: gql`
      mutation ($input: PodcastInput!) {
        updateOffers(input: $input)
      }
    `,

    DeletePodcast: gql`
      mutation ($input: PodcastInput!) {
        deletePodcast(input: $input)
      }
    `,
  },
};
