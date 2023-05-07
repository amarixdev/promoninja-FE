import gql from "graphql-tag";

export const Operations = {
  Queries: {
    GetPodcasts: gql`
      query {
        getPodcasts {
          title
          imageUrl
          publisher
          category {
            name
          }
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
          externalUrl
          offer {
            sponsor
            promoCode
            url
          }
          category {
            name
          }
        }
      }
    `,
    GetPodcastCategory: gql`
      query ($input: PodcastInput!) {
        getPodcastCategory(input: $input) {
          name
        }
      }
    `,
    FetchSponsors: gql`
      query ($input: PodcastInput!) {
        fetchSponsors(input: $input) {
          name
          imageUrl
          offer
          url
          summary
        }
      }
    `,
    GetSponsors: gql`
      query {
        getSponsors {
          name
          imageUrl
          url
        }
      }
    `,
    GetSponsor: gql`
      query ($input: SponsorInput!) {
        getSponsor(input: $input) {
          name
          imageUrl
          url
          summary
          offer
        }
      }
    `,
    GetSponsorCategories: gql`
      query {
        getSponsorCategories {
          name
        }
      }
    `,
    GetSponsorCategory: gql`
      query ($input: SponsorCategoryInput!) {
        getSponsorCategory(input: $input) {
          name
        }
      }
    `,
    GetSponsorPodcasts: gql`
      query ($input: SponsorInput!) {
        getSponsorPodcasts(input: $input) {
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
          category {
            name
          }
        }
      }
    `,

    GetPodcastCategories: gql`
      query {
        getPodcastCategories {
          name
          podcastId
        }
      }
    `,

    GetCategorySponsors: gql`
      query ($input: SponsorCategoryInput!) {
        getCategorySponsors(input: $input) {
          name
          imageUrl
          url
          summary
          offer
        }
      }
    `,
    FetchSpotifyPodcast: gql`
      query ($input: SpotifyAPI!) {
        fetchSpotifyPodcast(input: $input) {
          id
          name
          publisher
          images {
            url
          }
        }
      }
    `,
    FetchCategoryPodcasts: gql`
      query ($input: PodcastInput!) {
        fetchCategoryPodcasts(input: $input) {
          title
          imageUrl
          publisher
        }
      }
    `,
    GetTopPicks: gql`
      query ($input: TopPicksInput!) {
        getTopPicks(input: $input) {
          title
          imageUrl
          publisher
          category {
            name
          }
        }
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
  },
};
