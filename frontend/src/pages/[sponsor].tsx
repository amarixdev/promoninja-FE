import {
  Spinner
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRef } from "react";
import Sidebar from "../components/layout/Sidebar";
import BackButton from "../components/misc/BackButton";
import SponsorBanner from "../components/podcasts-sponsors/SponsorBanner";
import SponsorHero from "../components/podcasts-sponsors/SponsorHero";
import PodcastList from "../components/podcasts-sponsors/SponsorPodcastList";
import { NavContext } from "../context/navContext";
import client from "../graphql/apollo-client";
import { Operations } from "../graphql/operations";
import {
  convertToSlug
} from "../utils/functions";
import {
  useScrollRestoration,
  useSetCurrentPage
} from "../utils/hooks";
import { SponsorCategory, SponsorData } from "../utils/types";

interface Props {
  sponsorData: SponsorData;
  sponsorCategoryData: SponsorCategory[];
  loading: boolean;
}

const SponsorPage = ({ sponsorData, sponsorCategoryData }: Props) => {
  const router = useRouter();
  useScrollRestoration(router);
  const { ninjaMode, setCategoryIndex } = NavContext();
  const bannerBreakpointRef = useRef<HTMLDivElement>(null);
  const categoryIndex = sponsorCategoryData?.findIndex(
    (sponsor) => sponsor.name === sponsorData?.sponsorCategory[0].name
  );

  useSetCurrentPage({
    home: false,
    podcasts: false,
    search: false,
    offers: false,
  });

  if (!sponsorData) return <Spinner />;

  return (
    <div className="flex ">
      <Sidebar />
      <BackButton sponsorPage={true} />

      {ninjaMode ? (
        <div
          className={` from-[#151515] bg-gradient-to-b  absolute w-full h-[400px] z-0 `}
        ></div>
      ) : (
        <div
          className={` from-[#606060] bg-gradient-to-b  absolute w-full h-[400px] z-0 `}
        ></div>
      )}
      {
        <div
          className={`${
            ninjaMode
              ? "bg-gradient-to-b from-[#0c0c0c] to-[#000000] "
              : "bg-gradient-to-b from-[#454545] to-[#101010] "
          } flex flex-col items-center w-full`}
        >
          {
            <div className={`fixed w-full z-50 lg:ml-[240px]`}>
              <SponsorBanner
                bannerBreakpointRef={bannerBreakpointRef}
                sponsorData={sponsorData}
              />
            </div>
          }
          <SponsorHero
            bannerBreakpointRef={bannerBreakpointRef}
            categoryIndex={categoryIndex}
            ninjaMode={ninjaMode}
            setCategoryIndex={setCategoryIndex}
            sponsorData={sponsorData}
          />
          <PodcastList sponsorData={sponsorData} />
        </div>
      }
    </div>
  );
};

export default SponsorPage;

export const getStaticPaths = async () => {
  let { data: sponsorsData } = await client.query({
    query: Operations.Queries.GetSponsors,
    variables: {
      input: {
        offerPage: false,
        path: true,
      },
    },
  });
  sponsorsData = sponsorsData.getSponsors;
  const paths = sponsorsData.map((sponsor: SponsorData) => ({
    params: { sponsor: convertToSlug(sponsor.name) },
  }));
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }: any) => {
  const { sponsor } = params;
  console.log(sponsor);
  const slugToSponsor = sponsor.split("-").join(" ").toLowerCase();

  let { data: sponsorData } = await client.query({
    query: Operations.Queries.GetSponsor,
    variables: {
      input: {
        name: slugToSponsor,
      },
    },
  });

  let { data: sponsorCategoryData } = await client.query({
    query: Operations.Queries.GetSponsorCategories,
  });

  sponsorData = sponsorData?.getSponsor;
  sponsorCategoryData = sponsorCategoryData?.getSponsorCategories;
  const oneWeek = 604800;

  return {
    props: {
      sponsorData,
      sponsorCategoryData,
      revalidate: oneWeek,
    },
  };
};
