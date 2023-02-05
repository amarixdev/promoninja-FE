import gql from "graphql-tag";

export const Operations = {
  Mutations: {
    CREATE_CATEGORY: gql`
      mutation {
        createCategory
      }
    `,
    CREATE_PRODUCT: gql`
      mutation {
        createProduct
      }
    `,
    CREATE_PODCAST: gql`
      mutation {
        cratePodcast
      }
    `,
  },
  Queries: {
    
  },
};
