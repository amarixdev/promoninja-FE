import { buildConfig } from "payload/config";
import path from "path";
// import Examples from './collections/Examples';
import Users from "./collections/Users";
import Podcasts from "./collections/Podcasts";
import Sponsors from "./collections/Sponsors";
import SponsorMedia from "./collections/SponsorMedia";
import PodcastMedia from "./collections/PodcastMedia";
import PodcastCategory from "./collections/PodcastCategory";

export default buildConfig({
  serverURL: "http://localhost:3000",
  admin: {
    user: Users.slug,
  },

  collections: [
    Users,
    Podcasts,
    Sponsors,
    SponsorMedia,
    PodcastMedia,
    PodcastCategory,
    // Examples,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
});
