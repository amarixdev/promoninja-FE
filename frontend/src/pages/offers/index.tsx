import { Box, Button, Collapse, useDisclosure } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { GiNinjaHead } from "react-icons/gi";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import DescriptionDrawer from "../../components/DescriptionDrawer";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import { NavContext } from "../../context/navContext";
import client from "../../graphql/apollo-client";
import { Operations } from "../../graphql/operations";
import {
  convertToSlug,
  scrollToTop,
  truncateString,
} from "../../utils/functions";
import useSlider, { useMediaQuery, useSetCurrentPage } from "../../utils/hooks";
import { PodcastData, SponsorCategory, SponsorData } from "../../utils/types";

interface OffersProps {
  sponsorsData: SponsorData[];
  sponsorCategoryData: SponsorCategory[];
}
interface SponsorState {
  selectedSponsor: string;
  previousSponsor: string;
}

const Offers = ({ sponsorsData, sponsorCategoryData }: OffersProps) => {
  useSetCurrentPage({
    home: false,
    podcasts: false,
    search: false,
    offers: true,
  });
  const { categoryIndex: contextIndex } = NavContext();
  const [sponsorPodcastArray, setSponsorPodcastArray] =
    useState<PodcastData[]>();
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();
  const isBreakPoint = useMediaQuery(1023);
  const [isOpen, setIsOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState(false);
  const [sponsorState, setSponsorState] = useState<SponsorState>({
    selectedSponsor: "",
    previousSponsor: "",
  });
  const [selectedPodcast, setSelectedPodcast] = useState("");
  const [sponsorDrawer, setSponsorDrawer] = useState(false);
  const [podcastOfferDrawer, setPodcastOfferDrawer] = useState(true);

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

  const [categoryIndex, setCategoryIndex] = useState(0);
  const categoryTabRef = useRef<HTMLButtonElement>(null);
  const categoryTab = categoryTabRef.current;

  useEffect(() => {
    if (contextIndex === -1) {
      setCurrentCategory("All Offers");
      setCategoryIndex(0);
      setFilteredSponsors(sponsorsData);
    } else {
      const filteredIndexes = sponsorCategoryData.filter((_, index) => {
        return index === contextIndex;
      });
      setCurrentCategory(filteredIndexes[0].name);
      setCategoryIndex(contextIndex + 1);
      const filtered = sponsorsData.filter(
        (sponsor) => sponsor.sponsorCategory[0].name === filteredIndexes[0].name
      );
      setFilteredSponsors(filtered);
    }
  }, [sponsorCategoryData, contextIndex]);

  const handleDrawer = (data: PodcastData, sponsorName: string) => {
    const promotion = sponsorsData?.filter(
      (sponsor) => sponsor.name === sponsorName
    )[0].offer;

    /* Podcast */
    setSelectedPodcast(data.title);
    setSponsorDrawer(false);
    setPodcastOfferDrawer(true);
    setDrawerData((prev) => ({
      ...prev,
      image: data.imageUrl,
      title: data.title,
      description: promotion,
      color: data.backgroundColor,
      subtitle: data.publisher,
      url: data.offer[0].url,
      promoCode: data.offer[0].promoCode,
      category: data.category[0].name,
    }));
    onOpenDrawer();
  };

  const handleCollapse = async (sponsor: string, action: string) => {
    if (action === "collapse") {
      setPlaceholder(true);
    }

    if (action === "open") {
      setPlaceholder(false);
    }

    if (sponsorsData) {
      const sponsorPodcasts = sponsorsData.filter(
        (sp) => sp.name === sponsor
      )[0].podcast;
      setSponsorPodcastArray(
        sponsorPodcasts.sort(() => Math.random() - 0.5).slice(0, 5)
      );
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
  const [filteredSponsors, setFilteredSponsors] = useState<any>([]);
  const [currentCategory, setCurrentCategory] = useState("");

  const filterCategory = (category: string, index: number) => {
    window.scrollTo({ top: 0 });
    setCategoryIndex(index + 1);
    setCurrentCategory(category);
    const filtered = sponsorsData.filter(
      (sponsor) => sponsor.sponsorCategory[0].name === category
    );
    setFilteredSponsors(filtered);
  };
  const sliderRef = useRef<HTMLDivElement>(null);
  const { slideTopPicks, showLeftArrow, showRightArrow } = useSlider(
    sliderRef.current,
    850
  );

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

      <div className=" w-full relative z-1 mt-[100px] bg-gradient-to-b from-[#151515] via-[#151515] to-[#121212]">
        <div
          className={
            "fixed bg-[#121212] pb-8 pt-4 px-8 top-0 w-full z-[200] flex justify-between"
          }
        >
          <h1
            className={`text-3xl sm:text-5xl font-bold text-white `}
            onClick={() => {
              isBreakPoint ? scrollToTop() : null;
            }}
          >
            {"Offers"}
          </h1>
          {
            <button
              className={`text-3xl sm:text-5xl lg:right-[300px] font-bold relative hover:cursor-pointer active:scale-95 text-white `}
            >
              <GiNinjaHead />
            </button>
          }
        </div>
        <div
          className="fixed scrollbar-hide lg:top-24 top-20  bg-[#151515] z-[100] overflow-x-scroll scroll-smooth w-full lg:w-[85%] flex pt-5 lg:pt-3 items-center"
          ref={sliderRef}
        >
          <div className="flex items-center justify-between w-full relative z-[9999]"></div>
          {isBreakPoint || (
            <button
              className={`fixed bg-[#151515] z-[200] p-5 hover:cursor-pointer`}
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

          <div className="flex gap-5  px-6 lg:px-24 lg:pr-44 xl:pr-32 pb-4 lg:py-4">
            <Button
              minWidth={150}
              onClick={() => {
                setCategoryIndex(0);
                setCurrentCategory("All Offers");
                setFilteredSponsors(sponsorsData);
                window.scrollTo({ top: 0 });
              }}
              className={`${
                categoryIndex === 0
                  ? "border-b-2 border-[#cecece]"
                  : "border-none"
              } transition-all duration-300 active:scale-95 `}
            >
              All
            </Button>

            {isBreakPoint
              ? /* Mobile */
                sponsorCategoryData.map((category, index) => (
                  <Button
                    maxWidth={30}
                    onClick={() => filterCategory(category.name, index)}
                    key={index}
                    px={"20"}
                    ref={contextIndex === index ? categoryTabRef : undefined}
                    className={`${
                      categoryIndex === index + 1
                        ? "border-b-2 border-[#cecece]"
                        : "border-none"
                    } transition-all duration-300 active:scale-95`}
                  >
                    <p className="text-sm lg:text-base">{category.name}</p>
                  </Button>
                ))
              : /* Desktop */
                sponsorCategoryData.map((category, index) => (
                  <Button
                    minWidth={150}
                    onClick={() => filterCategory(category.name, index)}
                    key={index}
                    px={"24"}
                    ref={contextIndex === index ? categoryTabRef : undefined}
                    className={`${
                      categoryIndex === index + 1
                        ? "border-b-2 border-[#cecece]"
                        : "border-none"
                    } transition-all duration-300 active:scale-95`}
                  >
                    <p className="text-sm lg:text-base">{category.name}</p>
                  </Button>
                ))}
          </div>
          <div className="flex items-center justify-between w-full relative z-">
            <div
              className={
                "fixed bg-[#121212] p-8 w-full z-[20] flex justify-between"
              }
            >
              <h1
                className={`text-3xl sm:text-5xl font-bold text-white `}
                onClick={() => {
                  isBreakPoint ? scrollToTop() : null;
                }}
              >
                {"Offers"}
              </h1>
              {
                <button
                  className={`text-3xl sm:text-5xl font-bold lg:right-[300px] relative hover:cursor-pointer active:scale-95 text-white `}
                >
                  <GiNinjaHead />
                </button>
              }
            </div>
          </div>
          {isBreakPoint || (
            <button
              className={`fixed bg-[#151515] right-0 z-[200] p-5 hover:cursor-pointer`}
            >
              {
                <BiChevronRight
                  size={35}
                  className={`active:scale-95 ${
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
            <div className="mt-12 ">
              <div className="pt-10 px-5 ">
                <p className=" w-full text-3xl font-extrabold flex justify-center pb-14">
                  {currentCategory}
                </p>
                {(filteredSponsors.length
                  ? filteredSponsors
                  : sponsorsData
                )?.map((sponsor: SponsorData, index: number) => (
                  <div
                    key={`${sponsor.name}`}
                    className="w-full rounded-md p-8 bg-gradient-to-r from-[#232323] to-[#181818] shadow-lg shadow-[black] mb-6"
                  >
                    <div className="flex w-full">
                      <div className="flex flex-col min-w-full ">
                        <div className="flex-col flex w-full ">
                          <div className="flex flex-col items-center ">
                            <Image
                              src={sponsor.imageUrl}
                              width={120}
                              height={120}
                              alt={sponsor.name}
                              priority
                              className={` max-h-[150px] max-w-[150px] rounded-lg shadow-xl shadow-black`}
                            />
                            <div className="flex ml-4 flex-col rounded-sm">
                              <div className="p-4">
                                <div className="flex flex-col items-center gap-2 py-2">
                                  <h1
                                    className={`text-[#ebebeb] text-center text-xl font-extrabold  `}
                                  >
                                    {sponsor.name}
                                  </h1>
                                  <h1
                                    className={`text-[#bababa] text-sm text-center  `}
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
                              <p className="text-sm">View Details</p>
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
                              <p className="mr-4 text-sm">Shop with Creators</p>{" "}
                              {isOpen &&
                              sponsorState.selectedSponsor === sponsor.name ? (
                                <GoChevronUp />
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
                        isOpen && sponsorState.selectedSponsor === sponsor.name
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
                              {sponsorPodcastArray?.map((pod: PodcastData) => (
                                <div
                                  key={pod.title}
                                  className="px-4 flex flex-col justify-between bg-[#15151500] h-[50px]"
                                ></div>
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
                            <div className="flex overflow-x-scroll pb-4 w-full sm:justify-center ">
                              {sponsorPodcastArray?.map((pod: PodcastData) => (
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
                                      } text-sm font-semibold whitespace-nowrap`}
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
                              ))}
                              <Link
                                className="min-w-[110px] h-[110px] flex items-center justify-center hover:cursor-pointer active:scale-95 hover:bg-[#272727]"
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
                ))}
              </div>
            </div>
          )}
          {/* Desktop */}

          {isBreakPoint || (
            <div className="mt-12">
              <div className="pt-14 px-10">
                <p className=" w-full text-3xl font-extrabold flex justify-center pb-14">
                  {currentCategory}
                </p>
                {(filteredSponsors.length
                  ? filteredSponsors
                  : sponsorsData
                )?.map((sponsor: SponsorData, index: number) => (
                  <div
                    key={`${sponsor.name}`}
                    className="w-full rounded-md p-8 bg-gradient-to-r from-[#232323] to-[#181818] shadow-lg shadow-[black] mb-6"
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
                                    className={`text-[#ebebeb] text-5xl font-extrabold`}
                                  >
                                    {sponsor.name}
                                  </h1>
                                  <h1 className={`text-[#bababa] text-xl`}>
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
                            <p className="font-light py-4">{sponsor.summary}</p>
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
                        ) : (
                          <GoChevronDown />
                        )}
                      </div>
                    </Button>

                    <Collapse
                      in={
                        isOpen && sponsorState.selectedSponsor === sponsor.name
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
                              {sponsorPodcastArray?.map((pod: PodcastData) => (
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
                            <div className="flex overflow-x-scroll pb-4 w-full ">
                              {sponsorPodcastArray?.map((pod: PodcastData) => (
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
                              ))}
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
                ))}
              </div>
            </div>
          )}
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
  });
  let { data: sponsorCategoryData } = await client.query({
    query: Operations.Queries.GetSponsorCategories,
  });

  sponsorCategoryData = sponsorCategoryData?.getSponsorCategories;

  sponsorsData = sponsorsData.getSponsors;

  return {
    props: { sponsorsData, sponsorCategoryData },
  };
};
