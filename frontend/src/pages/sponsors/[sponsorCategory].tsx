import React, { useState } from "react";
import Footer from "../../components/Footer";
import client from "../../graphql/apollo-client";
import { Operations } from "../../graphql/operations";
import { PodcastData, SponsorCategory, SponsorData } from "../../utils/types";
import Image from "next/image";
import Ninja4 from "../../public/assets/ninja4.png";
import {
  Box,
  Button,
  Collapse,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import useSetHomePage, { useMediaQuery } from "../../utils/hooks";
import Link from "next/link";
import { truncateString } from "../../utils/functions";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { FaEllipsisV } from "react-icons/fa";
import DescriptionDrawer from "../../components/DescriptionDrawer";
import { useLazyQuery } from "@apollo/client";
import { ClassNames } from "@emotion/react";

interface Props {
  categoryData: SponsorCategory;
  loading: boolean;
  sponsorsData: SponsorData[];
}

interface Podcast {
  getSponsorPodcasts: PodcastData[];
}

const SponsorCategory = ({ categoryData, sponsorsData, loading }: Props) => {
  useSetHomePage(false);
  const isBreakPoint = useMediaQuery(1023);
  const [getPodcasts, { data: podcastData }] = useLazyQuery<Podcast>(
    Operations.Queries.GetSponsorPodcasts
  );
  const { onToggle } = useDisclosure();
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();
  const [hideLink, setHideLink] = useState(true);
  const [hideOffer, setHideOffer] = useState(true);
  const [selectedSponsor, setSelectedSponsor] = useState("");
  const [selectedPodcast, setSelectedPodcast] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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
        subtitle: input.url,
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
    setSelectedSponsor(sponsor);

    if (selectedSponsor !== sponsor) {
      setIsOpen(true);
    }

    if (selectedSponsor === sponsor) {
      setIsOpen((prev) => !prev);
    }
    onToggle();
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
      <div className="w-full bg-gradient-to-t from-[#151515] via-[#151515] to-[#282727]">
        {
          <div className="p-6">
            <div className="w-full ">
              <h1 className="text-5xl font-extrabold text-center p-6">
                {categoryData?.name}
              </h1>
            </div>
            {sponsorsData?.map((sponsor: SponsorData) => (
              <div key={`${sponsor.name}`} className="w-full  py-4">
                <div
                  className="min-w-[75%] my-3 base:max-h-[80px] max-h-[120px] flex rounded-l-[9999px] rounded-r-[4000px] transition ease-in-out duration-150"
                  onClick={() => setHideOffer((prev) => !prev)}
                >
                  <Link
                    href={`/${sponsor?.name}`}
                    className="w-4/12 hover:cursor-pointer"
                  >
                    <Image
                      src={sponsor?.imageUrl}
                      alt={sponsor.name}
                      width={120}
                      height={120}
                      loading="lazy"
                      className="base:w-[80px] base:h-[80px] shadow-black shadow-2xl"
                    />
                  </Link>

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
                      <div className="w-full flex overflow-x-auto pb-4">
                        {sponsorPodcasts?.map((pod) => (
                          <div
                            key={pod.title}
                            className="px-4 flex flex-col justify-between"
                          >
                            <div>
                              <Image
                                src={pod?.imageUrl}
                                width={100}
                                height={100}
                                alt={pod.title}
                                className="rounded-3xl mb-2"
                              />

                              <h1 className="text-sm font-semibold">
                                {truncateString(pod.title, 15)}
                              </h1>
                              <h3 className="text-xs text-[#6f6f6f] pb-2">
                                {truncateString(pod.publisher, 20)}
                              </h3>
                            </div>

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
      input: { category },
    },
  });

  let { data: sponsorsData } = await client.query({
    query: Operations.Queries.GetCategorySponsors,
    variables: {
      input: { category },
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
