import { podcastResolvers } from "./podcast";
import { categoryResolvers } from "./category";
import { productResolvers } from "./sponsor";

import merge from "lodash.merge";
import { sponsorCategory } from "./sponsorCategory";

const resolvers = merge(
  {},
  podcastResolvers,
  categoryResolvers,
  productResolvers,
  sponsorCategory
);

export default resolvers;
