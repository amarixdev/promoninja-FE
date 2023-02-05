import { CollectionConfig } from "payload/types";

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Podcasts: CollectionConfig = {
  slug: "podcasts",
  admin: {
    useAsTitle: "podcastTitle",
  },
  fields: [
    {
      name: "podcastTitle",
      type: "text",
      required: true,
    },
    {
      name: "sponsors",
      type: "relationship",
      relationTo: "sponsor",
      required: false,
      hasMany: true,
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "podcast-media",
      required: false,
    },
    {
      name: "offers",
      type: "array",
      unique: true,
      
      fields: [
        {
          name: "offer",
          type: "group",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "promotion",
                  type: "relationship",
                  relationTo: "sponsor",
                  required: false,
                },
                {
                  name: "description",
                  type: "textarea",
                  required: false,
                },
                {
                  name: "url",
                  type: "text",
                  required: false,
                },
              ],
            },
          ],
        },
      ],
      required: false,
    },
  ],
};

export default Podcasts;
