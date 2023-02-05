import { CollectionConfig } from "payload/types";

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const sponsorMedia: CollectionConfig = {
  slug: "sponsor-media",
  admin: {
    useAsTitle: "alt",
  },
  upload: {
    staticURL: "/media/sponsor",
    staticDir: "media/sponsor",
    imageSizes: [
      {
        name: "card",
        width: 640,
        height: 480,
      },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "relationship",
      relationTo: "sponsor",
      required: false,
    },
  ],
};

export default sponsorMedia;
