import React, { useState } from "react";
import client from "../graphql/apollo-client";
import { Operations } from "../graphql/operations";
import Image from "next/image";
import Footer from "../components/Footer";
import useSetHomePage from "../utils/hooks";
import { Button, Spinner, useDisclosure } from "@chakra-ui/react";
import style from "../../styles/style.module.css";
import Ninja4 from "../public/assets/ninja4.png";
import { PodcastData, SponsorData } from "../utils/types";
import { FaEllipsisV } from "react-icons/fa";
import DescriptionDrawer from "../components/DescriptionDrawer";

interface Props {
  sponsorData: SponsorData;
  podcastsData: PodcastData[];
  loading: boolean;
}

const SponsorPage = ({ sponsorData, podcastsData, loading }: Props) => {
  const [selectedPodcast, setSelectedPodcast] = useState("");
  useSetHomePage(false);
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
  });

  const handleDrawer = (podcast: PodcastData) => {
    const podcastOffer = podcast.offer.filter(
      (offer) => offer.sponsor === sponsorData.name
    );

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

  if (!sponsorData) return <Spinner />;

  console.log(podcastsData);

  return (
    <div className="bg-[#151515] h-[200vh] flex flex-col items-center w-full">
      <DescriptionDrawer
        isOpen={isOpenDrawer}
        onClose={onCloseDrawer}
        drawer={drawerData}
        sponsorDrawer={true}
        podcastButton={true}
        currentPodcast={selectedPodcast}
      />
      <div className="flex-col w-full items-center justify-center p-8 ">
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

        <h1 className="font-extrabold text-white text-center base:text-3xl  xs:text-4xl p-2 mt-6 whitespace-nowrap">
          {sponsorData?.name}
        </h1>
        <p className="font-thin text-lg p-4 text-center tracking-wider">
          {sponsorData?.summary}
        </p>
      </div>
      <div className="w-full p-4">
        <div className="p-4 relative bottom-10 ">
          <p className={`${style.neonText} text-xl font-light tracking-wider`}>
            {sponsorData?.offer}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center relative bottom-14 w-full">
        <Image
          src={Ninja4}
          alt="logo"
          width={180}
          height={180}
          className="p-4 relative"
        />
        <div className="w-full flex items-center justify-center relative bottom-20 ">
          <h1 className=" font-light text-2xl text-center p-6 mt-10 tracking-wider">
            "Support a creator with your purchase!"
          </h1>
        </div>
        <div className=" w-full flex flex-col gap-10">
          {podcastsData.map((podcast) => (
            <div className="flex flex-col hover:bg-[#222222]">
              <div
                key={podcast.title}
                className="flex justify-between items-center"
              >
                <Image
                  src={podcast.imageUrl}
                  width={100}
                  height={100}
                  alt={podcast.title}
                  className="ml-4"
                />
                <div className="w-full justify-between flex items-center">
                  <div className="p-4">
                    <h1 className="font-bold">{podcast.title}</h1>
                    <p className="text-[#909090]">{podcast.publisher}</p>
                  </div>
                  <div className="p-4">
                    <FaEllipsisV onClick={() => handleDrawer(podcast)} />
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          ))}
        </div>
      </div>

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
