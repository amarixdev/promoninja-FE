import { podcastResolvers } from "./podcast";
import { categoryResolvers } from "./category";
import { productResolvers } from "./product";

import merge from "lodash.merge";

const resolvers = merge(
  {},
  podcastResolvers,
  categoryResolvers,
  productResolvers
);

export default resolvers