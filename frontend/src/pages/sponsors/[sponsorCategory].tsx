import React, { useState } from "react";
import Footer from "../../components/Footer";
import client from "../../graphql/apollo-client";
import { Operations } from "../../graphql/operations";
import { PodcastData, SponsorCategory, SponsorData } from "../../utils/types";
import Image from "next/image";
import {
  Box,
  Button,
  Collapse,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import { useMediaQuery } from "../../utils/hooks";
import Link from "next/link";
import { truncateString } from "../../utils/functions";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { FaEllipsisV } from "react-icons/fa";
import DescriptionDrawer from "../../components/DescriptionDrawer";
import { useLazyQuery } from "@apollo/client";

type Props = {
  categoryData: SponsorCategory;
  loading: boolean;
  sponsorsData: SponsorData[];
};

interface Podcast {
  getSponsorPodcasts: PodcastData[];
}

const SponsorCategory = ({ categoryData, sponsorsData, loading }: Props) => {
  const isBreakPoint = useMediaQuery(1023);
  const [getPodcasts, { data: podcastData }] = useLazyQuery<Podcast>(
    Operations.Queries.GetSponsorPodcasts
  );
  const { isOpen, onToggle } = useDisclosure();
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();
  const [hideLink, setHideLink] = useState(true);
  const [hideOffer, setHideOffer] = useState(true);
  const [selectedSponsor, setSelectedSponsor] = useState("");
  const [selectedPodcast, setSelectedPodcast] = useState("");

  const [drawerData, setDrawerData] = useState({
    image: "",
    title: "",
    description: "",
    url: "",
    subtitle: "",
    color: "",
  });

  const isSponsorData = (
    input: SponsorData | PodcastData
  ): input is SponsorData => {
    return "summary" in input;
  };

  const handleDrawer = (
    input: SponsorData | PodcastData,
    sponsorName: string
  ) => {

    /* Sponsor */
    if (isSponsorData(input)) {
      setHideLink(true);
      setDrawerData((prev) => ({
        ...prev,
        image: input.imageUrl,
        title: input.name,
        description: input.summary,
        url: input.url,
      }));
      onOpenDrawer();
    } else {
      setHideLink(false);
      const podcastOffer = input.offer.filter(
        (offer) => offer.sponsor === sponsorName
      );

      const promotion = sponsorsData?.filter(
        (sponsor) => sponsor.name === sponsorName
      )[0].offer;

      /* Podcast */
      setSelectedPodcast(input.title);
      setDrawerData((prev) => ({
        ...prev,
        image: input.imageUrl,
        title: input.title,
        description: promotion,
        url: podcastOffer[0].url,
        color: input.backgroundColor,
        subtitle: input.publisher,
      }));
      onOpenDrawer();
    }
  };

  const handleCollapse = async (sponsor: string) => {
    await getPodcasts({
      variables: {
        input: {
          name: sponsor,
        },
      },
    });

    onToggle();
    setSelectedSponsor(sponsor);
  };

  const sponsorPodcasts = podcastData?.getSponsorPodcasts;

  if (loading) return <Spinner />;
  return (
    <div className="flex">
      <Sidebar />
      <DescriptionDrawer
        isOpen={isOpenDrawer}
        onClose={onCloseDrawer}
        drawer={drawerData}
        sponsorDrawer={true}
        hideLink={hideLink}
        podcastButton={true}
        currentPodcast={selectedPodcast}
      />
      <div className="h-screen w-full">
        <Image
          src={categoryData?.imageUrl}
          alt={categoryData?.name}
          width={2000}
          height={2000}
          className="fixed z-15 w-full lg:top-[-100px] xl:top-[-150px] shadow-2xl shadow-black"
          priority
        />
        <div className="w-full h-screen bg-gradient-to-tr bg-black/10 from-black/40 fixed"></div>
        {/* {<PreviousPage previousPageText="podcasts" />} */}

        <h1 className="font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-8xl text-white px-4 absolute z-2 top-[8rem] sm:top-[12rem]">
          {categoryData?.name}
        </h1>

        {
          <div
            className={`bg-[#151515] h-[260vh]  ${
              isBreakPoint && "h-full"
            } relative top-[30%] sm:top-[35%] md:top-[40%] lg:top-[45%] xl:top-[50%] items-center flex flex-col p-5`}
          >
            {sponsorsData?.map((sponsor: SponsorData) => (
              <div key={`${sponsor.name}`} className="w-full my-4">
                <div
                  className="min-w-[75%] my-3 base:max-h-[80px] max-h-[120px] flex rounded-l-[9999px] rounded-r-[4000px] transition ease-in-out duration-150 hover:bg-[#222222]"
                  onClick={() => setHideOffer((prev) => !prev)}
                >
                  <Image
                    src={sponsor?.imageUrl}
                    alt=""
                    width={120}
                    height={120}
                    loading="lazy"
                    className="base:w-[80px] base:h-[80px] rounded-full"
                  />
                  <div className="w-full flex items-center justify-between ml-4">
                    <h1 className="base:text-lg font-semibold">
                      {sponsor.name}
                    </h1>
                    <div className="p-2">
                      <FaEllipsisV
                        onClick={() => handleDrawer(sponsor, sponsor.name)}
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={() => handleCollapse(sponsor.name)}>
                  <p className="mr-2">Shop with Creators</p>{" "}
                  {isOpen && selectedSponsor === sponsor.name ? (
                    <GoChevronUp />
                  ) : (
                    <GoChevronDown />
                  )}
                </Button>
                <Collapse
                  in={selectedSponsor === sponsor.name && isOpen}
                  animateOpacity
                >
                  <Box
                    p="10px"
                    mt="4"
                    bg="transparent"
                    rounded="md"
                    shadow="md"
                  >
                    <div className="flex flex-col w-full">
                      <div className="w-full font-light p-2 mb-4">
                        {sponsor.offer}
                      </div>
                      <div className="w-full flex">
                        {sponsorPodcasts?.map((pod) => (
                          <div key={pod.title} className="px-4">
                            <Image
                              src={pod?.imageUrl}
                              width={100}
                              height={100}
                              alt={pod.title}
                              className="rounded-3xl"
                            />
                            <h1 className="text-sm font-semibold">
                              {truncateString(pod.title, 15)}
                            </h1>
                            <h3 className="text-xs text-[#6f6f6f]">
                              {truncateString(pod.publisher, 20)}
                            </h3>
                            <Button
                              width={"20"}
                              h={"5"}
                              fontSize={"x-small"}
                              onClick={() => handleDrawer(pod, sponsor.name)}
                            >
                              Support
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Box>
                </Collapse>
              </div>
            ))}
          </div>
        }
        <Footer />
      </div>
    </div>
  );
};

export default SponsorCategory;

export const getStaticPaths = async () => {
  const paths = [{ params: { sponsorCategory: "" } }];
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }: any) => {
  const { sponsorCategory: category } = params;

  let { data: categoryData, loading } = await client.query({
    query: Operations.Queries.GetSponsorCategory,
    variables: {
      input: category,
    },
  });

  let { data: sponsorsData } = await client.query({
    query: Operations.Queries.GetCategorySponsors,
    variables: {
      input: category,
    },
  });

  categoryData = categoryData?.getSponsorCategory;
  sponsorsData = sponsorsData?.getCategorySponsors;
  return {
    props: {
      categoryData,
      sponsorsData,
      loading,
    },
  };
};
