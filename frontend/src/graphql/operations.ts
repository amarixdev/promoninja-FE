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
    GetSponsors: gql`
      query {
        getSponsors {
          sponsorCategory {
            name
          }
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
          sponsor {
            name
            imageUrl
            offer
            summary
            url
            podcast {
              offer {
                sponsor
                promoCode
                url
              }
              title
              imageUrl
              publisher
              description
              backgroundColor
              category {
                name
              }
            }
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
          sponsors {
            name
            imageUrl
          }
          category {
            name
          }
        }
      }
    `,
    GetTrendingOffers: gql`
      query ($input: TrendingOffersInput!) {
        getTrendingOffers(input: $input) {
          imageUrl
          summary
          offer
          name
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
