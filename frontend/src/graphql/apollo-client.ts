import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import APIContext from "../context/context";
import { useContext } from "react";

const GraphQLServer = "http://localhost:4000/graphql";

const httpLink = new HttpLink({
  uri: GraphQLServer,
});



const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  
});

export default client;
