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
          externalUrl
          offer {
            sponsor
            promoCode
            url
          }
          category {
            name
          }
          sponsors {
            name
            imageUrl
            url
            summary
            offer
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
          summary
          offer
          podcast {
            offer {
              sponsor
              promoCode
              url
            }
            category {
              name
            }
            title
            imageUrl
            publisher
            description
            backgroundColor
          }
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
      query ($input: Pagination) {
        getSponsors(input: $input) {
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
    FetchCategoryPodcasts: gql`
      query ($input: PodcastInput!) {
        fetchCategoryPodcasts(input: $input) {
          title
          imageUrl
          publisher
          id
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

    UpdateCategory: gql`
      mutation ($input: UpdateCategoryInput!) {
        updateCategory(input: $input)
      }
    `,

    DeletePodcast: gql`
      mutation ($input: PodcastInput!) {
        deletePodcast(input: $input)
      }
    `,
  },
};
