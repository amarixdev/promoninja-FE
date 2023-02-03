import { CollectionConfig } from "payload/types";
import { buildConfig } from "payload/config";

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Promos: CollectionConfig = {
  slug: "sponsor",
  admin: {
    useAsTitle: "company",
  },
  fields: [
    {
      name: "company",
      type: "text",
      required: true,
    },
    {
      name: "promoCode",
      type: "text",
      required: true,
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      required: false,
    },
  ],
};

export default Promos;
