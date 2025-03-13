import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const GraphQLServer = process.env.NODE_ENV === 'production' 
  ? "https://promoninja-apollogql.herokuapp.com"
  : "http://localhost:4000/graphql";

const httpLink = new HttpLink({
  uri: GraphQLServer,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
