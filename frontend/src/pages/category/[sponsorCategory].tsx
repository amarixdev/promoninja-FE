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
import style from "../../../styles/style.module.css";
import CategoryTabs from "../../components/CategoryTabs";
import DescriptionDrawer from "../../components/DescriptionDrawer";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import client from "../../graphql/apollo-client";
import { Operations } from "../../graphql/operations";
import { convertToSlug, truncateString } from "../../utils/functions";
import {
  useLoadingScreen,
  useMediaQuery,
  useSetCurrentPage,
} from "../../utils/hooks";
import { PodcastData, SponsorCategory, SponsorData } from "../../utils/types";

interface Props {
  categoryData: SponsorCategory;
  sponsorCategoryData: SponsorCategory[];
}

interface SponsorState {
  selectedSponsor: string;
  previousSponsor: string;
}

const SponsorCategory = ({ categoryData, sponsorCategoryData }: Props) => {
  useSetCurrentPage({ home: false, podcasts: false, search: false });
  const isBreakPoint = useMediaQuery(1023);
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
  const [placeholder, setPlaceholder] = useState(false);
  const [navigateButtonPressed, setNavigateButtonPressed] = useState(false);
  const [sponsorPodcastArray, setSponsorPodcastArray] =
    useState<PodcastData[]>();
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
  useEffect(() => {
    window.onpopstate = (e) => {
      setNavigateButtonPressed(true);
    };
  });

  const isSponsorData = (
    input: SponsorData | PodcastData
  ): input is SponsorData => {
    return "summary" in input;
  };

  const handleDrawer = (
    data: SponsorData | PodcastData,
    sponsorName: string
  ) => {
    /* Sponsor */
    if (isSponsorData(data)) {
      setSponsorDrawer(true);
      setPodcastOfferDrawer(false);
      setDrawerData((prev) => ({
        ...prev,
        image: data.imageUrl,
        title: data.name,
        description: data.summary,
        url: data.url,
        subtitle: data.url,
      }));
      onOpenDrawer();
    } else {
      const promotion = categoryData?.sponsor.filter(
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
    }
  };

  const isLoading = useLoadingScreen();
  const handleCollapse = async (sponsor: string, action: string) => {
    if (action === "collapse") {
      setPlaceholder(true);
    }

    if (action === "open") {
      setPlaceholder(false);
    }

    if (categoryData) {
      const sponsorPodcasts = categoryData.sponsor.filter(
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

      <div className="w-full bg-gradient-to-t from-[#151515] via-[#151515] to-[#202020] overflow-x-scroll base:mb-[60px] xs:mb-[70px]">
        {
          <>
            {navigateButtonPressed || (
              <div className="fixed z-10 flex h-[100px] w-full lg:w-[84%] justify-center bg-black">
                <div className="flex justify-between w-full">
                  <div
                    className={`right-0 w-[10px] xs:w-[25px] sm:w-[50px] md:w-[20px] lg:w-[80px]  ${style.shadow} `}
                  ></div>
                  <div
                    className={`left-0 w-[10px] xs:w-[25px] sm:w-[50px]  md:w-[20px] lg:w-[80px]   ${style.shadow}`}
                  ></div>
                </div>

                <CategoryTabs
                  sponsorCategoryData={sponsorCategoryData}
                  categoryData={categoryData}
                  setPressed={setNavigateButtonPressed}
                  pressed={navigateButtonPressed}
                />
              </div>
            )}
            {isLoading ? (
              <div className="w-full h-screen bg-gradient-to-t from-[#151515] via-[#151515] to-[#282727] flex justify-center items-center">
                <Spinner />
              </div>
            ) : (
              <div>
                {
                  <div className="p-6">
                    {navigateButtonPressed && (
                      <div className="fixed z-10 flex h-[100px] top-0 border-red-500 border-2 w-full lg:w-[84%] justify-center bg-black">
                        <div className="flex justify-between w-full">
                          <div
                            className={`right-0 w-[18px] lg:w-[70px] ${style.shadow} `}
                          ></div>
                          <div
                            className={`left-0 w-[18px] lg:w-[70px]   ${style.shadow}`}
                          ></div>
                        </div>
                        <CategoryTabs
                          sponsorCategoryData={sponsorCategoryData}
                          categoryData={categoryData}
                          setPressed={setNavigateButtonPressed}
                          pressed={navigateButtonPressed}
                        />
                      </div>
                    )}
                    <div className="w-full mt-14 pt-14">
                      <h1 className="base:text-2xl text-[#e2e2e2] xs:text-3xl sm:text-4xl font-extrabold text-center p-6 break-normal ">
                        {categoryData?.name}
                      </h1>
                    </div>

                    {isBreakPoint ? (
                      /* Mobile */
                      <div>
                        {categoryData?.sponsor?.map(
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
                                onClick={() =>
                                  handleCollapse(
                                    sponsor.name,
                                    isOpen ? "collapse" : "open"
                                  )
                                }
                                className="active:scale-95"
                              >
                                <p className="mr-2">Shop with Creators</p>{" "}
                                {isOpen &&
                                sponsorState.selectedSponsor ===
                                  sponsor.name ? (
                                  <GoChevronUp />
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
                                unmountOnExit
                                
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
                                      <div className="w-full  mb-4">
                                        <div className="flex gap-2">
                                          <div className="rounded-full bg-[#0ec10e] relative top-2 min-w-[6px] max-h-[6px]"></div>
                                          <h1 className="font-bold">
                                            Exclusive Offer
                                          </h1>
                                        </div>
                                        <p className="font-light text-sm p-2">
                                          {sponsor.offer}
                                        </p>
                                      </div>
                                      <div className="w-full flex overflow-x-auto pb-4">
                                        {sponsorPodcastArray?.map(
                                          (pod: PodcastData) => (
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
                                                    className={`${
                                                      placeholder && !isOpen
                                                        ? "opacity-0"
                                                        : "opacity-100"
                                                    } "rounded-md mb-2"`}
                                                  />

                                                  <h1 className="text-sm font-semibold">
                                                    {truncateString(
                                                      pod.title,
                                                      8
                                                    )}
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
                                                  handleDrawer(
                                                    pod,
                                                    sponsor.name
                                                  )
                                                }
                                              >
                                                Support
                                              </Button>
                                            </div>
                                          )
                                        )}
                                        <Link
                                          className="min-w-[120px] h-[100px] flex items-center justify-center hover:cursor-pointer active:scale-95 hover:bg-[#272727]"
                                          href={`/${convertToSlug(
                                            sponsor.name
                                          )}`}
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
                        {categoryData?.sponsor?.map(
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
                                          className="base:min-w-[80px] rounded-md base:min-h-[80px] shadow-black shadow-2xl border-2"
                                        />
                                      </Link>
                                      <div className="flex flex-col px-6">
                                        <h1 className="text-3xl font-light text-[#cdcdcd]">
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
                                  sponsorState.selectedSponsor ===
                                    sponsor.name ? (
                                    <GoChevronUp />
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
                                      <div className="w-full flex gap-2 py-6 mb-4 px-4">
                                        <div className="rounded-full bg-[#0ec10e] relative top-3 w-2 h-2"></div>
                                        <p className="font-bold text-xl whitespace-nowrap">
                                          Exclusive Offer:
                                        </p>
                                        <p className="text-xl font-light">
                                          {sponsor.offer}{" "}
                                        </p>
                                      </div>
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
                                      <div className="w-full flex gap-2 py-6 mb-4 px-4">
                                        <div className="rounded-full bg-[#0ec10e] w-2 relative top-3 h-2"></div>
                                        <p className="font-bold text-xl whitespace-nowrap">
                                          Exclusive Offer:
                                        </p>
                                        <p className="text-xl font-light">
                                          {sponsor.offer}{" "}
                                        </p>
                                      </div>
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
                                                  } " min-w-[110px] min-h-[110px] rounded-md mb-2 "`}
                                                />

                                                <h1 className="text-sm font-semibold">
                                                  {truncateString(
                                                    pod.title,
                                                    13
                                                  )}
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
                                                  handleDrawer(
                                                    pod,
                                                    sponsor.name
                                                  )
                                                }
                                              >
                                                Support
                                              </Button>
                                            </div>
                                          )
                                        )}
                                        <Link
                                          className="w-[110px] h-[110px] flex items-center justify-center hover:cursor-pointer active:scale-95 hover:bg-[#272727]"
                                          href={`/${convertToSlug(
                                            sponsor.name
                                          )}`}
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
  const slugToCategory = category.split("-").join(" ").toLowerCase();
  console.log(slugToCategory);

  let { data: categoryData } = await client.query({
    query: Operations.Queries.GetSponsorCategory,
    variables: {
      input: { category: slugToCategory },
    },
  });

  let { data: sponsorCategoryData } = await client.query({
    query: Operations.Queries.GetSponsorCategories,
  });

  sponsorCategoryData = sponsorCategoryData?.getSponsorCategories;
  categoryData = categoryData?.getSponsorCategory;

  return {
    props: {
      categoryData,
      sponsorCategoryData,
    },
  };
};
