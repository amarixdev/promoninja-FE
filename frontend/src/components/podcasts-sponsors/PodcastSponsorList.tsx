import Image from "next/image";
import {
  convertToFullURL,
  convertToSlug,
  currentYear,
  truncateString,
} from "../../utils/functions";
import { FaEllipsisV } from "react-icons/fa";
import Link from "next/link";
import { Box, Button, Collapse } from "@chakra-ui/react";
import PromoCodeButton from "./PromoCodeButton";
import { GiNinjaHeroicStance } from "react-icons/gi";
import ChatBubble from "../community-input/ChatBubble";
import { useMediaQuery, useReportIssue } from "../../utils/hooks";
import { OfferData, PodcastData } from "../../utils/types";
import { useState } from "react";
import BrokenLinkModal from "../community-input/BrokenLinkModal";
import LogoText from "../../public/assets/logo-text.png";

interface SponsorListProps {
  podcastData: PodcastData;
  handleDrawer: (sponsor: string, isSponsorOfferDrawer: boolean) => void;
}

const SponsorList = ({ podcastData, handleDrawer }: SponsorListProps) => {
  const isBreakPoint = useMediaQuery(1023);
  const currentSponsors = podcastData?.sponsors.map((sponsor) => sponsor.name);

  const [isOpen, setIsOpen] = useState(false);
  const [preventHover, setPreventHover] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState("");
  const hasNoSponsors = podcastData?.sponsors.length === 0;
  const {
    handleBrokenLink,
    isOpenBrokenLink,
    onCloseBrokenLink,
    notified,
    podcastState,
    setPodcastState,
  } = useReportIssue(selectedSponsor);

  const getSponsor = (offerSponsor: string) => {
    return podcastData?.sponsors.filter(
      (sponsor) => sponsor.name === offerSponsor
    )[0];
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
  return (
    <div className={`w-full lg:mt-20 text-[#aaaaaa] flex flex-col`}>
      <BrokenLinkModal
        isOpen={isOpenBrokenLink}
        onClose={onCloseBrokenLink}
        selected={selectedSponsor}
        podcastState={podcastState}
        setPodcastState={setPodcastState}
        notified={notified}
      />
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
      <div className="w-full bg-gradient-to-b from-[#0e0e0e] via-[#121212] to-[#161616] flex flex-col lg:h-[600px] lg:overflow-y-auto pb-56 lg:pb-40">
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
                        <Box p="10px" bg="transparent" rounded="md" shadow="md">
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
                                    (sponsor) => sponsor.name === offer?.sponsor
                                  )[0].summary
                                }
                              </p>
                            </div>
                            <div className="w-full justify-end items-center flex pr-10">
                              <p
                                className="underline cursor-pointer text-xs font-bold active:scale-95 "
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
                  <GiNinjaHeroicStance size={150} className=" animate-pulse" />
                </div>
              </div>
            )}
          </>
        )}
        <div className="relative top-16">
          {!hasNoSponsors && (
            <ChatBubble
              message="Did we forget any sponsors?"
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
  );
};

export default SponsorList;
