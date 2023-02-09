import { CollectionConfig } from "payload/types";

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const PodcastCategory: CollectionConfig = {
  slug: "podcastCategory",
  admin: {
    useAsTitle: "category",
  },
  fields: [
    {
      name: "category",
      type: "text",
      required: true,
    },
  ],
};

export default PodcastCategory;
