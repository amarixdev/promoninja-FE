import { CollectionConfig } from "payload/types";

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Podcasts: CollectionConfig = {
  slug: "podcasts",
  admin: {
    useAsTitle: "podcastTitle"
  },
  fields: [
    {
      name: "podcastTitle",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "text",
      required: false,
    },
    {
      name: "sponsors",
      type: "relationship",
      relationTo: "sponsor",
      required: true,
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      required: true,
    },
  ],
};

export default Podcasts;
