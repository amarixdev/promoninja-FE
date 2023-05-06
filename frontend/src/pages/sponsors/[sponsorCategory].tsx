import { useLazyQuery } from "@apollo/client";
import {
  Box,
  Button,
  Collapse,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import CategoryTabs from "../../components/CategoryTabs";
import DescriptionDrawer from "../../components/DescriptionDrawer";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import { NavContext } from "../../context/navContext";
import client from "../../graphql/apollo-client";
import { Operations } from "../../graphql/operations";
import { truncateString } from "../../utils/functions";
import {
  useLoadingScreen,
  useMediaQuery,
  useSetCurrentPage,
} from "../../utils/hooks";
import { PodcastData, SponsorCategory, SponsorData } from "../../utils/types";

interface Props {
  categoryData: SponsorCategory;
  loading: boolean;
  sponsorsData: SponsorData[];
  sponsorCategoryData: SponsorCategory[];
  categoryLoading: boolean;
}

interface PodcastQuery {
  getSponsorPodcasts: PodcastData[];
}

interface SponsorState {
  selectedSponsor: string;
  previousSponsor: string;
}

const SponsorCategory = ({
  categoryData,
  sponsorsData,
  sponsorCategoryData,
  loading,
  categoryLoading,
}: Props) => {
  useSetCurrentPage({ home: false, podcasts: false, search: false });
  const isBreakPoint = useMediaQuery(1023);
  let [getPodcasts, { data: podcastData, loading: getPodcastsLoading }] =
    useLazyQuery<PodcastQuery>(Operations.Queries.GetSponsorPodcasts);
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();

  const [sponsorState, setSponsorState] = useState<SponsorState>({
    selectedSponsor: "",
    previousSponsor: "",
  });
  const [selectedPodcast, setSelectedPodcast] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [sponsorDrawer, setSponsorDrawer] = useState(false);
  const [podcastOfferDrawer, setPodcastOfferDrawer] = useState(true);
  const [current, setCurrent] = useState("");

  const [drawerData, setDrawerData] = useState({
    image: "",
    title: "",
    description: "",
    url: "",
    subtitle: "",
    color: "",
    promoCode: "",
  });
  const { pageNavigate, setPageNavigate } = NavContext();
  useEffect(() => {
    setPageNavigate(false);
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
      setSponsorDrawer(true);
      setPodcastOfferDrawer(false);
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
      const podcastOffer = input.offer.filter(
        (offer) => offer.sponsor === sponsorName
      );

      const promotion = sponsorsData?.filter(
        (sponsor) => sponsor.name === sponsorName
      )[0].offer;

      /* Podcast */
      setSelectedPodcast(input.title);
      setSponsorDrawer(false);
      setPodcastOfferDrawer(true);
      setDrawerData((prev) => ({
        ...prev,
        image: input.imageUrl,
        title: input.title,
        description: promotion,
        color: input.backgroundColor,
        subtitle: input.publisher,
        url: podcastOffer[0].url,
        promoCode: podcastOffer[0].promoCode,
      }));
      onOpenDrawer();
    }
  };

  const isLoading = useLoadingScreen();
  /* TODO: Implement View More */

  const handleCollapse = async (sponsor: string) => {
    setCurrent(sponsor);
    await getPodcasts({
      variables: {
        input: {
          name: sponsor,
          isCategoryPage: true,
        },
      },
    });

    if (sponsorState.selectedSponsor === sponsor) {
      setIsOpen((prev) => !prev);
      setSponsorState((prev) => ({ ...prev, selectedSponsor: sponsor }));
    }

    if (sponsorState.selectedSponsor !== sponsor) {
      setIsOpen(true);
      setSponsorState((prev) => ({
        ...prev,
        selectedSponsor: sponsor,
        previousSponsor: sponsorState.selectedSponsor,
      }));
    }
  };
  const sponsorPodcasts = podcastData?.getSponsorPodcasts;

  if (loading || categoryLoading) return <Spinner />;
  return (
    <div className="flex">
      <Sidebar />
      <DescriptionDrawer
        isOpen={isOpenDrawer}
        onClose={onCloseDrawer}
        drawer={drawerData}
        sponsorDrawer={sponsorDrawer}
        podcastOfferDrawer={podcastOfferDrawer}
        currentPodcast={selectedPodcast}
      />

      <div className="w-full bg-gradient-to-t from-[#151515] via-[#151515] to-[#282727] overflow-x-scroll base:mb-[60px] xs:mb-[70px]">
        {
          <>
            <CategoryTabs
              sponsorCategoryData={sponsorCategoryData}
              categoryData={categoryData}
            />
            {isLoading && !pageNavigate ? (
              <div className="w-full h-screen bg-gradient-to-t from-[#151515] via-[#151515] to-[#282727] flex justify-center items-center">
                <Spinner />
              </div>
            ) : (
              <div>
                {
                  <div className="p-6">
                    <div className="w-full mt-14">
                      <h1 className="base:text-3xl xs:text-4xl sm:text-5xl font-extrabold text-center p-6 break-normal ">
                        {categoryData?.name}
                      </h1>
                    </div>

                    {isBreakPoint ? (
                      /* Mobile */
                      <div>
                        {sponsorsData?.map(
                          (sponsor: SponsorData, index: number) => (
                            <div
                              key={`${sponsor.name}`}
                              className="w-full  py-4 border-b-[1px] mb-6"
                            >
                              <div className=" w-full my-3 base:max-h-[80px] max-h-[120px] flex rounded-l-[9999px] rounded-r-[4000px] transition ease-in-out duration-150">
                                <div className="flex items-center w-full">
                                  <p className="text-[#aaaaaa] base:text-xs xs:text-sm font-semibold p-4">
                                    {index + 1}
                                  </p>
                                  <div className="flex items-center w-full justify-between">
                                    <div className="flex justify-start items-center">
                                      <Link
                                        href={`/${sponsor?.name}`}
                                        className="hover:cursor-pointer flex items-center"
                                      >
                                        <Image
                                          src={sponsor?.imageUrl}
                                          alt={sponsor.name}
                                          width={80}
                                          height={80}
                                          loading="lazy"
                                          className="base:min-w-[80px] base:min-h-[80px] shadow-black shadow-2xl border-2"
                                        />
                                      </Link>
                                      <h1 className="base:text-lg font-extralight px-6">
                                        {sponsor.name}
                                      </h1>
                                    </div>
                                    <div className="p-2">
                                      <FaEllipsisV
                                        className=""
                                        onClick={() =>
                                          handleDrawer(sponsor, sponsor.name)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleCollapse(sponsor.name)}
                                className="active:scale-95"
                              >
                                <p className="mr-2">Shop with Creators</p>{" "}
                                {isOpen &&
                                sponsorState.selectedSponsor ===
                                  sponsor.name ? (
                                  <GoChevronUp />
                                ) : getPodcastsLoading &&
                                  current === sponsor.name ? (
                                  <Spinner />
                                ) : (
                                  <GoChevronDown />
                                )}
                              </Button>
                              <Collapse
                                in={
                                  isOpen &&
                                  sponsorState.previousSponsor !==
                                    sponsor.name &&
                                  sponsorState.selectedSponsor === sponsor.name
                                }
                                animateOpacity
                              >
                                {/* improve transition w/ previous state */}
                                {sponsorState.previousSponsor ===
                                sponsor.name ? (
                                  <div></div>
                                ) : (
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
                                            {pod ? (
                                              <div>
                                                <Image
                                                  src={pod?.imageUrl}
                                                  width={100}
                                                  height={100}
                                                  alt={pod.title}
                                                  className=" mb-2"
                                                />

                                                <h1 className="text-sm font-semibold">
                                                  {truncateString(pod.title, 8)}
                                                </h1>
                                                <h3 className="text-xs text-[#6f6f6f] pb-2">
                                                  {truncateString(
                                                    pod.publisher,
                                                    10
                                                  )}
                                                </h3>
                                              </div>
                                            ) : (
                                              <div></div>
                                            )}

                                            <Button
                                              width={"20"}
                                              h={"5"}
                                              fontSize={"x-small"}
                                              onClick={() =>
                                                handleDrawer(pod, sponsor.name)
                                              }
                                            >
                                              Support
                                            </Button>
                                          </div>
                                        ))}
                                        <Link
                                          className="min-w-[120px] h-[100px] flex items-center justify-center hover:cursor-pointer active:scale-95 hover:bg-[#272727]"
                                          href={`/${sponsor.name}`}
                                        >
                                          <p className="font-semibold">
                                            View All
                                          </p>
                                        </Link>
                                      </div>
                                    </div>
                                  </Box>
                                )}
                              </Collapse>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      /* Desktop */
                      <div>
                        {sponsorsData?.map(
                          (sponsor: SponsorData, index: number) => (
                            <div
                              key={`${sponsor.name}`}
                              className="w-full  py-4 border-b-[1px] mb-6"
                            >
                              <div className=" w-full my-3 max-h-[120px] items-center flex rounded-l-[9999px] rounded-r-[4000px] transition ease-in-out duration-150">
                                <div className="flex items-center w-full">
                                  <p className="text-[#aaaaaa] base:text-xs xs:text-sm font-semibold p-4">
                                    {index + 1}
                                  </p>
                                  <div className="flex items-center w-full justify-between">
                                    <div className="flex justify-start items-center">
                                      <Link
                                        href={`/${sponsor?.name}`}
                                        className="hover:cursor-pointer flex items-center"
                                      >
                                        <div className="hover:bg-[#ffffff0e] active:scale-95 hover: h-[100px] w-[100px] rounded-lg absolute transition ease-in-out duration-300 "></div>

                                        <Image
                                          src={sponsor?.imageUrl}
                                          alt={sponsor.name}
                                          width={100}
                                          height={100}
                                          loading="lazy"
                                          className="base:min-w-[80px] base:min-h-[80px] shadow-black shadow-2xl border-2"
                                        />
                                      </Link>
                                      <div className="flex flex-col px-6">
                                        <h1 className="text-3xl font-extralight">
                                          {sponsor.name}
                                        </h1>
                                      </div>
                                      <Tooltip
                                        label="About"
                                        placement="right-start"
                                      >
                                        <div
                                          className="active:scale-95 p-2 hover:bg-[#ffffff0f] hover:cursor-pointer  rounded-full "
                                          onClick={() =>
                                            handleDrawer(sponsor, sponsor.name)
                                          }
                                        >
                                          <FaEllipsisV />
                                        </div>
                                      </Tooltip>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleCollapse(sponsor.name)}
                                className="active:scale-95 flex items-center"
                              >
                                <div className="flex items-center p-5">
                                  <p className="mr-4">Shop with Creators</p>{" "}
                                  {isOpen &&
                                  sponsorState.selectedSponsor ===
                                    sponsor.name ? (
                                    <GoChevronUp />
                                  ) : getPodcastsLoading &&
                                    current == sponsor.name ? (
                                    <Spinner />
                                  ) : (
                                    <GoChevronDown />
                                  )}
                                </div>
                              </Button>

                              <Collapse
                                in={
                                  isOpen &&
                                  sponsorState.selectedSponsor === sponsor.name
                                }
                                animateOpacity
                              >
                                {sponsorState.previousSponsor ===
                                sponsor.name ? (
                                  <Box
                                    p="10px"
                                    mt="4"
                                    bg="transparent"
                                    rounded="md"
                                    shadow="md"
                                  >
                                    <div className="flex flex-col w-full">
                                      <div className="w-full flex items-center gap-2 py-6 mb-4 px-4">
                                        <div className="rounded-full bg-[#0ec10e] w-2 h-2"></div>
                                        <p className="font-bold text-xl whitespace-nowrap">
                                          Exclusive Offer:
                                        </p>
                                        <p className="text-xl font-light">
                                          {sponsor.offer}{" "}
                                        </p>
                                      </div>
                                      <div className="flex overflow-x-scroll pb-4 w-full ">
                                        {sponsorPodcasts?.map((pod) => (
                                          <div
                                            key={pod.title}
                                            className="px-4 flex flex-col justify-between bg-[#15151500] h-[50px]"
                                          >
                                            <div></div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </Box>
                                ) : (
                                  <Box
                                    p="10px"
                                    mt="4"
                                    bg="transparent"
                                    rounded="md"
                                    shadow="md"
                                  >
                                    <div className="flex flex-col w-full ">
                                      <div className="w-full flex items-center gap-2 py-6 mb-4 px-4">
                                        <div className="rounded-full bg-[#0ec10e] w-2 h-2"></div>
                                        <p className="font-bold text-xl whitespace-nowrap">
                                          Exclusive Offer:
                                        </p>
                                        <p className="text-xl font-light">
                                          {sponsor.offer}{" "}
                                        </p>
                                      </div>
                                      <div className="flex overflow-x-scroll pb-4 w-full ">
                                        {sponsorPodcasts?.map((pod) => (
                                          <div
                                            key={pod.title}
                                            className="px-4 flex flex-col justify-between "
                                          >
                                            <div>
                                              <Image
                                                src={pod?.imageUrl}
                                                width={110}
                                                height={110}
                                                alt={pod.title}
                                                className="min-w-[110px] min-h-[110px]rounded-xl mb-2 "
                                              />

                                              <h1 className="text-sm font-semibold">
                                                {truncateString(pod.title, 13)}
                                              </h1>
                                              <h3 className="text-xs text-[#6f6f6f] pb-2">
                                                {truncateString(
                                                  pod.publisher,
                                                  16
                                                )}
                                              </h3>
                                            </div>

                                            <Button
                                              width={"25"}
                                              h={"5"}
                                              fontSize={"x-small"}
                                              onClick={() =>
                                                handleDrawer(pod, sponsor.name)
                                              }
                                            >
                                              Support
                                            </Button>
                                          </div>
                                        ))}
                                        <Link
                                          className="w-[110px] h-[110px] flex items-center justify-center hover:cursor-pointer active:scale-95 hover:bg-[#272727]"
                                          href={`/${sponsor.name}`}
                                        >
                                          <p className="font-semibold">
                                            View All
                                          </p>
                                        </Link>
                                      </div>
                                    </div>
                                  </Box>
                                )}
                              </Collapse>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                }
              </div>
            )}
          </>
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

  let { data: sponsorCategoryData, loading: categoryLoading } =
    await client.query({
      query: Operations.Queries.GetSponsorCategories,
    });

  sponsorCategoryData = sponsorCategoryData?.getSponsorCategories;
  categoryData = categoryData?.getSponsorCategory;
  sponsorsData = sponsorsData?.getCategorySponsors;

  return {
    props: {
      categoryData,
      sponsorsData,
      sponsorCategoryData,
      loading,
      categoryLoading,
    },
  };
};
