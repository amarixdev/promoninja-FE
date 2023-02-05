import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    test: String
    shows: Shows
  }

  type Shows {
    items: [Items]
  }

  type Items {
    id: ID
    name: String
    images: [Images]
    total_episodes: Int
  }

  type Images {
    url: String
  }

  type Category {
    limit: Int
    next: String
  }

  type Mutation {
    createProduct(input: AddProductInput): String
  }

  type Mutation {
    createPodcast(input: AddPodcastInput): String
  }

  type Mutation {
    createCategory(input: AddCategoryInput): String
  }

  type Product {
    name: String
    categoryId: String
    promoCode: String
    discount: String
    podcasts: [Podcast]
  }

  type Podcast {
    title: String
    creator: String
    description: String
    imageUrl: String
    promoCode: String
    products: Product
  }

  type Category {
    name: String
    products: [Product]
  }

  input AddCategoryInput {
    name: String
  }

  input AddProductInput {
    name: String
    categoryId: String
    promoCode: String
    discount: String
  }

  input AddPodcastInput {
    title: String
    creator: String
    description: String
    imageUrl: String
    promoCode: String
  }
`;

export default typeDefs;
