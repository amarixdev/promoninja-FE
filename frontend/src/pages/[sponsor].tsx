import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRef } from "react";
import SponsorBanner from "../components/banners/SponsorBanner";
import Sidebar from "../components/layout/Sidebar";
import BackButton from "../components/misc/BackButton";
import SponsorHero from "../components/podcasts-sponsors/SponsorHero";
import PodcastList from "../components/podcasts-sponsors/SponsorPodcastList";
import { NavContext } from "../context/navContext";
import client from "../graphql/apollo-client";
import { Operations } from "../graphql/operations";
import { convertToSlug } from "../utils/functions";
import {
  useMediaQuery,
  useScrollRestoration,
  useSetCurrentPage,
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
  const columnBreakPointRef = useRef<HTMLDivElement>(null);
  const categoryIndex = sponsorCategoryData?.findIndex(
    (sponsor) => sponsor.name === sponsorData?.sponsorCategory[0].name
  );
  console.log(columnBreakPointRef);
  const isBreakPoint = useMediaQuery(1023);
  useSetCurrentPage({
    home: false,
    podcasts: false,
    search: false,
    offers: false,
  });

  if (!sponsorData) return <Spinner />;

  return (
    <div className="flex">
      <Sidebar />
      <div className="lg:ml-[240px] w-full">
        {
          <div
            className={` flex flex-col items-center w-full ${
              ninjaMode && !isBreakPoint
                ? "bg-gradient-to-b from-[#0c0c0c]  "
                : !isBreakPoint
                ? "bg-gradient-to-b from-[#525252] "
                : ""
            }`}
          >
            {
              <div className={`fixed w-full z-50 lg:ml-[240px]`}>
                <SponsorBanner
                  bannerBreakpointRef={bannerBreakpointRef}
                  sponsorData={sponsorData}
                  columnBreakpointRef={columnBreakPointRef}
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
            <PodcastList
              columnBreakpointRef={columnBreakPointRef}
              sponsorData={sponsorData}
            />
          </div>
        }
      </div>
      <BackButton sponsorPage={true} />
    </div>
  );
};

export default SponsorPage;

export const getStaticPaths = async () => {
  try {
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
  } catch (error) {
    console.error("Error fetching sponsors in getStaticPaths:", error);
    return {
      paths: [],
      fallback: true,
    };
  }
};

export const getStaticProps = async ({ params }: any) => {
  const { sponsor } = params;
  console.log(sponsor);
  const slugToSponsor = sponsor.split("-").join(" ").toLowerCase();

  try {
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

    if (!sponsorData) {
      return {
        notFound: true,
      };
    }

    const oneWeek = 604800;

    return {
      props: {
        sponsorData,
        sponsorCategoryData,
        revalidate: oneWeek,
      },
    };
  } catch (error) {
    console.error("Error fetching sponsor data in getStaticProps:", error);
    return {
      notFound: true,
    };
  }
};
