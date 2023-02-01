import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    test: String
    podcasts: [Podcast]
    products: [Product]
    categories: [Category]
  }

  type Mutation {
    createProduct(input: AddProductInput): Product
  }

  type Mutation {
    createPodcast(input: AddPodcastInput): Podcast
  }

  type Mutation {
    createCategory(input: AddCategoryInput): Category
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
