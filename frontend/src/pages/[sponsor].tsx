import React, { useState } from "react";
import client from "../graphql/apollo-client";
import { Operations } from "../graphql/operations";
import Image from "next/image";
import Footer from "../components/Footer";
import useSetHomePage, { useMediaQuery } from "../utils/hooks";
import {
  Box,
  Button,
  Collapse,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import style from "../../styles/style.module.css";
import Ninja4 from "../public/assets/ninja4.png";
import { PodcastData, SponsorData } from "../utils/types";
import { FaEllipsisV } from "react-icons/fa";
import DescriptionDrawer from "../components/DescriptionDrawer";
import { convertToFullURL, truncateString } from "../utils/functions";
import Sidebar from "../components/Sidebar";
import Link from "next/link";

interface Props {
  sponsorData: SponsorData;
  podcastsData: PodcastData[];
  loading: boolean;
}

const SponsorPage = ({ sponsorData, podcastsData, loading }: Props) => {
  const [selectedPodcast, setSelectedPodcast] = useState("");
  const isBreakPoint = useMediaQuery(1023);
  const [podcastOffer, setPodcastOffer] = useState("");
  useSetHomePage(false);
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();

  const { onToggle } = useDisclosure();
  const [isOpen, setIsOpen] = useState(false);

  const [drawerData, setDrawerData] = useState({
    image: "",
    title: "",
    description: "",
    url: "",
    subtitle: "",
    color: "",
  });

  const handleDrawer = (podcast: PodcastData) => {
    const podcastOffer = podcast.offer.filter(
      (offer) => offer.sponsor === sponsorData?.name
    );

    console.log(sponsorData?.name);

    setSelectedPodcast(podcast.title);
    setDrawerData((prev) => ({
      ...prev,
      image: podcast.imageUrl,
      title: podcast.title,
      description: sponsorData.offer,
      url: podcastOffer[0].url,
      color: podcast.backgroundColor,
      subtitle: podcast.publisher,
    }));
    onOpenDrawer();
  };

  const handleCollapse = async (podcast: PodcastData) => {
    const podcastOffer = podcast.offer.filter(
      (offer) => offer.sponsor === sponsorData?.name
    );

    if (selectedPodcast !== podcast.title) {
      setIsOpen(true);
    }

    if (selectedPodcast === podcast.title) {
      setIsOpen((prev) => !prev);
    }
    onToggle();
    setSelectedPodcast(podcast.title);

    setTimeout(() => {
      setPodcastOffer(podcastOffer[0].url);
    }, 75);
  };

  console.log(sponsorData);

  if (!sponsorData) return <Spinner />;

  return (
    <div className="flex">
      <Sidebar />
      <div className="bg-gradient-to-b from-[#323232] to-[black] flex flex-col items-center w-full">
        <DescriptionDrawer
          isOpen={isOpenDrawer}
          onClose={onCloseDrawer}
          drawer={drawerData}
          currentPodcast={selectedPodcast}
          podcastOfferDrawer={true}
        />
        {isBreakPoint ? (
          <div className="flex-col w-full items-center justify-center p-8">
            <div className="p-10 flex items-center justify-center">
              <Image
                src={sponsorData?.imageUrl}
                width={200}
                height={200}
                priority
                alt={sponsorData?.name}
                className="shadow-xl shadow-black"
              />
            </div>
            <h1 className="font-extrabold text-white text-center base:text-3xl  xs:text-4xl p-2 mt-6">
              {sponsorData?.name}
            </h1>

            <p className="font-thin text-lg p-4 text-center tracking-wider">
              {sponsorData?.summary}
            </p>
          </div>
        ) : (
          <div className="flex-col w-full items-center justify-center p-8">
            <div className="p-10 flex items-center w-full ">
              <Image
                src={sponsorData?.imageUrl}
                width={230}
                height={230}
                priority
                alt={sponsorData?.name}
                className="shadow-xl shadow-black"
              />
              <div className="flex flex-col items-start mx-4 p-6 ">
                <h1 className="font-extrabold text-white text-7xl mt-6">
                  {sponsorData?.name}
                </h1>
                <p className="text-[#aaaaaa] mt-4 font-bold">
                  {sponsorData?.url}
                </p>
              </div>
            </div>
            <div className="w-full flex items-start justify-start">
              <div className="w-8/12">
                <p className="text-xl text-[#aaaaaa] p-10 tracking-wider">
                  {sponsorData?.summary}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="w-full p-4">
          <div className="relative bottom-10 px-10 mt-4 flex base:flex-col lg:flex-row items-center w-full">
            <p className="font-extrabold base:text-2xl lg:text-3xl px-4 min-w-fit">
              {" "}
              Exclusive Offer:
            </p>
            <div className="">
              <p
                className={`${style.neonText} base:text-center lg:text-left text-xl lg:text-2xl px-4 base:py-2 font-extralight tracking-wider`}
              >
                {sponsorData?.offer}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center relative bottom-14 w-full">
          {isBreakPoint ? (
            <>
              <Image
                src={Ninja4}
                alt="logo"
                width={180}
                height={180}
                className="p-4 relative"
              />
              <div className="w-full flex items-center justify-center relative bottom-20 ">
                <h1 className=" font-light text-2xl text-center text-[#909090] p-6 mt-10 italic tracking-wider">
                  "Support a creator with your purchase!"
                </h1>
              </div>
            </>
          ) : (
            <div className="flex w-full p-10">
              <Image
                src={Ninja4}
                alt="logo"
                width={200}
                height={200}
                className="p-4 relative"
              />
              <div className="flex items-center justify-center">
                <div className="w-full flex items-center justify-center relative ">
                  <h1 className=" font-light text-3xl text-center text-[#909090] p-6 tracking-wider italic">
                    "Support a creator with your purchase!"
                  </h1>
                </div>
              </div>
            </div>
          )}
          <div className="w-[95%] border-b-[1px] mb-6"></div>
          <div className="w-full flex flex-col gap-6 lg:gap-6 overflow-y-scroll h-[250px] lg:h-fit lg:overflow-visible">
            {podcastsData.map((podcast, index) => (
              <div
                key={podcast.title}
                className={`flex flex-col justify-between"`}
              >
                {isBreakPoint ? (
                  <div className="flex justify-between items-center px-6">
                    <Image
                      src={podcast.imageUrl}
                      width={80}
                      height={80}
                      alt={podcast.title}
                      className=" base:w-[60px] ml-4 rounded-md"
                    />

                    <div className="w-full justify-between flex items-center">
                      <div className="p-4">
                        <h1 className="font-bold text-sm">
                          {truncateString(podcast.title, 20)}
                        </h1>
                        <p className="text-[#909090] text-sm">
                          {podcast.publisher}
                        </p>
                      </div>
                      <div className="p-4">
                        <FaEllipsisV onClick={() => handleDrawer(podcast)} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full ">
                    <div className=" flex justify-between">
                      <div className="w-full flex justify-between items-center hover:bg-[#222222]">
                        <div className="flex px-8 items-center">
                          <p className="text-[#aaaaaa] base:text-xs xs:text-sm font-semibold p-4">
                            {index + 1}
                          </p>
                          <Link href={`/podcasts/category/${podcast.title}`}>
                            <Image
                              src={podcast.imageUrl}
                              width={80}
                              height={80}
                              alt={podcast.title}
                              className="ml-4 rounded-md"
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

                        <div className="flex justify-end px-6">
                          <Button onClick={() => handleCollapse(podcast)}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex-col ">
                      <Collapse
                        in={selectedPodcast === podcast.title && isOpen}
                        animateOpacity
                      >
                        <Box p="10px" bg="transparent" rounded="md" shadow="md">
                          <div className="flex flex-col w-full p-2">
                            <div className="flex justify-start p-2">
                              <Link
                                href={convertToFullURL(podcastOffer)}
                                target="_blank"
                                className="hover:underline underline-offset-4"
                              >
                                <p className="mx-2 py-2 px-4 rounded-md font-light text-3xl">
                                  {podcastOffer}
                                </p>
                              </Link>
                            </div>
                            <div className="w-full font-light p-2 mb-4 flex">
                              <p className="mx-2 text-sm py-2 px-4 rounded-xl">
                                {" "}
                                {podcast?.description}
                              </p>
                            </div>
                          </div>
                        </Box>
                      </Collapse>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
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

  let { data: sponsorData, loading } = await client.query({
    query: Operations.Queries.GetSponsor,
    variables: {
      input: {
        name: sponsor,
      },
    },
  });

  let { data: podcastsData } = await client.query({
    query: Operations.Queries.GetSponsorPodcasts,
    variables: {
      input: {
        name: sponsor,
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
