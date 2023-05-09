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
import { BsShareFill } from "react-icons/bs";
import { FaEllipsisV } from "react-icons/fa";
import DescriptionDrawer from "../components/DescriptionDrawer";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import client from "../graphql/apollo-client";
import { Operations } from "../graphql/operations";
import Ninja4 from "../public/assets/ninja4.png";
import {
  convertToFullURL,
  convertToSlug,
  scrollToTop,
  truncateString,
} from "../utils/functions";
import { useMediaQuery, useSetCurrentPage } from "../utils/hooks";
import { PodcastData, SponsorData } from "../utils/types";
import PromoCodeButton from "../components/PromoCodeButton";

interface Props {
  sponsorData: SponsorData;
  podcastsData: PodcastData[];
  loading: boolean;
}

const SponsorPage = ({ sponsorData, podcastsData }: Props) => {
  const [selectedPodcast, setSelectedPodcast] = useState("");
  const [previousPodcast, setPreviousPodcast] = useState("");
  const isBreakPoint = useMediaQuery(1023);
  const [podcastOfferState, setPodcastOfferState] = useState({
    selectedUrl: "",
    previousUrl: "",
  });

  useSetCurrentPage({ home: false, podcasts: false, search: false });
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();
  const [banner, setBanner] = useState(false);

  const handleScroll = () => {
    const currentScrollPosition = window.pageYOffset;
    let navbarHeight = document.getElementById("banner")?.offsetHeight;

    if (navbarHeight && !isBreakPoint) {
      navbarHeight -= 300;
    }

    if (navbarHeight && isBreakPoint) {
      navbarHeight -= 100;
    }

    if (currentScrollPosition > navbarHeight!) {
      setBanner(true);
      console.log("banner");
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
  const [isOpen, setIsOpen] = useState(false);
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

  const handleDrawer = (podcast: PodcastData) => {
    const podcastOffer = podcast.offer.filter(
      (offer) => offer.sponsor === sponsorData?.name
    );

    setSelectedPodcast(podcast.title);
    setDrawerData((prev) => ({
      ...prev,
      image: podcast.imageUrl,
      title: podcast.title,
      description: sponsorData.offer,
      color: podcast.backgroundColor,
      subtitle: podcast.publisher,
      url: podcastOffer[0].url,
      promoCode: podcastOffer[0].promoCode,
      category: podcast.category[0].name,
    }));
    onOpenDrawer();
  };

  const handleCollapse = async (podcast: PodcastData) => {
    if (selectedPodcast !== podcast.title) {
      setIsOpen(true);
      const podcastOffer = podcast.offer.filter(
        (offer) => offer.sponsor === sponsorData?.name
      );

      setPodcastOfferState((prev) => ({
        ...prev,
        selectedUrl: podcastOffer[0].url,
        previousUrl: podcastOfferState.selectedUrl,
      }));

      setSelectedPodcast(podcast.title);
      setPreviousPodcast(selectedPodcast);
    }

    if (selectedPodcast === podcast.title) {
      setIsOpen((prev) => !prev);
    }
  };

  const getPodcast = (podcast: PodcastData) => {
    return podcast.offer.filter(
      (offer) => offer.sponsor === sponsorData?.name
    )[0];
  };

  if (!sponsorData) return <Spinner />;

  return (
    <div className="flex ">
      <Sidebar />
      {
        <div className="bg-gradient-to-b from-[#454545] to-[#101010] flex flex-col items-center w-full">
          <DescriptionDrawer
            isOpen={isOpenDrawer}
            onClose={onCloseDrawer}
            drawer={drawerData}
            currentPodcast={selectedPodcast}
            podcastOfferDrawer={true}
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
                    src={sponsorData.imageUrl}
                    alt={sponsorData.name}
                    width={70}
                    height={70}
                    priority
                    className={`min-w-[70px] min-h-[70px]  rounded-md p-2 relative bottom-[500px] transition-all duration-300 ${
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
                      {truncateString(sponsorData.name, 50)}
                    </h1>
                    <div className="flex gap-2">
                      <div
                        className={`rounded-full bg-[#0ec10e] transition duration-300 min-w-[6px] relative h-[6px] top-2 ${
                          banner && ""
                        }`}
                      ></div>
                      <h3
                        className={`font-semibold pb-1 text-sm lg:text-md text-[#aaaaaa] relative bottom-[500px] transition-all duration-300 ${
                          banner && "bottom-0"
                        } `}
                      >
                        {sponsorData.offer}
                      </h3>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
          {/* Mobile */}
          {isBreakPoint ? (
            <div id={"banner"}>
              <div className="flex-col w-full items-center justify-center py-2">
                <div className="p-10  flex items-center justify-center relative ">
                  <Image
                    src={sponsorData?.imageUrl}
                    width={150}
                    height={150}
                    priority
                    alt={sponsorData?.name}
                    className="shadow-xl shadow-black z-10 relative base:w-[150px] xs:w-[180px] sm:w-[220px]"
                  />
                </div>
                <div className="flex w-full items-center justify-between">
                  <h1 className=" base:text-3xl xs:text-4xl sm:text-5xl font-bold lg:font-extrabold ml-6 px-2">
                    {sponsorData?.name}
                  </h1>
                  <div className="pr-2 sm:p-6 base:hidden xs:block ">
                    <Button>
                      <BsShareFill />
                      <p className="ml-3 text-center">Share</p>
                    </Button>
                  </div>
                  <div className="base:block xs:hidden pr-6">
                    <BsShareFill />
                  </div>
                </div>

                <h2 className="base:text-md font-medium xs:text-lg ml-6 mb-4 text-[#aaaaaa] p-2">
                  {sponsorData?.url}
                </h2>

                <p className="font-thin text-lg px-8 py-6 relative bottom-4 text-start tracking-wider">
                  {sponsorData?.summary}
                </p>
                <div className="w-[100%] pb-4 border-b-[1px] mb-10"></div>
              </div>
              <div className="w-full bg-gradient-to-b rounded-lg from-[#2020201d]  to-[#20202091] p-10">
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-[#0ec10e] w-2 h-2"></div>
                    <p className="text-xl font-semibold"> Exclusive Offer:</p>
                  </div>
                  <div className="px-4 py-2">
                    <p className={`font-thin text-lg`}>{sponsorData?.offer}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Desktop */
            <div
              className="flex-col w-full items-center justify-center z-10 relative"
              id={"banner"}
            >
              <div className="p-10 flex items-center w-full">
                <Image
                  src={sponsorData?.imageUrl}
                  width={230}
                  height={230}
                  priority
                  alt={sponsorData?.name}
                  className="shadow-xl shadow-black relative "
                />
                <div className="flex flex-col items-start mx-4 p-6 ">
                  <p className="font-bold text-sm relative top-4">Sponsor</p>
                  <h1 className="font-extrabold text-white text-7xl mt-6">
                    {sponsorData?.name}
                  </h1>
                  <p className="text-[#aaaaaa] text-2xl mt-4 font-bold">
                    {sponsorData?.url}
                  </p>
                </div>
              </div>
              <div className="">
                <div className="px-6 ">
                  <div className="px-4">
                    <Button>
                      <BsShareFill />
                      <p className="ml-3">Share</p>
                    </Button>
                  </div>
                  <div className="flex m-4 mt-8">
                    <div className="w-full bg-gradient-to-b rounded-lg border-red-500 from-[#2020201d]  to-[#20202091] p-10">
                      <div className="relative">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-[#0ec10e] w-2 h-2"></div>
                          <p className="text-xl font-bold"> Exclusive Offer:</p>
                        </div>
                        <div className="px-4 py-2">
                          <p className={` font-normal text-xl text-[#aaaaaa]`}>
                            {sponsorData?.offer}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex flex-col px-10">
                      <div className="pl-10">
                        <div className=" flex justify-start">
                          <h1 className="font-bold text-2xl">About</h1>
                        </div>
                        <p className=" font-medium text-[#aaaaaa] pr-16 mt-6">
                          {sponsorData?.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center px-6 pt-4">
                  <Image
                    src={Ninja4}
                    alt="logo"
                    width={140}
                    height={140}
                    className="relative"
                  />
                  <div className="flex">
                    <div className="w-[75%] flex items-center justify-center relative ">
                      <h1 className=" font-light text-xl text-start text-[#909090] p-6 lg:p-2 tracking-wider italic">
                        "Empower your favorite podcaster by making your
                        purchases through their sponsor link.
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center justify-center relative w-full mt-4">
            {isBreakPoint ? (
              <>
                <Image
                  src={Ninja4}
                  alt="logo"
                  width={180}
                  height={180}
                  className="p-4 relative"
                />
                <div className="w-full flex items-center justify-center relative ">
                  <h1 className="font-light base:text-base sm:text-xl text-center text-[#909090] px-6 italic tracking-wider">
                    "Empower your favorite podcaster by making your purchases
                    through their sponsor link.
                  </h1>
                </div>
              </>
            ) : (
              <></>
            )}
            <div className="flex flex-col justify-evenly w-full text-[#aaaaaa] ">
              <div className="flex justify-between w-full relative pt-14 base:mb-2 lg:mb-0 pl-6 lg:pt-8 lg:pl-8 lg:pb-2">
                <div className="flex relative right-4 lg:right-0">
                  <p className="font-light text-md relative pl-4 lg:px-4 tracking-widest">
                    {`#`}
                  </p>

                  <p className="font-light text-sm sm:text-md relative px-4 tracking-widest">
                    {`Podcast`}
                  </p>
                </div>
                {isBreakPoint && (
                  <p className="font-light text-sm sm:text-md relative xs:pr-8 base:pr-4 tracking-widest">
                    {`Link`}
                  </p>
                )}
              </div>
              <div className="w-[95%] border-b-[1px] "></div>
            </div>

            <div className="w-full flex flex-col lg:h-[500px] pt-6 overflow-y-scroll base:h-[400px] xs:h-[450px] base:pb-24 lg:pb-16">
              {podcastsData.map((podcast, index) => (
                <div
                  key={podcast.title}
                  className={`flex flex-col justify-between lg:py-2`}
                >
                  {/* Mobile */}

                  {isBreakPoint ? (
                    <div className="flex justify-between items-center px-6 max-h-[80px] gap-2">
                      <p
                        className={`"text-[#aaaaaa] text-xs ${
                          index > 8 ? "pr-[6px]" : "pr-3"
                        }  font-semibold"`}
                      >
                        {index + 1}
                      </p>
                      <Image
                        src={podcast.imageUrl}
                        width={50}
                        height={50}
                        priority
                        alt={podcast.publisher}
                        className="base:min-w-[40px] xs:min-w-[50px] xs:p-0 shadow-md shadow-black rounded-md"
                      />

                      <div className="w-full justify-between flex items-center">
                        <div className="base: py-4 xs:p-4">
                          <h1 className="font-bold text-white text-sm">
                            {truncateString(podcast.title, 20)}
                          </h1>
                          <p className="text-[#909090] text-sm">
                            {truncateString(podcast.publisher, 40)}
                          </p>
                        </div>
                      </div>
                      <div className=" xs:p-4 flex ">
                        <FaEllipsisV onClick={() => handleDrawer(podcast)} />
                      </div>
                    </div>
                  ) : (
                    /* Desktop */
                    <div className="w-full ">
                      <div className=" flex justify-between">
                        <div
                          className={`w-full flex justify-between items-center bg-[#3c3c3c53] py-2 `}
                        >
                          <div className="flex px-8 items-center">
                            <p className="text-[#aaaaaa] base:text-xs xs:text-sm font-semibold p-4">
                              {index + 1}
                            </p>
                            <Link
                              href={`/podcasts/category/${convertToSlug(
                                podcast.title
                              )}`}
                            >
                              <Image
                                src={podcast.imageUrl}
                                width={80}
                                height={80}
                                alt={podcast.title}
                                className="ml-4 rounded-md shadow-md shadow-black"
                              />
                            </Link>

                            <div className="p-4">
                              <h1 className="font-bold text-lg">
                                {podcast.title}
                              </h1>
                              <p className="text-[#909090] text-md">
                                {podcast.publisher}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-end pr-16 pl-6">
                            <p
                              className={`base:hidden xl:flex pr-10 font-light transition duration-300 text-[#909090] italic ${
                                isOpen && selectedPodcast === podcast.title
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            >
                              {`"Thanks for supporting the show!"`}
                            </p>

                            <Button
                              onClick={() => handleCollapse(podcast)}
                              className="active:scale-95"
                            >
                              View Link
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex-col ">
                        <Collapse
                          in={isOpen && selectedPodcast === podcast.title}
                          animateOpacity
                        >
                          {podcast.title === previousPodcast ? (
                            <div></div>
                          ) : (
                            <Box
                              p="10px"
                              bg="transparent"
                              rounded="md"
                              shadow="md"
                            >
                              <div className="flex flex-col w-full px-10">
                                {getPodcast(podcast).url === previousPodcast ? (
                                  <div>
                                    {" "}
                                    <div>
                                      <p className="mx-2 py-2 h-10 px-4 rounded-md font-light text-3xl"></p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex justify-start items-center p-2">
                                    <h2 className="font-bold text-3xl">
                                      Visit:
                                    </h2>
                                    <Link
                                      href={convertToFullURL(
                                        podcastOfferState.selectedUrl
                                      )}
                                      target="_blank"
                                    >
                                      <div className="py-2 px-3 flex gap-2 items-center ">
                                        <p className="hover:underline underline-offset-4 rounded-md font-light text-3xl">
                                          {podcastOfferState.selectedUrl}
                                        </p>
                                      </div>
                                    </Link>
                                    {getPodcast(podcast).promoCode && (
                                      <div className="flex">
                                        <div className="border-r border-[1px] border-white"></div>

                                        <div className="ml-4 flex items-center gap-4 font-bold text-lg">
                                          <p className="">Use Code</p>

                                          <PromoCodeButton
                                            promoCode={
                                              getPodcast(podcast).promoCode
                                            }
                                          />

                                          <p>At Checkout</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                                <div className="w-full font-light p-2 mb-4 flex">
                                  <p className="mx-2 text-sm py-2 px-4 rounded-xl">
                                    {" "}
                                    {podcast?.description}
                                  </p>
                                </div>
                              </div>
                            </Box>
                          )}
                        </Collapse>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      <Footer />
    </div>
  );
};

export default SponsorPage;

export const getStaticPaths = async () => {
  const paths = [{ params: { sponsor: "" } }];
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }: any) => {
  const { sponsor } = params;
  const slugToSponsor = sponsor.split("-").join(" ").toLowerCase();

  let { data: sponsorData } = await client.query({
    query: Operations.Queries.GetSponsor,
    variables: {
      input: {
        name: slugToSponsor,
      },
    },
  });

  let { data: podcastsData } = await client.query({
    query: Operations.Queries.GetSponsorPodcasts,
    variables: {
      input: {
        name: slugToSponsor,
      },
    },
  });

  sponsorData = sponsorData?.getSponsor;
  podcastsData = podcastsData?.getSponsorPodcasts;

  return {
    props: {
      sponsorData,
      podcastsData,
    },
  };
};
