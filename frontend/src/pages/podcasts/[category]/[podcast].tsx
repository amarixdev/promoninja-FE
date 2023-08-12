import { Spinner, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Sidebar from "../../../components/layout/Sidebar";
import BackButton from "../../../components/misc/BackButton";
import DescriptionDrawer from "../../../components/podcasts-sponsors/DescriptionDrawer";
import client from "../../../graphql/apollo-client";
import { Operations } from "../../../graphql/operations";
import PodcastBanner from "../../../components/banners/PodcastBanner";
import PodcastHero from "../../../components/podcasts-sponsors/PodcastHero";
import SponsorList from "../../../components/podcasts-sponsors/PodcastSponsorList";
import { convertToSlug } from "../../../utils/functions";
import {
  useMediaQuery,
  useScrollRestoration,
  useSetCurrentPage,
} from "../../../utils/hooks";
import { PodcastData } from "../../../utils/types";

interface Props {
  podcastData: PodcastData;
  category: string;
}

const Podcast = ({ podcastData, category }: Props) => {
  const router = useRouter();

  useScrollRestoration(router);
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();

  const imageSrc = podcastData?.imageUrl;
  const isBreakPoint = useMediaQuery(1023);
  const [sponsorOfferDrawer, setSponsorOfferDrawer] = useState(true);
  const [podcastDrawer, setPodcastDrawer] = useState(false);
  const [drawerData, setDrawerData] = useState({
    image: "",
    title: "",
    subtitle: "",
    description: "",
    url: "",
    promoCode: "",
    category: "",
  });
  const bannerBreakpointRef = useRef<HTMLDivElement>(null);
  const columnBreakpointRef = useRef<HTMLDivElement>(null);

  let existingSponsor: boolean = true;
  useSetCurrentPage({
    home: false,
    podcasts: false,
    search: false,
    offers: false,
  });

  if (!podcastData?.sponsors) {
    existingSponsor = false;
  }

  if (!imageSrc)
    return (
      <div className="flex w-full h-screen items-center justify-center ">
        <Spinner />
      </div>
    );

  const handleDrawer = (sponsor: string, isSponsorOfferDrawer: boolean) => {
    let sponsorPromotionUrl = "";

    /* SponsorOfferDrawer */
    if (isSponsorOfferDrawer) {
      setSponsorOfferDrawer(true);
      setPodcastDrawer(false);
      const filteredSponsor = podcastData?.sponsors.filter(
        (data) => data.name === sponsor
      )[0];

      const filteredPodcast = podcastData.offer.filter(
        (offer) => offer.sponsor === sponsor
      )[0];

      const sponsorImage = filteredSponsor.imageUrl;
      const sponsorOffer = filteredSponsor.offer;
      const sponsorBaseUrl = filteredSponsor.url;
      const sponsorName = filteredPodcast.sponsor;
      const sponsorPromoCode = filteredPodcast.promoCode;
      sponsorPromotionUrl = filteredPodcast.url;

      setDrawerData({
        image: sponsorImage,
        title: sponsorName,
        subtitle: sponsorBaseUrl,
        description: sponsorOffer,
        url: sponsorPromotionUrl,
        promoCode: sponsorPromoCode,
        category: "",
      });
    } else {
      /* Podcast Drawer */
      setSponsorOfferDrawer(false);
      setPodcastDrawer(true);
      const podcastImage = podcastData.imageUrl;
      const podcastTitle = podcastData.title;
      const podcastDescription = podcastData.description;
      const publisher = podcastData.publisher;

      setDrawerData({
        image: podcastImage,
        title: podcastTitle,
        subtitle: publisher,
        description: podcastDescription,
        url: sponsorPromotionUrl,
        category,
        promoCode: "",
      });
    }

    onOpenDrawer();
  };

  return (
    <div className={`${isBreakPoint ? "flex flex-col" : "flex "}`}>
      <Sidebar />
      <div className="flex-col w-full overflow-hidden lg:ml-[240px] ">
        <BackButton />
        <header className="flex flex-col items-center relative h-[50vh] w-full">
          <div className={`fixed w-full z-50 lg:ml-[240px]`}>
            <DescriptionDrawer
              isOpen={isOpenDrawer}
              onClose={onCloseDrawer}
              drawer={drawerData}
              sponsorOfferDrawer={sponsorOfferDrawer}
              podcastDrawer={podcastDrawer}
              podcastPage={true}
              externalUrl={podcastData?.externalUrl}
            />
            <PodcastBanner
              podcastData={podcastData}
              bannerBreakpointRef={bannerBreakpointRef}
              imageSrc={imageSrc}
              columnBreakpointRef={columnBreakpointRef}
            />
          </div>
          <PodcastHero
            bannerBreakpointRef={bannerBreakpointRef}
            category={category}
            handleDrawer={handleDrawer}
            imageSrc={imageSrc}
            podcastData={podcastData}
          />
        </header>
        <SponsorList
          handleDrawer={handleDrawer}
          podcastData={podcastData}
          columnBreakpointRef={columnBreakpointRef}
        />
      </div>
    </div>
  );
};

export default Podcast;

export const getStaticPaths = async () => {
  let { data: podcastsData } = await client.query({
    query: Operations.Queries.GetPodcasts,
    variables: {
      input: {
        path: true,
      },
    },
  });

  podcastsData = podcastsData.getPodcasts;
  const paths = podcastsData.map((podcast: PodcastData) => ({
    params: {
      category: convertToSlug(podcast.category[0].name),
      podcast: convertToSlug(podcast.title),
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }: any) => {
  const { podcast, category } = params;
  const slugToPodcast = podcast.split("-").join(" ").toLowerCase();
  try {
    let { data: podcastData, loading } = await client.query({
      query: Operations.Queries.GetPodcast,
      variables: {
        input: {
          podcast: slugToPodcast,
        },
      },
    });

    podcastData = podcastData.getPodcast;
    const oneWeek = 604800;
    return {
      props: {
        podcastData,
        category,
      },
      revalidate: oneWeek,
    };
  } catch (error) {
    console.log(error);
  }
};
