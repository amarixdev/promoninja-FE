import {
  Box,
  Button,
  Collapse,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { BsPlayCircle, BsShareFill } from "react-icons/bs";
import { FaEllipsisV } from "react-icons/fa";

import { GiNinjaHeroicStance } from "react-icons/gi";
import BackButton from "../../../components/BackButton";
import BrokenLinkModal from "../../../components/BrokenLinkModal";
import DescriptionDrawer from "../../../components/DescriptionDrawer";
import Footer from "../../../components/Footer";
import PromoCodeButton from "../../../components/PromoCodeButton";
import Sidebar from "../../../components/Sidebar";
import client from "../../../graphql/apollo-client";
import { Operations } from "../../../graphql/operations";
import LogoText from "../../../public/assets/logo-text.png";

import {
  capitalizeString,
  convertToFullURL,
  convertToSlug,
  currentYear,
  scrollToTop,
  truncateString,
} from "../../../utils/functions";
import {
  useBanner,
  useCopyToClipboard,
  useMediaQuery,
  useReportIssue,
  useScrollRestoration,
  useSetCurrentPage,
} from "../../../utils/hooks";
import { OfferData, PodcastData } from "../../../utils/types";
import ToggleButton from "../../../components/ChatBubble";
import ChatBubble from "../../../components/ChatBubble";
import CommunityModal from "../../../components/CommunityModal";

interface Props {
  podcastData: PodcastData;
  loading: boolean;
  category: string;
}

const Podcast = ({ podcastData, category }: Props) => {
  const router = useRouter();
  const { handleCopy } = useCopyToClipboard();
  const currentSponsors = podcastData?.sponsors.map((sponsor) => sponsor.name);
  const copyToClipboard = () => {
    handleCopy(window.location.href);
  };

  useScrollRestoration(router);
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();
  const [isOpen, setIsOpen] = useState(false);
  const imageSrc = podcastData?.imageUrl;
  const spotifyGreen = "1DB954";
  const hasNoSponsors = podcastData?.sponsors.length === 0;
  const isBreakPoint = useMediaQuery(1023);
  const [sponsorOfferDrawer, setSponsorOfferDrawer] = useState(true);
  const [podcastDrawer, setPodcastDrawer] = useState(false);
  const [truncated, setTruncated] = useState(true);
  const [drawerData, setDrawerData] = useState({
    image: "",
    title: "",
    subtitle: "",
    description: "",
    url: "",
    promoCode: "",
    category: "",
  });
  const [preventHover, setPreventHover] = useState(false);
  const bannerBreakpointRef = useRef<HTMLDivElement>(null);
  const { banner } = useBanner(bannerBreakpointRef, 0);
  let existingSponsor: boolean = true;
  const [selectedSponsor, setSelectedSponsor] = useState("");
  useSetCurrentPage({
    home: false,
    podcasts: false,
    search: false,
    offers: false,
  });

  const {
    handleBrokenLink,
    isOpenBrokenLink,
    onCloseBrokenLink,
    notified,
    podcastState,
    setPodcastState,
  } = useReportIssue(selectedSponsor);

  if (!podcastData?.sponsors) {
    existingSponsor = false;
  }

  if (!imageSrc)
    return (
      <div className="flex w-full h-screen items-center justify-center ">
        <Spinner />
      </div>
    );

  const backgroundColor = podcastData?.backgroundColor;
  const gradientStyle = {
    backgroundImage: `linear-gradient(to bottom, ${backgroundColor}, #000000)`,
  };

  const handleCollapse = async (sponsor: string) => {
    if (selectedSponsor !== sponsor) {
      setIsOpen(true);
      setSelectedSponsor(sponsor);
    }
    if (selectedSponsor === sponsor) {
      setIsOpen((prev) => !prev);
    }
  };

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

  const getSponsor = (offerSponsor: string) => {
    return podcastData?.sponsors.filter(
      (sponsor) => sponsor.name === offerSponsor
    )[0];
  };

  return (
    <div className={`${isBreakPoint ? "flex flex-col" : "flex "}`}>
      <Sidebar />
      <div className="flex-col w-full overflow-hidden ">
        <BackButton />

        {
          <div className="flex flex-col items-center relative h-[50vh] w-full">
            <BrokenLinkModal
              isOpen={isOpenBrokenLink}
              onClose={onCloseBrokenLink}
              selected={selectedSponsor}
              podcastState={podcastState}
              setPodcastState={setPodcastState}
              notified={notified}
            />
            {
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
                {
                  <div
                    className={`flex w-full bg-[#00000073] p-3 backdrop-blur-md items-center relative transition-all duration-300 z-50 ${
                      banner ? "bottom-0" : "bottom-[500px]"
                    } `}
                  >
                    <Image
                      src={imageSrc}
                      alt={podcastData.title}
                      width={70}
                      height={70}
                      priority
                      className={`min-w-70 lg:min-w-[60px] rounded-md p-2 relative lg:hover:cursor-pointer`}
                      onClick={() => scrollToTop()}
                    />
                    <div className="flex flex-col justify-center px-2">
                      <h1
                        className={`font-bold lg:font-extrabold relative text-base xs:text-lg lg:text-3xl `}
                      >
                        {truncateString(podcastData.title, 20)}
                      </h1>
                      <div className="flex gap-2">
                        <h3
                          className={`font-semibold text-xs xs:text-sm lg:text-md text-[#aaaaaa] relative bottom-[500px`}
                        >
                          {podcastData.publisher}
                        </h3>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
            <div
              className={`items-center w-full h-full flex justify-center`}
              style={gradientStyle}
            >
              <div
                className="flex flex-col justify-center items-center w-full relative top-[60px] lg:mt-12"
                id="banner"
              >
                <Image
                  src={imageSrc}
                  alt={podcastData.title}
                  width={250}
                  height={250}
                  priority
                  loading="eager"
                  className={`z-10 rounded-lg lg:top-6 mt-8 lg:mb-4 relative base:w-[180px] xs:w-[220px] sm:w-[250px] shadow-2xl shadow-black`}
                />
                <div className="w-full my-10">
                  <h1 className=" text-center base:text-lg xs:text-xl sm:text-3xl font-bold lg:font-extrabold px-4 ">
                    {podcastData?.title}
                  </h1>
                  <h2
                    ref={bannerBreakpointRef}
                    className="text-center base:text-sm font-medium xs:text-base mb-4 text-[#aaaaaa] px-4 mt-2"
                  >
                    {podcastData?.publisher}{" "}
                  </h2>
                  {isBreakPoint || (
                    <div className="w-full flex items-center justify-between pb-4">
                      <div className="flex items-center px-6 gap-3">
                        <Link href={`/podcasts/${convertToSlug(category)}`}>
                          <Button>
                            <p className="text-sm">
                              {capitalizeString(
                                category.split("-").join(" ").toLowerCase()
                              )}
                            </p>
                          </Button>
                        </Link>
                        <Button onClick={() => copyToClipboard()}>
                          <BsShareFill size={14} />
                          <p className="ml-3 text-sm">Share</p>
                        </Button>
                      </div>
                      <Link
                        href={podcastData?.externalUrl}
                        target="_blank"
                        className="flex w-fit justify-start items-center p-4 mr-14"
                      >
                        <BsPlayCircle color={spotifyGreen} />
                        <p className="text-xs text-[#aaaaaa] hover:text-white font-semibold px-2">
                          Listen on Spotify
                        </p>
                      </Link>
                    </div>
                  )}
                  {isBreakPoint && (
                    <div className="px-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/podcasts/${convertToSlug(category)}`}>
                          <Button>
                            <p className="text-xs xs:text-sm">
                              {capitalizeString(
                                category.split("-").join(" ").toLowerCase()
                              )}
                            </p>
                          </Button>
                        </Link>
                        <Button
                          minW={"fit-content"}
                          onClick={() => copyToClipboard()}
                        >
                          <BsShareFill size={15} />
                          <p className="ml-3 text-xs xs:text-sm">Share</p>
                        </Button>
                      </div>
                      <div
                        className="flex w-fit items-center justify-end py-6 relative z-[20] gap-2"
                        onClick={() => handleDrawer("", false)}
                      >
                        <button className="flex items-center justify-center bg-[#151515] rounded-full p-3">
                          <FaEllipsisV color={"#888"} size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                  {isBreakPoint || (
                    <div className="w-full h-[80px] overflow-y-scroll">
                      <p className="py-2 ml-6 text-[#aaaaaa] mb-4 px-4">
                        {truncated
                          ? truncateString(podcastData?.description, 280)
                          : podcastData?.description}
                        <span className="mx-4 font-bold text-xs">
                          {
                            <button
                              onClick={() => setTruncated((prev) => !prev)}
                              className="hover:text-white active:scale-95 relative z-[20]"
                            >
                              {podcastData.description.length > 280 && truncated
                                ? "Read More"
                                : podcastData.description.length > 280 &&
                                  !truncated
                                ? "Collapse"
                                : ""}
                            </button>
                          }
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        }

        <div className={`w-full lg:mt-20 text-[#aaaaaa] flex flex-col`}>
          <div className="flex flex-col mt-6 justify-evenly bg-gradient-to-b from-black to-[#0e0e0e]">
            <div className="flex relative p-4 lg:pl-8">
              <div className="flex justify-between lg:justify-start items-center w-full">
                <div className="flex items-center">
                  <p className="font-light text-sm sm:text-md relative right-2 lg:right-0 p-4 top-[70px] tracking-widest">
                    {`#`}
                  </p>
                  <p className="font-light text-sm sm:text-md relative top-[70px] tracking-widest">
                    {`Sponsor`}
                  </p>
                </div>

                {isBreakPoint && (
                  <p className="font-light text-sm sm:text-md relative pr-2 top-[70px] tracking-widest">
                    {`Offer`}
                  </p>
                )}
              </div>
            </div>
            <div className="w-[95%] border-b-[1px] pb-8 pt-2 mt-2 mb-1"></div>
          </div>
          <div className="w-full bg-gradient-to-b from-[#0e0e0e] via-[#121212] to-[#161616] flex flex-col lg:h-[600px] lg:overflow-y-scroll pb-56 lg:pb-40">
            {!hasNoSponsors ? (
              podcastData.offer.map((offer: OfferData, index) => (
                <div
                  key={offer.sponsor}
                  className={`flex flex-col lg:py-2 justify-between"`}
                >
                  {/* Mobile */}
                  {isBreakPoint ? (
                    <div
                      className="border-b-[0.5px] flex justify-between items-center px-6 gap-2 max-h-[80px]"
                      onClick={() => handleDrawer(offer.sponsor, true)}
                    >
                      <p
                        className={`"text-[#aaaaaa] ${
                          index > 8 ? "pr-[6px]" : "pr-3"
                        } text-xs font-semibold"`}
                      >
                        {index + 1}
                      </p>
                      <Image
                        src={
                          podcastData?.sponsors.filter(
                            (sponsor) => sponsor.name === offer?.sponsor
                          )[0].imageUrl
                        }
                        width={40}
                        height={40}
                        priority
                        alt={offer.sponsor}
                        className="base:min-w-[40px] xs:min-w-[50px] base:min-h-[40px] xs:min-h-[50px] xs:p-0 shadow-md shadow-black rounded-md"
                      />

                      <div className="w-full justify-between flex items-center">
                        <div className="base: py-4 xs:p-4">
                          <h1 className="font-medium text-white text-xs xs:text-sm">
                            {truncateString(offer.sponsor, 20)}
                          </h1>
                          <p className="text-[#909090] text-xs xs:text-sm">
                            {getSponsor(offer.sponsor).url}
                          </p>
                        </div>
                      </div>
                      <div className=" xs:p-4 flex ">
                        <FaEllipsisV
                          color="#555"
                          size={13}
                          onClick={() => handleDrawer(offer.sponsor, true)}
                        />
                      </div>
                    </div>
                  ) : (
                    /* Desktop */
                    <>
                      <div className="w-full select-none ">
                        <div
                          className={`flex justify-between bg-[#2b2b2b53] py-2 cursor-pointer ${
                            preventHover || "group"
                          }`}
                          onClick={() => handleCollapse(offer.sponsor)}
                        >
                          <div className="w-full flex justify-between items-center ">
                            <div className="flex px-8 items-center">
                              <p className="text-[#aaaaaa] base:text-xs xs:text-sm font-semibold p-4">
                                {index + 1}
                              </p>
                              <Link
                                href={`/${convertToSlug(
                                  getSponsor(offer.sponsor).name
                                )}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                onMouseEnter={() => {
                                  setPreventHover(true);
                                }}
                                onMouseLeave={() => {
                                  setPreventHover(false);
                                }}
                              >
                                <Image
                                  src={getSponsor(offer.sponsor).imageUrl}
                                  width={80}
                                  height={80}
                                  priority
                                  loading="eager"
                                  alt={offer.sponsor}
                                  className="rounded-md w-[80px] h-[80px] shadow-md shadow-black hover:scale-105 transition-all duration-300"
                                />
                              </Link>

                              <div className="p-4">
                                <h1 className="text-white font-bold text-lg">
                                  {offer.sponsor}
                                </h1>
                                <p className="text-[#909090] text-md">
                                  {offer.url}
                                </p>
                              </div>
                            </div>

                            <div className="flex justify-end pl-6 pr-14">
                              <Button className="group-active:scale-95 group-hover:bg-[#3c3c3c] active:scale-95">
                                View Offer
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex-col ">
                          <Collapse
                            in={selectedSponsor === offer.sponsor && isOpen}
                            animateOpacity
                          >
                            <Box
                              p="10px"
                              bg="transparent"
                              rounded="md"
                              shadow="md"
                            >
                              <div className="flex flex-col text-white w-full p-2">
                                <div className="flex justify-start p-2">
                                  <Link
                                    href={`${convertToFullURL(offer.url)}`}
                                    target="_blank"
                                    className="hover:underline underline-offset-4"
                                  >
                                    <div className="flex">
                                      <div
                                        className={`rounded-full bg-[#0ec10e] min-w-[6px] top-6 relative h-[6px] `}
                                      ></div>
                                      <p className="mx-2 py-2 rounded-md font-light text-3xl">
                                        {
                                          podcastData?.sponsors.filter(
                                            (sponsor) =>
                                              sponsor.name === offer?.sponsor
                                          )[0].offer
                                        }
                                      </p>
                                    </div>
                                  </Link>
                                  {offer.promoCode && (
                                    <div className="flex">
                                      <div className="border-r border-[1px] border-white"></div>

                                      <div className="ml-4 flex items-center gap-4 font-bold text-lg">
                                        <p className="">Use Code</p>

                                        <PromoCodeButton
                                          promoCode={offer.promoCode}
                                        />

                                        <p>At Checkout</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="w-full font-light p-2 mb-4 flex">
                                  <p className="text-white mx-2 text-sm lg:text-base py-2 px-4 rounded-xl">
                                    {
                                      podcastData?.sponsors.filter(
                                        (sponsor) =>
                                          sponsor.name === offer?.sponsor
                                      )[0].summary
                                    }
                                  </p>
                                </div>
                                <div className="w-full justify-end items-center flex pr-10">
                                  <p
                                    className="underline cursor-pointer text-xs font-bold active:scale-95"
                                    onClick={() =>
                                      handleBrokenLink(selectedSponsor)
                                    }
                                  >
                                    Report Issue
                                  </p>
                                </div>
                              </div>
                            </Box>
                          </Collapse>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <>
                {isBreakPoint ? (
                  <div className=" h-full p-6 flex flex-col gap-8 w-full items-center">
                    <Image src={LogoText} width={150} height={150} alt="logo" />
                    <div className="flex items-center justify-center animate-pulse flex-col gap-10 font-thin text-lg px-2">
                      <div className="flex flex-col">
                        <p className="text-center">
                          &ldquo;Sorry, no sponsors at the moment.
                        </p>
                        <p className="text-center">
                          Make sure to check again later.&rdquo;
                        </p>
                      </div>
                      <GiNinjaHeroicStance size={100} />
                    </div>
                  </div>
                ) : (
                  <div className=" h-full p-6 flex flex-col gap-8 w-full items-center">
                    <Image src={LogoText} width={200} height={200} alt="logo" />
                    <div className="flex items-center justify-center flex-col gap-10 font-thin text-2xl px-2">
                      <div className="flex flex-col">
                        <p className="text-center">
                          &ldquo;Sorry, no sponsors at the moment.
                        </p>
                        <p className="text-center">
                          Make sure to check again later.&rdquo;
                        </p>
                      </div>
                      <GiNinjaHeroicStance
                        size={150}
                        className=" animate-pulse"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="relative top-16">
              {!hasNoSponsors && (
                <ChatBubble
                  message="Did we miss any sponsors?"
                  page="podcast"
                  currentSponsors={currentSponsors}
                />
              )}

              <p className="flex mt-10 font-bold text-[#9f9f9f] text-xs w-full items-center justify-center lg:px-4">
                {`© PromoNinja ${currentYear}`}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
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
        loading,
        category,
      },
      revalidate: oneWeek,
    };
  } catch (error) {
    console.log(error);
  }
};
