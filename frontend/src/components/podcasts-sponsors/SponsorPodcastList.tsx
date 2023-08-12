import React, { RefObject, useState } from "react";
import ChatBubble from "../community-input/ChatBubble";
import Image from "next/image";
import {
  convertToFullURL,
  convertToSlug,
  currentYear,
  truncateString,
} from "../../utils/functions";
import { FaEllipsisV } from "react-icons/fa";
import Link from "next/link";
import { Box, Button, Collapse, useDisclosure } from "@chakra-ui/react";
import PromoCodeButton from "./PromoCodeButton";
import Logo from "../../public/assets/logo.png";
import { useMediaQuery, useReportIssue } from "../../utils/hooks";
import { PodcastData, SponsorData } from "../../utils/types";
import fallbackImage from "../../public/assets/fallback.png";
import DescriptionDrawer from "./DescriptionDrawer";
import BrokenLinkModal from "../community-input/BrokenLinkModal";
import { BsSpotify } from "react-icons/bs";
import Footer from "../layout/Footer";

interface PodcastListProps {
  sponsorData: SponsorData;
  columnBreakpointRef: RefObject<HTMLDivElement>;
}

const PodcastList = ({
  sponsorData,
  columnBreakpointRef,
}: PodcastListProps) => {
  const isBreakPoint = useMediaQuery(1023);
  const [preventHover, setPreventHover] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState("");
  const [previousPodcast, setPreviousPodcast] = useState("");
  const [podcastOfferState, setPodcastOfferState] = useState({
    selectedUrl: "",
    previousUrl: "",
  });

  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();
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

  const {
    handleBrokenLink,
    isOpenBrokenLink,
    onCloseBrokenLink,
    notified,
    podcastState,
    setPodcastState,
  } = useReportIssue(selectedPodcast);

  const handleCollapse = async (podcast: PodcastData) => {
    console.log(podcast);
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

  return (
    <section className="flex flex-col items-center justify-center relative w-full mt-4">
      <DescriptionDrawer
        isOpen={isOpenDrawer}
        onClose={onCloseDrawer}
        drawer={drawerData}
        currentPodcast={selectedPodcast}
        podcastOfferDrawer={true}
      />
      <BrokenLinkModal
        isOpen={isOpenBrokenLink}
        onClose={onCloseBrokenLink}
        selected={selectedPodcast}
        podcastState={podcastState}
        setPodcastState={setPodcastState}
        notified={notified}
      />
      {/* Mobile */}
      {isBreakPoint ? (
        <>
          <Image
            src={Logo}
            alt="logo"
            width={180}
            height={180}
            className="p-4 relative"
          />
          <div className="w-full flex items-center justify-center relative ">
            <p className="font-light base:text-base sm:text-xl text-center text-[#909090] px-6 italic tracking-wider">
              &ldquo;Empower your favorite podcaster by making your purchases
              through their sponsor link.&rdquo;
            </p>
          </div>
        </>
      ) : (
        /* Desktop */
        <></>
      )}
      <div className="flex flex-col justify-evenly w-full text-[#aaaaaa]">
        <div
          ref={columnBreakpointRef}
          className="flex justify-between w-full relative pt-14 base:mb-2 lg:mb-0 pl-6 lg:pt-8 lg:pl-8 lg:pb-2"
        >
          <div className="flex relative right-4 lg:right-0">
            <h3 className="font-light text-xs sm:text-sm relative pl-4 lg:px-4 tracking-widest">
              {`#`}
            </h3>

            <h3 className="font-light text-xs sm:text-sm  relative px-4 tracking-widest">
              {`Podcast`}
            </h3>
          </div>
          {isBreakPoint && (
            <h3 className="font-light text-xs sm:text-sm  relative xs:pr-8 base:pr-4 tracking-widest">
              {`Link`}
            </h3>
          )}
        </div>
        <div className="w-[95%] border-b-[1px] "></div>
      </div>

      <div className="w-full flex flex-col lg:h-[500px] pt-1 lg:pt-6  pb-52">
        {sponsorData?.podcast.map((podcast, index) => (
          <div
            key={podcast.title}
            className={`flex flex-col justify-between lg:py-2`}
          >
            {/* Mobile */}

            {isBreakPoint ? (
              <div
                className="border-b-[0.5px] flex justify-between items-center px-6 max-h-[80px] gap-2"
                onClick={() => handleDrawer(podcast)}
              >
                <p
                  className={`"text-[#aaaaaa] text-xs ${
                    index > 8 ? "pr-[6px]" : "pr-3"
                  }  font-semibold"`}
                >
                  {index + 1}
                </p>
                <Image
                  src={podcast.imageUrl || fallbackImage}
                  width={50}
                  height={50}
                  priority
                  alt={podcast.publisher}
                  className="base:min-w-[40px] xs:min-w-[50px] xs:p-0 shadow-md shadow-black rounded-md"
                />

                <div className="w-full justify-between flex items-center">
                  <div className="base: py-4 xs:p-4">
                    <h2 className="font-medium text-white text-xs xs:text-sm">
                      {truncateString(podcast.title, 20)}
                    </h2>
                    <h3 className="text-[#909090] text-xs xs:text-sm">
                      {truncateString(podcast.publisher, 40)}
                    </h3>
                  </div>
                </div>
                <div className="xs:p-4 flex ">
                  <FaEllipsisV color="#555" />
                </div>
              </div>
            ) : (
              /* Desktop */
              <div className="w-full select-none">
                <div className=" flex justify-between">
                  <div
                    className={`w-full flex justify-between items-center bg-[#3c3c3c53] py-2 ${
                      preventHover || "group"
                    } cursor-pointer `}
                    onClick={() => handleCollapse(podcast)}
                  >
                    <div className="flex px-8 items-center">
                      <p className="text-[#aaaaaa] base:text-xs xs:text-sm font-semibold p-4">
                        {index + 1}
                      </p>
                      <Link
                        href={`/podcasts/${convertToSlug(
                          podcast.category[0].name
                        )}/${convertToSlug(podcast.title)}`}
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
                          src={podcast.imageUrl || fallbackImage}
                          width={80}
                          height={80}
                          alt={podcast.title}
                          className="ml-4 rounded-md shadow-md shadow-black relative hover:scale-105 transition-all duration-300"
                          onMouseEnter={(e) => e.stopPropagation()}
                        />
                      </Link>

                      <div className="p-4 ">
                        <h2 className={`font-bold text-lg w-fit`}>
                          {podcast.title}
                        </h2>

                        <h3 className="text-[#909090] text-md">
                          {podcast.publisher}
                        </h3>
                      </div>
                    </div>

                    <div className="flex justify-end pr-16 pl-6 items-center">
                      <p
                        className={`base:hidden xl:flex pr-10 font-light transition duration-300 text-[#909090] italic ${
                          isOpen && selectedPodcast === podcast.title
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        {`"Thanks for supporting the show!"`}
                      </p>

                      <Button className="group-active:scale-95 group-hover:bg-[#555] active:scale-95">
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
                      <Box p="10px" bg="transparent" rounded="md" shadow="md">
                        <div className="flex flex-col w-full px-10 ">
                          {getPodcast(podcast).url === previousPodcast ? (
                            <div>
                              {" "}
                              <div>
                                <p className="mx-2 py-2 h-10 px-4 rounded-md font-light text-3xl"></p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-start items-center p-2">
                              <h2 className="font-bold text-3xl select-none">
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
                                      promoCode={getPodcast(podcast).promoCode}
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

                          <div className="w-full justify-end items-center flex ">
                            <h3
                              className="underline cursor-pointer text-xs font-bold active:scale-95"
                              onClick={() => handleBrokenLink(podcast.title)}
                            >
                              {" "}
                              Report Issue
                            </h3>
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
        <div className="relative top-16">
          <ChatBubble
            message="podcasts typically earn 5% to 20% commission when listeners use affiliate links?"
            page="sponsor"
          />
          <footer>
            <Footer />
          </footer>
        </div>
      </div>
    </section>
  );
};

export default PodcastList;
