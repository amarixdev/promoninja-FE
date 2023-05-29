import { useLazyQuery } from "@apollo/client";
import {
  Box,
  Button,
  Collapse,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import DescriptionDrawer from "../components/DescriptionDrawer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { NavContext } from "../context/navContext";
import client from "../graphql/apollo-client";
import { Operations } from "../graphql/operations";
import { convertToSlug, currentYear, truncateString } from "../utils/functions";
import useSlider, {
  useBanner,
  useMediaQuery,
  useSetCurrentPage,
} from "../utils/hooks";
import { PodcastData, SponsorCategory, SponsorData } from "../utils/types";

interface OffersProps {
  sponsorsData: SponsorData[];
  sponsorCategoryData: SponsorCategory[];
  sponsorsCount: number;
}
interface SponsorState {
  selectedSponsor: string;
  previousSponsor: string;
}

const Offers = ({
  sponsorsData,
  sponsorCategoryData,
  sponsorsCount,
}: OffersProps) => {
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();
  const { categoryIndex: contextIndex, ninjaMode } = NavContext();
  const bannerBreakpointRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  /* Custom Hooks */
  useSetCurrentPage({
    home: false,
    podcasts: false,
    search: false,
    offers: true,
  });

  const isBreakPoint = useMediaQuery(1023);
  const { banner: displayCategory } = useBanner(bannerBreakpointRef, 160);
  const { banner: hideTitle } = useBanner(bannerBreakpointRef, 165);
  const { slideTopPicks, showLeftArrow, showRightArrow } = useSlider(
    sliderRef.current,
    600,
    false
  );

  

  /* State */
  const [hideCategory, setHideCategory] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState(false);
  const [sponsorState, setSponsorState] = useState<SponsorState>({
    selectedSponsor: "",
    previousSponsor: "",
  });
  const [selectedPodcast, setSelectedPodcast] = useState("");
  const [sponsorDrawer, setSponsorDrawer] = useState(false);
  const [podcastOfferDrawer, setPodcastOfferDrawer] = useState(true);
  const [current, setCurrent] = useState("");
  const [pageTitle, setPageTitle] = useState("Offers");
  const [filteredSponsors, setFilteredSponsors] = useState<SponsorData[]>([]);
  const [sponsorPodcastArray, setSponsorPodcastArray] =
    useState<PodcastData[]>();
  const [currentCategory, setCurrentCategory] = useState("");
  const [categoryCount, setCategoryCount] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const categoryTabRef = useRef<HTMLButtonElement>(null);
  const [drawerData, setDrawerData] = useState({
    image: "",
    title: "",
    description: "",
    url: "",
    subtitle: "",
    color: "",
    promoCode: "",
    category: "",
  });

  /* Lazy Queries */
  const [getSponsorsCount] = useLazyQuery(Operations.Queries.GetSponsorsCount);
  const [getSponsorPodcasts, { loading: podcastsLoading, data: podcastData }] =
    useLazyQuery(Operations.Queries.GetSponsorPodcasts);

  const [getCategorySponsors] = useLazyQuery(
    Operations.Queries.GetCategorySponsors
  );
  const [loadMoreSponsors, { loading: sponsorsLoading }] = useLazyQuery(
    Operations.Queries.GetSponsors
  );

  useEffect(() => {
    if (displayCategory) {
      setHideCategory(false);
    }
  }, [displayCategory]);

  useEffect(() => {
    if (contextIndex === -1) {
      setCurrentCategory("All Offers");
      setCategoryIndex(0);
      setFilteredSponsors(sponsorsData);
    } else {
      const filteredIndexes = sponsorCategoryData.filter((_, index) => {
        return index === contextIndex;
      });
      const fetchData = async () => {
        const { data: categoryData } = await getCategorySponsors({
          variables: {
            input: {
              category: filteredIndexes[0].name,
              pageSize: 15,
              offset: 0,
            },
          },
        });
        const { data: countData } = await getSponsorsCount({
          variables: {
            input: {
              isCategory: true,
              category: filteredIndexes[0].name,
            },
          },
        });

        if (categoryData) {
          setCurrentCategory(filteredIndexes[0].name);
          setCategoryIndex(contextIndex + 1);
          setFilteredSponsors(categoryData.getCategorySponsors);
          setCategoryCount(countData.getSponsorsCount);
        }
      };

      fetchData();
    }
  }, [sponsorCategoryData, contextIndex]);

  const handleDrawer = (podcastData: PodcastData, sponsorName: string) => {
    const promotion = filteredSponsors?.filter(
      (sponsor) => sponsor.name === sponsorName
    )[0].offer;

    const selectedPodcast = sponsorPodcastArray?.filter(
      (pod) => pod.title === podcastData.title
    );

    const offer = selectedPodcast
      ?.map((pod) => pod.offer)[0]
      .filter((offer) => offer.sponsor === sponsorName);

    if (offer) {
      setSelectedPodcast(podcastData.title);
      setSponsorDrawer(false);
      setPodcastOfferDrawer(true);
      setDrawerData((prev) => ({
        ...prev,
        image: podcastData.imageUrl,
        title: podcastData.title,
        description: promotion,
        color: podcastData.backgroundColor,
        subtitle: podcastData.publisher,
        url: offer[0].url,
        promoCode: offer[0].promoCode,
        category: podcastData.category[0].name,
      }));
    }

    /* Podcast */

    onOpenDrawer();
  };

  const [loadedStatus, setLoadedStatus] = useState<{ [key: string]: boolean }>(
    {}
  );
  const handleCollapse = async (sponsor: string, action: string) => {
    setCurrent(sponsor);
    if (!loadedStatus[sponsor]) {
      console.log(`fetching data for ${sponsor}`);
      const { data } = await getSponsorPodcasts({
        variables: {
          input: {
            name: sponsor,
            isCategoryPage: true,
          },
        },
      });
      if (data) {
        setLoadedStatus({
          [sponsor]: true,
        });
      }
      setSponsorPodcastArray([...data?.getSponsorPodcasts]);
    }
    if (action === "collapse") {
      setPlaceholder(true);
    }

    if (action === "open") {
      setPlaceholder(false);
    }

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

  const filterCategory = async (category: string, index: number) => {
    let { data: categoryData } = await getCategorySponsors({
      variables: {
        input: {
          category,
          pageSize: 15,
          offset: 0,
        },
      },
    });

    let { data: countData } = await getSponsorsCount({
      variables: {
        input: {
          category,
          isCategory: true,
        },
      },
    });

    categoryData = categoryData?.getCategorySponsors;
    countData = countData?.getSponsorsCount;

    if (categoryData && countData) {
      const renderDelay = 150;
      setTimeout(() => {
        setFilteredSponsors(categoryData);
        setCurrentCategory(category);
        setPageTitle("Offers");
        setHideCategory(true);
        setCategoryIndex(index + 1);
        setCategoryCount(countData);
        window.scrollTo({ top: 0 });
      }, renderDelay);
    }
  };

  const handlePagination = async () => {
    const offset = filteredSponsors.length;

    if (currentCategory === "All Offers") {
      const { data } = await loadMoreSponsors({
        variables: {
          input: {
            offerPage: true,
            offset,
            pageSize: 15,
          },
        },
      });
      if (data) {
        setFilteredSponsors([...filteredSponsors, ...data.getSponsors]);
      }
    } else {
      const { data } = await getCategorySponsors({
        variables: {
          input: {
            category: currentCategory,
            offset,
            pageSize: 15,
          },
        },
      });

      if (data) {
        setFilteredSponsors([...filteredSponsors, ...data.getCategorySponsors]);
      }
    }
  };

  return (
    <div className="flex base:mb-[60px] xs:mb-[70px] lg:mb-0">
      <Sidebar />
      <DescriptionDrawer
        isOpen={isOpenDrawer}
        onClose={onCloseDrawer}
        drawer={drawerData}
        sponsorDrawer={sponsorDrawer}
        podcastOfferDrawer={podcastOfferDrawer}
        currentPodcast={selectedPodcast}
      />

      <div
        className={`w-full relative z-0 mt-12 bg-gradient-to-b  ${
          ninjaMode
            ? "from-[#0e0e0e] via-[#0e0e0e] to-[black]"
            : "from-[#151515] via-[#151515] to-[#121212]"
        }`}
      >
        <div
          className={`absolute top-10 w-full z-0  ${
            ninjaMode
              ? "from-[#222222] bg-gradient-to-b h-[400px]"
              : "from-[#313131] bg-gradient-to-b h-[400px]"
          }`}
        ></div>

        <Header
          page={pageTitle}
          category={currentCategory}
          displayCategory={displayCategory}
          hideTitle={hideTitle}
          hideCategory={hideCategory}
        />
        <div
          className="fixed  mt-4 lg:mt-0  scrollbar-hide lg:top-24 top-20 bg-[#151515] z-[100] overflow-x-scroll scroll-smooth w-full lg:w-[85%] flex pt-5 lg:pt-0 items-center"
          ref={sliderRef}
        >
          {isBreakPoint || (
            <button
              className={`fixed bg-[#151515] z-[200] p-4 hover:cursor-pointer`}
            >
              {
                <BiChevronLeft
                  size={35}
                  className={`active:scale-95 ${
                    showLeftArrow ? "opacity-100" : "opacity-0"
                  } duration-200 transition-all`}
                  onClick={() => slideTopPicks("left")}
                />
              }
            </button>
          )}

          <div className=" flex gap-5 px-6 lg:px-24 lg:pr-44  xl:pr-32 pb-4 lg:py-4">
            <Button
              minWidth={150}
              onClick={() => {
                setCategoryIndex(0);
                setCurrentCategory("All Offers");
                setPageTitle("Offers");
                setHideCategory(true);
                setFilteredSponsors(sponsorsData);
                window.scrollTo({ top: 0 });
              }}
              bgColor={categoryIndex === 0 ? "whiteAlpha.300" : ""}
              className={`transition-all duration-150 active:scale-95 `}
            >
              <p
                className={`text-sm lg:text-base ${
                  categoryIndex === 0 ? "text-white" : "text-[#cccccc]"
                } transition-all duration-150`}
              >
                All{" "}
              </p>
            </Button>

            {isBreakPoint
              ? /* Mobile */
                sponsorCategoryData.map((category, index) => (
                  <Button
                    maxWidth={30}
                    onClick={() => filterCategory(category.name, index)}
                    key={index}
                    px={"20"}
                    bgColor={
                      categoryIndex === index + 1 ? "whiteAlpha.300" : ""
                    }
                    ref={contextIndex === index ? categoryTabRef : undefined}
                    className={`  active:scale-95`}
                  >
                    <p
                      className={`text-xs xs:text-sm lg:text-base ${
                        categoryIndex === index + 1
                          ? "text-white"
                          : "text-[#cccccc]"
                      } transition-all duration-150`}
                    >
                      {category.name}
                    </p>
                  </Button>
                ))
              : /* Desktop */
                sponsorCategoryData.map((category, index) => (
                  <Button
                    minWidth={150}
                    onClick={() => filterCategory(category.name, index)}
                    key={index}
                    px={"24"}
                    bgColor={
                      categoryIndex === index + 1 ? "whiteAlpha.300" : ""
                    }
                    ref={contextIndex === index ? categoryTabRef : undefined}
                    className={`  transition-all duration-150 active:scale-95`}
                  >
                    <p
                      className={`text-sm lg:text-base ${
                        categoryIndex === index + 1
                          ? "text-white"
                          : "text-[#cccccc]"
                      } transition-all duration-150`}
                    >
                      {category.name}
                    </p>
                  </Button>
                ))}
          </div>
          {isBreakPoint || (
            <button
              className={`fixed bg-[#151515] right-0 z-[200] p-4 hover:cursor-pointer`}
            >
              {
                <BiChevronRight
                  size={35}
                  className={`active:scale-95 mt-1 2xl:w-[100px] 4xl:w-[200px] ${
                    showRightArrow ? "opacity-100" : "opacity-0"
                  } duration-200 transition-all`}
                  onClick={() => slideTopPicks("right")}
                />
              }
            </button>
          )}
        </div>

        {/* Mobile */}
        <>
          {isBreakPoint && (
            <div className="mt-24 ">
              <div className="pt-10 px-5">
                <p
                  ref={bannerBreakpointRef}
                  className="w-full text-xl xs:text-2xl font-extrabold flex justify-center mb-10 relative z-10 "
                >
                  {currentCategory}
                </p>
                {(filteredSponsors.length ? filteredSponsors : null)?.map(
                  (sponsor: SponsorData, index: number) => (
                    <div
                      key={`${sponsor.name}`}
                      className={`w-full rounded-md p-8 bg-gradient-to-r  ${
                        ninjaMode
                          ? "from-[#171717] to-[#121212]"
                          : "from-[#232323] to-[#181818]"
                      } shadow-lg shadow-[black] mb-6`}
                    >
                      <div className="flex w-full">
                        <div className="flex flex-col min-w-full ">
                          <div className="flex-col flex w-full ">
                            <div className="flex flex-col items-center  ">
                              <Image
                                src={sponsor.imageUrl}
                                width={150}
                                height={150}
                                alt={sponsor.name}
                                priority
                                className={` h-[150px] max-w-[150px] relative rounded-lg shadow-xl shadow-black`}
                              />
                              <div className="flex ml-4 flex-col rounded-sm">
                                <div className="p-4">
                                  <div className="flex flex-col items-center gap-2 py-2">
                                    <h1
                                      className={`text-[#ebebeb] text-center text-lg xs:text-xl font-extrabold relative z-10 `}
                                    >
                                      {sponsor.name}
                                    </h1>
                                    <h1
                                      className={`text-[#bababa] text-xs xs:text-sm text-center relative z-10   `}
                                    >
                                      {sponsor.offer}
                                    </h1>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div
                            className={`relative flex  flex-col gap-3 items-center justify-center w-full`}
                          >
                            <Link
                              href={`/${convertToSlug(sponsor.name)}`}
                              className="w-full flex justify-center"
                            >
                              <Button>
                                <p className="text-xs xs:text-sm">
                                  View Details
                                </p>
                              </Button>
                            </Link>
                            <Button
                              onClick={() =>
                                handleCollapse(
                                  sponsor.name,
                                  isOpen ? "collapse" : "open"
                                )
                              }
                              className="active:scale-95 flex items-center"
                            >
                              <div className="flex items-center p-5">
                                <p className="mr-4 text-xs xs:text-sm">
                                  Shop with Creators
                                </p>
                                {isOpen &&
                                sponsorState.selectedSponsor ===
                                  sponsor.name ? (
                                  <GoChevronUp />
                                ) : podcastsLoading &&
                                  current === sponsor.name ? (
                                  <Spinner />
                                ) : (
                                  <GoChevronDown />
                                )}
                              </div>
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Collapse
                        in={
                          isOpen &&
                          sponsorState.selectedSponsor === sponsor.name
                        }
                        animateOpacity
                      >
                        {sponsorState.previousSponsor === sponsor.name ? (
                          <Box
                            p="10px"
                            mt="4"
                            bg="transparent"
                            rounded="md"
                            shadow="md"
                          >
                            <div className="flex flex-col w-full">
                              <div className="flex overflow-x-scroll pb-4 w-full">
                                {podcastData?.getSponsorPodcasts?.map(
                                  (pod: PodcastData) => (
                                    <div
                                      key={pod.title}
                                      className="px-4 flex flex-col justify-between bg-[#15151500] h-[50px]"
                                    ></div>
                                  )
                                )}
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
                              <div className="flex overflow-x-scroll pb-4 w-full sm:justify-center ">
                                {sponsorPodcastArray?.map(
                                  (pod: PodcastData) => (
                                    <div
                                      key={pod.title}
                                      className="px-3 flex flex-col justify-between "
                                    >
                                      <div>
                                        <Image
                                          src={pod?.imageUrl}
                                          width={80}
                                          height={80}
                                          alt={pod.title}
                                          className={`${
                                            placeholder && !isOpen
                                              ? "opacity-0"
                                              : "opacity-100"
                                          } min-w-[80px] min-h-[80px] rounded-md mb-2`}
                                        />

                                        <h1
                                          className={`${
                                            placeholder && !isOpen
                                              ? "opacity-0"
                                              : "opacity-100"
                                          } text-xs xs:text-sm font-semibold whitespace-nowrap`}
                                        >
                                          {truncateString(pod.title, 10)}
                                        </h1>
                                        <h3
                                          className={`${
                                            placeholder && !isOpen
                                              ? "opacity-0"
                                              : "opacity-100"
                                          } text-xs text-[#6f6f6f] pb-2 whitespace-nowrap`}
                                        >
                                          {truncateString(pod.publisher, 12)}
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
                                  )
                                )}
                                {
                                  <Link
                                    className="min-w-[110px] h-[110px] flex items-center justify-center hover:cursor-pointer active:scale-95 hover:bg-[#272727]"
                                    href={`/${convertToSlug(sponsor.name)}`}
                                  >
                                    <p className="font-semibold text-xs xs:text-sm">
                                      View All
                                    </p>
                                  </Link>
                                }
                              </div>
                            </div>
                          </Box>
                        )}
                      </Collapse>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
          {/* Desktop */}

          {isBreakPoint || (
            <div className="mt-24 ">
              <div className="pt-14 px-10">
                <p
                  ref={bannerBreakpointRef}
                  className="w-full text-3xl font-extrabold flex justify-center mb-14 relative z-10"
                >
                  {currentCategory}
                </p>
                {(filteredSponsors.length ? filteredSponsors : null)?.map(
                  (sponsor: SponsorData, index: number) => (
                    <div
                      key={`${sponsor.name}`}
                      className={`w-full rounded-md p-8 bg-gradient-to-r ${
                        ninjaMode
                          ? "from-[#171717] to-[#121212]"
                          : "from-[#232323] to-[#181818]"
                      } shadow-lg shadow-[black] mb-6`}
                    >
                      <div className="flex w-full">
                        <div className="flex flex-col min-w-full ">
                          <div className="flex-col flex w-full ">
                            <div className="flex justify-start ">
                              <Image
                                src={sponsor.imageUrl}
                                width={225}
                                height={225}
                                alt={sponsor.name}
                                priority
                                className={` max-h-[120px] max-w-[120px] rounded-lg shadow-xl shadow-black`}
                              />
                              <div className="flex ml-4 flex-col rounded-sm">
                                <div className="p-6 rounded-md">
                                  <div className="flex flex-col gap-2 px-4">
                                    <h1
                                      className={`text-[#ebebeb] text-5xl font-extrabold relative z-10`}
                                    >
                                      {sponsor.name}
                                    </h1>
                                    <h1
                                      className={`text-[#bababa] text-xl relative z-10 `}
                                    >
                                      {sponsor.offer}
                                    </h1>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div
                            className={`relative pt-8 ml-2 flex w-full justify-between `}
                          >
                            <div className={`flex flex-col gap-1 w-9/12 `}>
                              <h1
                                className={`text-2xl font-semibold text-[#ebebeb] `}
                              >
                                About
                              </h1>
                              <p className="font-light py-4">
                                {sponsor.summary}
                              </p>
                            </div>
                            <Link href={`/${convertToSlug(sponsor.name)}`}>
                              <Button className="mt-10">View Details</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() =>
                          handleCollapse(
                            sponsor.name,
                            isOpen ? "collapse" : "open"
                          )
                        }
                        className="active:scale-95 flex items-center"
                      >
                        <div className="flex items-center p-5">
                          <p className="mr-4">Shop with Creators</p>{" "}
                          {isOpen &&
                          sponsorState.selectedSponsor === sponsor.name ? (
                            <GoChevronUp />
                          ) : podcastsLoading && current === sponsor.name ? (
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
                        {sponsorState.previousSponsor === sponsor.name ? (
                          <Box
                            p="10px"
                            mt="4"
                            bg="transparent"
                            rounded="md"
                            shadow="md"
                          >
                            <div className="flex flex-col w-full">
                              <div className="flex overflow-x-scroll pb-4 w-full ">
                                {sponsorPodcastArray?.map(
                                  (pod: PodcastData) => (
                                    <div
                                      key={pod.title}
                                      className="px-4 flex flex-col justify-between bg-[#15151500] h-[50px]"
                                    >
                                      <div></div>
                                    </div>
                                  )
                                )}
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
                              <div className="flex overflow-x-scroll pb-4 w-full ">
                                {sponsorPodcastArray?.map(
                                  (pod: PodcastData) => (
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
                                          className={`${
                                            placeholder && !isOpen
                                              ? "opacity-0"
                                              : "opacity-100"
                                          } min-w-[110px] min-h-[110px] rounded-md mb-2`}
                                        />

                                        <h1
                                          className={`${
                                            placeholder && !isOpen
                                              ? "opacity-0"
                                              : "opacity-100"
                                          } text-sm font-semibold`}
                                        >
                                          {truncateString(pod.title, 13)}
                                        </h1>
                                        <h3
                                          className={`${
                                            placeholder && !isOpen
                                              ? "opacity-0"
                                              : "opacity-100"
                                          } text-xs text-[#6f6f6f] pb-2`}
                                        >
                                          {truncateString(pod.publisher, 16)}
                                        </h3>
                                      </div>
                                      <Footer />
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
                                  )
                                )}
                                <Link
                                  className="w-[110px] h-[110px] flex items-center justify-center hover:cursor-pointer active:scale-95 hover:bg-[#272727]"
                                  href={`/${convertToSlug(sponsor.name)}`}
                                >
                                  <p className="font-semibold">View All</p>
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
            </div>
          )}
          {(filteredSponsors.length &&
            currentCategory === "All Offers" &&
            filteredSponsors.length < sponsorsCount) ||
          (currentCategory !== "All Offers" &&
            filteredSponsors.length < categoryCount) ? (
            <div className="w-full flex items-center justify-center px-10 py-10 pb-28 active:scale-[0.95]">
              {sponsorsLoading ? (
                <Button minW={"full"} py={6}>
                  <Spinner />
                </Button>
              ) : (
                <Button onClick={() => handlePagination()} minW={"full"} py={6}>
                  <div className="flex gap-4">
                    <p className="font-bold text-[#d3d3d3] text-base xs:text-lg lg:text-xl">
                      Load More
                    </p>
                  </div>
                </Button>
              )}
            </div>
          ) : null}
          <p className="flex font-bold text-[#aaaaaa] text-xs w-full items-center justify-center  pt-4 pb-6 lg:px-4">
            {`© PromoNinja ${currentYear}`}
          </p>
        </>
      </div>
      <Footer />
    </div>
  );
};

export default Offers;

export const getStaticProps = async () => {
  let { data: sponsorsData } = await client.query({
    query: Operations.Queries.GetSponsors,
    variables: {
      input: {
        offset: 0,
        pageSize: 15,
        offerPage: true,
      },
    },
  });

  let { data: sponsorCategoryData } = await client.query({
    query: Operations.Queries.GetSponsorCategories,
  });

  let { data: sponsorsCount } = await client.query({
    query: Operations.Queries.GetSponsorsCount,
    variables: {
      input: {
        isCategory: false,
      },
    },
  });

  sponsorCategoryData = sponsorCategoryData?.getSponsorCategories;
  sponsorsData = sponsorsData.getSponsors;
  sponsorsCount = sponsorsCount?.getSponsorsCount;

  return {
    props: { sponsorsData, sponsorCategoryData, sponsorsCount },
  };
};
