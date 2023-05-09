// import ColorExtractor from "../../../components/ColorExtractor";
import {
  Box,
  Button,
  Collapse,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsPlayCircle, BsShareFill } from "react-icons/bs";
import { FaEllipsisV } from "react-icons/fa";
import DescriptionDrawer from "../../../components/DescriptionDrawer";
import Footer from "../../../components/Footer";
import PreviousPage from "../../../components/PreviousPage";
import Sidebar from "../../../components/Sidebar";
import { NavContext } from "../../../context/navContext";
import client from "../../../graphql/apollo-client";
import { Operations } from "../../../graphql/operations";
import {
  convertToFullURL,
  convertToSlug,
  truncateString,
} from "../../../utils/functions";
import { useMediaQuery, useSetCurrentPage } from "../../../utils/hooks";
import { OfferData, PodcastData, SponsorData } from "../../../utils/types";
import PromoCodeButton from "../../../components/PromoCodeButton";
import { scrollToTop } from "../../../utils/functions";

interface Props {
  podcastData: PodcastData;
  sponsorData: SponsorData[];
  loading: boolean;
  category: string;
}

const podcast = ({ podcastData, sponsorData, category }: Props) => {
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();

  const { setPreviousPage, categoryType, setCategoryType } = NavContext();
  const [isOpen, setIsOpen] = useState(false);
  const imageSrc = podcastData?.imageUrl;
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

  const [banner, setBanner] = useState(false);

  const handleScroll = () => {
    const currentScrollPosition = window.pageYOffset;
    let navbarHeight = document.getElementById("banner")?.offsetHeight;

    if (navbarHeight && !isBreakPoint) {
      navbarHeight -= 230;
    }

    if (navbarHeight && isBreakPoint) {
      navbarHeight -= 100;
    }

    if (currentScrollPosition > navbarHeight!) {
      setBanner(true);
    } else {
      setBanner(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [banner]);

  let existingSponsor: boolean = true;
  const [selectedSponsor, setSelectedSponsor] = useState("");
  useSetCurrentPage({ home: false, podcasts: true, search: false });
  useEffect(() => {
    setCategoryType(category);
    if (categoryType !== null) {
      setPreviousPage("category");
    } else {
      setPreviousPage("podcasts");
    }
  }, [category]);

  if (!sponsorData) {
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
      const filteredSponsor = sponsorData.filter(
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
    return sponsorData.filter((sponsor) => sponsor.name === offerSponsor)[0];
  };

  return (
    <div className={`${isBreakPoint ? "flex flex-col" : "flex "}`}>
      <Sidebar />
      <div className="flex-col w-full overflow-hidden ">
        <PreviousPage />
        {
          <div className="flex flex-col items-center relative h-[50vh] w-full">
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
              <div className={`fixed w-full z-50 lg:ml-[240px]`}>
                {
                  <div
                    className={`flex w-full bg-[#00000073] backdrop-blur-md items-center relative bottom-[500px] transition-all duration-300 ${
                      banner && `bottom-0 `
                    } `}
                  >
                    <Image
                      src={imageSrc}
                      alt={podcastData.title}
                      width={70}
                      height={70}
                      priority
                      className={`min-w-70 lg:min-w-[60px] rounded-md p-2 relative bottom-[500px] transition-all duration-300 ${
                        banner && "lg:hover:cursor-pointer bottom-0"
                      } `}
                      onClick={() => scrollToTop()}
                    />
                    <div className="flex flex-col justify-center px-2">
                      <h1
                        className={`font-bold lg:font-extrabold relative bottom-[500px] text-xl lg:text-3xl transition-all duration-300 ${
                          banner && "bottom-0"
                        } `}
                      >
                        {truncateString(podcastData.title, 50)}
                      </h1>
                      <div className="flex gap-2">
                        <h3
                          className={`font-semibold text-sm lg:text-md text-[#aaaaaa] relative bottom-[500px] transition-all duration-300 ${
                            banner && "bottom-0"
                          } `}
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
              // id="banner"
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
                  className={`z-10 lg:top-6 mt-6 lg:mb-4 relative base:w-[150px] xs:w-[180px] sm:w-[220px] shadow-2xl shadow-black`}
                />
                <div className="w-full my-10">
                  <h1 className=" base:text-3xl xs:text-4xl sm:text-5xl font-bold lg:font-extrabold ml-6 px-2">
                    {podcastData?.title}
                  </h1>
                  <h2 className="base:text-md font-medium xs:text-lg ml-6 mb-4 text-[#aaaaaa] p-2">
                    {podcastData?.publisher}{" "}
                  </h2>
                  {isBreakPoint || (
                    <div className="w-full flex items-center pb-4">
                      <div className="px-6">
                        <Button>
                          <BsShareFill />
                          <p className="ml-3">Share</p>
                        </Button>
                      </div>
                      <Link
                        href={podcastData?.externalUrl}
                        target="_blank"
                        className="flex w-fit justify-start items-center p-4"
                      >
                        <BsPlayCircle color="#1DB954" />
                        <p className="text-xs font-semibold px-2">
                          Listen on Spotify
                        </p>
                      </Link>
                    </div>
                  )}
                  {isBreakPoint && (
                    <div className="px-6">
                      <Button>
                        <BsShareFill />
                        <p className="ml-3">Share</p>
                      </Button>
                    </div>
                  )}
                  {isBreakPoint && (
                    <div className="flex items-center justify-end px-5 relative">
                      <FaEllipsisV onClick={() => handleDrawer("", false)} />
                    </div>
                  )}
                  {isBreakPoint || (
                    <div className="w-full h-[80px] overflow-y-scroll">
                      <p className="p-2 ml-6 text-[#aaaaaa] mb-4">
                        {truncated
                          ? truncateString(podcastData?.description, 280)
                          : podcastData?.description}
                        <span className="mx-4 font-bold text-xs">
                          {
                            <button
                              onClick={() => setTruncated((prev) => !prev)}
                              className="hover:text-white active:scale-95 relative z-[99]"
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

        <div
          className={`w-full base:mt-14 lg:mt-20 text-[#aaaaaa] flex flex-col`}
        >
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
            <div className="w-[95%] border-b-[1px] pb-8 pt-2 mt-2 mb-6"></div>
          </div>
          <div className="w-full bg-gradient-to-b from-[#0e0e0e] via-[#121212] to-[#161616] flex flex-col h-[600px] overflow-y-scroll pb-24 lg:pb-16">
            {podcastData.offer.map((offer: OfferData, index) => (
              <div
                key={offer.sponsor}
                className={`flex flex-col lg:py-2 justify-between"`}
              >
                {/* Mobile */}
                {isBreakPoint ? (
                  <div className="flex justify-between items-center px-6 gap-2 max-h-[80px]">
                    <p
                      className={`"text-[#aaaaaa] ${
                        index > 8 ? "pr-[6px]" : "pr-3"
                      } text-xs font-semibold"`}
                    >
                      {index + 1}
                    </p>
                    <Image
                      src={
                        sponsorData.filter(
                          (sponsor) => sponsor.name === offer?.sponsor
                        )[0].imageUrl
                      }
                      width={40}
                      height={40}
                      priority
                      alt={offer.sponsor}
                      className="base:min-w-[40px] xs:min-w-[50px] xs:p-0 shadow-md shadow-black rounded-md"
                    />

                    <div className="w-full justify-between flex items-center">
                      <div className="base: py-4 xs:p-4">
                        <h1 className="font-bold text-white text-sm">
                          {truncateString(offer.sponsor, 20)}
                        </h1>
                        <p className="text-[#909090] text-sm">
                          {getSponsor(offer.sponsor).url}
                        </p>
                      </div>
                    </div>
                    <div className=" xs:p-4 flex ">
                      <FaEllipsisV
                        onClick={() => handleDrawer(offer.sponsor, true)}
                      />
                    </div>
                  </div>
                ) : (
                  /* Desktop */
                  <>
                    <div className="w-full ">
                      <div className=" flex justify-between bg-[#2b2b2b53] py-2  ">
                        <div className="w-full flex justify-between items-center ">
                          <div className="flex px-8 items-center">
                            <p className="text-[#aaaaaa] base:text-xs xs:text-sm font-semibold p-4">
                              {index + 1}
                            </p>
                            <Link
                              href={`/${convertToSlug(
                                getSponsor(offer.sponsor).name
                              )}`}
                            >
                              <Image
                                src={getSponsor(offer.sponsor).imageUrl}
                                width={80}
                                height={80}
                                priority
                                alt={offer.sponsor}
                                className="rounded-md shadow-md shadow-black"
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
                            <Button
                              onClick={() => handleCollapse(offer.sponsor)}
                              className="active:scale-95"
                            >
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
                                        sponsorData.filter(
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
                                <p className="text-white mx-2 text-sm py-2 px-4 rounded-xl">
                                  {
                                    sponsorData.filter(
                                      (sponsor) =>
                                        sponsor.name === offer?.sponsor
                                    )[0].summary
                                  }
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
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default podcast;

export const getStaticPaths = async () => {
  const paths = [{ params: { category: "", podcast: "" } }];
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }: any) => {
  const { podcast, category } = params;
  const slugToPodcast = podcast.split("-").join(" ").toLowerCase();
  const slugToCategory = category.split("-").join(" ").toLowerCase();

  try {
    let { data: podcastData, loading } = await client.query({
      query: Operations.Queries.GetPodcast,
      variables: {
        input: {
          podcast: slugToPodcast,
        },
      },
    });

    let { data: sponsorData } = await client.query({
      query: Operations.Queries.FetchSponsors,
      variables: {
        input: {
          podcast: slugToPodcast,
        },
      },
    });

    if (!sponsorData?.fetchSponsors) {
      console.log("NO DATA");
    }

    if (sponsorData?.fetchSponsors.length === 0) {
      podcastData = podcastData.getPodcast;
      return {
        props: {
          podcastData,
          category: slugToCategory,
        },
      };
    }

    podcastData = podcastData.getPodcast;
    sponsorData = sponsorData.fetchSponsors;

    return {
      props: {
        podcastData,
        sponsorData,
        loading,
        category,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
