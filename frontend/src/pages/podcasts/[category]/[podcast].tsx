// import ColorExtractor from "../../../components/ColorExtractor";
import { Button, Divider, Img, Input, Spinner } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Footer from "../../../components/Footer";
import PlayButton from "../../../components/PlayButton";
import Sidebar from "../../../components/Sidebar";
import client from "../../../graphql/apollo-client";
import { Operations } from "../../../graphql/operations";
import { ImSad } from "react-icons/im";
import {
  callToAction,
  convertToFullURL,
  truncateString,
} from "../../../utils/functions";
import { useMediaQuery } from "../../../utils/hooks";
import { PodcastData, SponsorData } from "../../../utils/types";
import PreviousPage from "../../../components/PreviousPage";

interface Props {
  podcastData: PodcastData;
  sponsorData: SponsorData[];
  loading: boolean;
  category: string;
}

const podcast = ({ podcastData, sponsorData, category }: Props) => {
  const imageSrc = podcastData?.imageUrl;
  const isBreakPoint = useMediaQuery(1023);
  const [isActive, setIsActive] = useState(false);
  const [sponsorIndex, setSponsorIndex] = useState(0);
  let existingSponsor: boolean = true;

  const handleScrub = (forward: boolean) => {
    const limit = sponsorData?.length - 1;

    /* Scrub Forward */
    if (forward && sponsorIndex !== limit) {
      setSponsorIndex((prev) => prev + 1);

      /* Scrub Backward */
    }
    if (forward && sponsorIndex === limit) {
      setSponsorIndex(0);
    }
    if (!forward && sponsorIndex === 0) {
      setSponsorIndex(sponsorData.length - 1);
    } else if (!forward && sponsorIndex !== 0) {
      setSponsorIndex((prev) => prev - 1);
    }
  };

  if (!sponsorData) {
    existingSponsor = false;
  }

  console.log(podcastData);

  if (!imageSrc)
    return (
      <div className="flex w-full h-screen items-center justify-center ">
        <Spinner />
      </div>
    );

  const currentPodcast = podcastData.offer.filter((offer) =>
    offer.sponsor.includes(sponsorData[sponsorIndex].name)
  );

  const backgroundColor = podcastData?.backgroundColor;
  const gradientStyle = {
    backgroundImage: `linear-gradient(to bottom, ${backgroundColor}, #101010)`,
  };

  return (
    <div className={`${isBreakPoint ? "flex flex-col" : "flex"}`}>
      <Sidebar />
      {
        <div className="flex flex-col items-center relative h-screen bg-[#101010] w-full">
          <PreviousPage category={category} />
          {isActive && existingSponsor && (
            <h1 className="font-bold base:text-lg xs:text-2xl text-3xl mt-6">
              {sponsorData[sponsorIndex]?.name}
            </h1>
          )}
          <div
            className={` items-center w-full flex justify-center`}
            style={!isActive ? gradientStyle : undefined}
          >
            {isActive ? (
              <Image
                src={!isActive ? imageSrc : sponsorData[sponsorIndex]?.imageUrl}
                alt="/"
                width={230}
                height={230}
                priority
                className="z-10 rounded-3xl relative mt-10 xs:w-[160px] base:w-[130px] sm:w-[190px] shadow-xl shadow-black"
              />
            ) : (
              <Image
                src={!isActive ? imageSrc : sponsorData[sponsorIndex]?.imageUrl}
                alt="/"
                width={230}
                height={230}
                priority
                className={`z-10 rounded-3xl relative mt-10 xs:w-[160px] base:w-[130px] sm:w-[190px]`}
              />
            )}
          </div>
          {!isActive ? (
            <div className="w-10/12 flex flex-col justify-center">
              <h1 className="text-lg font-bold text-center mt-10 px-4 base:text-xl xs:text-2xl sm:text-3xl">
                {!isActive
                  ? podcastData?.title
                  : sponsorData[sponsorIndex]?.name}
              </h1>
              <p className="w-full text-md xs:text-lg font-semibold text-center mt-6">
                {isActive || truncateString(podcastData?.publisher, 30)}
              </p>
            </div>
          ) : (
            <div className="w-10/12 text-center flex flex-col items-center justify-center mt-10">
              <h1 className="font-bold base:text-md xs:text-lg sm:text-xl text-center mb-6">
                {callToAction(podcastData?.title)}
              </h1>
              <div className="w-full border-t-[1px] border-b-[1px]">
                <h1 className="font-semibold base:text-xs xs:text-sm outline-teal-300 p-4">
                  {currentPodcast[0].description}
                </h1>
              </div>
            </div>
          )}
          {isActive && (
            <div className="font-semibold my-8 flex">
              <Link
                href={convertToFullURL(currentPodcast[0].url)}
                target="_blank"
              >
                <Button className="font-bold mx-2">Shop Now </Button>
              </Link>
            </div>
          )}
          {existingSponsor || (
            <div className="w-full h-screen flex items-center justify-center">
              <h1 className="mx-3">No sponsors available</h1>
              <ImSad />
            </div>
          )}
          {existingSponsor && (
            <PlayButton
              sponsorData={sponsorData}
              isActive={isActive}
              setIsActive={setIsActive}
              handleScrub={handleScrub}
              sponsorIndex={sponsorIndex}
            />
          )}
        </div>
      }
      {isBreakPoint && (
        <div className="w-full text-[#101010] base:text-[20px] xs:text-[10px] relative">
          margin
        </div>
      )}
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
  try {
    let { data: podcastData, loading } = await client.query({
      query: Operations.Queries.GetPodcast,
      variables: {
        input: {
          podcast,
        },
      },
    });

    let { data: sponsorData } = await client.query({
      query: Operations.Queries.FetchSponsors,
      variables: {
        input: {
          podcast,
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
          category,
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
