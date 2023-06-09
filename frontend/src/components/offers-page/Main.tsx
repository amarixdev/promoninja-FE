import { RefObject, useState } from "react";
import DescriptionDrawer from "../podcasts-sponsors/DescriptionDrawer";
import { PodcastData, SponsorData } from "../../utils/types";
import { useLazyQuery } from "@apollo/client";
import fallbackImage from "../../public/assets/fallback.png";

import {
  Box,
  Button,
  Collapse,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useMediaQuery } from "../../utils/hooks";
import { Operations } from "../../graphql/operations";
import Image from "next/image";
import Link from "next/link";
import { convertToSlug, truncateString } from "../../utils/functions";
import { GoChevronDown, GoChevronUp } from "react-icons/go";

interface SponsorState {
  selectedSponsor: string;
  previousSponsor: string;
}

interface MainProps {
  filteredSponsors: SponsorData[];
  currentCategory: string;
  bannerBreakpointRef: RefObject<HTMLDivElement>;
  rendering: boolean;
  ninjaMode: boolean;
}

const Main = ({
  filteredSponsors,
  currentCategory,
  bannerBreakpointRef,
  rendering,
  ninjaMode,
}: MainProps) => {
  const isBreakPoint = useMediaQuery(1023);
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();

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
  const [selectedPodcast, setSelectedPodcast] = useState("");
  const [podcastOfferDrawer, setPodcastOfferDrawer] = useState(true);
  const [sponsorDrawer, setSponsorDrawer] = useState(false);
  const [sponsorPodcastArray, setSponsorPodcastArray] =
    useState<PodcastData[]>();
  const [getSponsorPodcasts, { loading: podcastsLoading, data: podcastData }] =
    useLazyQuery(Operations.Queries.GetSponsorPodcasts);
  const [imageHover, setImageHover] = useState(false);
  const [loadedStatus, setLoadedStatus] = useState<{
    [key: string]: boolean;
  }>({});

  const [current, setCurrent] = useState("");
  const [placeholder, setPlaceholder] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sponsorState, setSponsorState] = useState<SponsorState>({
    selectedSponsor: "",
    previousSponsor: "",
  });

  const [hoveredOffer, setHoveredOffer] = useState("");
  const handleHover = (offerName: string, mouseEnter: boolean) => {
    setHoveredOffer(offerName);
    setImageHover(mouseEnter);
  };

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

    onOpenDrawer();
  };
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

  return (
    <>
      <DescriptionDrawer
        isOpen={isOpenDrawer}
        onClose={onCloseDrawer}
        drawer={drawerData}
        sponsorDrawer={sponsorDrawer}
        podcastOfferDrawer={podcastOfferDrawer}
        currentPodcast={selectedPodcast}
      />
      {isBreakPoint && !rendering && (
        <div className="mt-24 ">
          <div className="pt-16 px-5">
            <p className="w-full text-xl xs:text-2xl font-extrabold flex justify-center mb-10 relative z-10 ">
              {currentCategory}
            </p>

            {filteredSponsors?.length ? (
              filteredSponsors.map((sponsor: SponsorData, index: number) => (
                <div
                  key={`${sponsor.name}`}
                  className={`w-full rounded-md p-8 bg-gradient-to-r  ${
                    ninjaMode
                      ? "from-[#171717] to-[#121212]"
                      : "from-[#232323] to-[#181818]"
                  } shadow-lg shadow-[black] mb-6`}
                  ref={index === 0 ? bannerBreakpointRef : undefined}
                >
                  <div className="flex w-full">
                    <div className="flex flex-col min-w-full ">
                      <div className="flex-col flex w-full ">
                        <div className="flex flex-col items-center">
                          <Image
                            src={sponsor.imageUrl || fallbackImage}
                            width={150}
                            height={150}
                            alt={sponsor.name}
                            priority
                            loading="eager"
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
                          <Button padding={8}>
                            <p className="text-sm xs:text-base">View Details</p>
                          </Button>
                        </Link>
                        <Button
                          padding={8}
                          onClick={() =>
                            handleCollapse(
                              sponsor.name,
                              isOpen ? "collapse" : "open"
                            )
                          }
                          className="active:scale-95 flex items-center"
                        >
                          <div className="flex items-center p-5">
                            <p className="mr-4 text-sm xs:text-base">
                              Shop with Creators
                            </p>
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
                      </div>
                    </div>
                  </div>

                  <Collapse
                    in={isOpen && sponsorState.selectedSponsor === sponsor.name}
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
                            {sponsorPodcastArray?.map((pod: PodcastData) => (
                              <div
                                key={pod.title}
                                className="px-4 flex flex-col justify-between group "
                                onClick={() => handleDrawer(pod, sponsor.name)}
                              >
                                <div>
                                  <Image
                                    src={pod?.imageUrl || fallbackImage}
                                    width={90}
                                    height={90}
                                    alt={pod.title}
                                    loading="eager"
                                    className={`${
                                      placeholder && !isOpen
                                        ? "opacity-0"
                                        : "opacity-100"
                                    } min-w-[90px] min-h-[90px] rounded-md mb-2 relative z-10`}
                                  />

                                  <h1
                                    className={`${
                                      placeholder && !isOpen
                                        ? "opacity-0"
                                        : "opacity-100"
                                    } text-xs xs:text-sm font-semibold whitespace-nowrap`}
                                  >
                                    {truncateString(pod.title, 12)}
                                  </h1>
                                  <h3
                                    className={`${
                                      placeholder && !isOpen
                                        ? "opacity-0"
                                        : "opacity-100"
                                    } text-xs text-[#6f6f6f] pb-2 whitespace-nowrap`}
                                  >
                                    {truncateString(pod.publisher, 14)}
                                  </h3>
                                </div>

                                <Button
                                  width={"25"}
                                  h={"5"}
                                  fontSize={"x-small"}
                                  className="group-hover:bg-[#555] p-3 group-active:scale-95"
                                >
                                  <p className="font-semibold">Support </p>
                                </Button>
                              </div>
                            ))}
                            {
                              <Link
                                className="min-w-[110px] h-[110px] flex items-center justify-center hover:cursor-pointer active:scale-95"
                                href={`/${convertToSlug(sponsor.name)}`}
                              >
                                <button className="font-semibold text-xs xs:text-sm">
                                  View All
                                </button>
                              </Link>
                            }
                          </div>
                        </div>
                        <div className="w-full justify-center text-sm font-light text-[#aaaaaa] relative top-2 italic tracking-wide">
                          <p className="text-center">
                            Choose a podcast to{" "}
                            <span className="font-bold">support</span>
                          </p>
                        </div>
                      </Box>
                    )}
                  </Collapse>
                </div>
              ))
            ) : (
              <div className="h-screen "></div>
            )}
          </div>
        </div>
      )}
      {/* Desktop */}

      {!rendering && !isBreakPoint && (
        <div className="mt-24 ">
          <div className="pt-14 px-10">
            <p className="w-full text-3xl font-extrabold flex justify-center mb-14 relative z-10">
              {currentCategory}
            </p>
            {filteredSponsors.length ? (
              filteredSponsors.map((sponsor: SponsorData, index: number) => (
                <div
                  key={`${sponsor.name}`}
                  className={`w-full rounded-md p-8 bg-gradient-to-r ${
                    ninjaMode
                      ? "from-[#171717] to-[#121212]"
                      : "from-[#232323] to-[#181818]"
                  } shadow-lg shadow-[black] mb-6`}
                  ref={index === 0 ? bannerBreakpointRef : undefined}
                >
                  <div className="flex w-full">
                    <div className="flex flex-col min-w-full ">
                      <div className="flex-col flex w-full ">
                        <div className="flex justify-start ">
                          <Link
                            href={`/${convertToSlug(sponsor.name)}`}
                            onMouseEnter={() => {
                              handleHover(sponsor.name, true);
                            }}
                            onMouseLeave={() => {
                              handleHover(sponsor.name, false);
                            }}
                          >
                            <Image
                              src={sponsor.imageUrl || fallbackImage}
                              width={225}
                              height={225}
                              alt={sponsor.name}
                              priority
                              loading="eager"
                              className={`group transition-all duration-300 hover:scale-105 h-[120px] max-w-[120px] rounded-lg shadow-xl shadow-black relative z-10`}
                            />
                          </Link>

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
                          <p className="font-light py-4">{sponsor.summary}</p>
                        </div>
                        <Link href={`/${convertToSlug(sponsor.name)}`}>
                          <Button
                            className={`mt-10 group active:scale-95 ${
                              imageHover && hoveredOffer === sponsor.name
                                ? "scale-[1.05]"
                                : ""
                            } `}
                          >
                            <p
                              className={`${
                                imageHover && hoveredOffer === sponsor.name
                                  ? "text-white"
                                  : "text-[#aaaaaa]"
                              }  group-hover:text-white transition-all duration-300 ease-out`}
                            >
                              View Details
                            </p>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      handleCollapse(sponsor.name, isOpen ? "collapse" : "open")
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
                    in={isOpen && sponsorState.selectedSponsor === sponsor.name}
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
                          <div className="flex overflow-x-scroll pb-4 w-full scrollbar-hide ">
                            {sponsorPodcastArray?.map((pod: PodcastData) => (
                              <div
                                key={pod.title}
                                className="px-4 flex flex-col justify-between group cursor-pointer"
                                onClick={() => handleDrawer(pod, sponsor.name)}
                              >
                                <div>
                                  <Image
                                    src={pod?.imageUrl || fallbackImage}
                                    width={110}
                                    height={110}
                                    alt={pod.title}
                                    loading="eager"
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
                                <Button
                                  width={"25"}
                                  h={"5"}
                                  fontSize={"x-small"}
                                  className="group-active:scale-95 group-hover:bg-[#555]"
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
                        <div className="w-full text-[#aaaaaa] tracking-wide font-light text-sm italic relative top-2">
                          <p className=" text-left">
                            Choose a podcast to{" "}
                            <span className="font-bold">support</span>. Click to
                            reveal their link.
                          </p>
                        </div>
                      </Box>
                    )}
                  </Collapse>
                </div>
              ))
            ) : (
              <div className="h-screen"></div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Main;
