// import ColorExtractor from "../../../components/ColorExtractor";
import { Img, Spinner } from "@chakra-ui/react";
import Image from "next/image";
import Footer from "../../../components/Footer";
import PlayButton from "../../../components/PlayButton";
import Sidebar from "../../../components/Sidebar";
import client from "../../../graphql/apollo-client";
import { Operations } from "../../../graphql/operations";
import { useMediaQuery } from "../../../utils/hooks";
import { PodcastData, SponsorData } from "../../../utils/types";

interface Props {
  podcastData: PodcastData;
  sponsorData: SponsorData[];
  loading: boolean;
}

const podcast = ({ podcastData, sponsorData }: Props) => {
  const imageSrc = podcastData?.imageUrl;
  const isBreakPoint = useMediaQuery(1023);

  console.log(sponsorData);

  if (!imageSrc)
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="flex flex-col items-center relative ">
      <Image
        src={imageSrc}
        alt="/"
        width={230}
        height={230}
        priority
        className="z-10 rounded-3xl relative mt-10 xs:w-[160px] base:w-[130px] sm:w-[230px]"
      />
      <div className="w-11/12 flex flex-col justify-center">
        <h1 className="text-lg font-bold text-center mt-10 px-4 base:text-xl xs:text-2xl sm:text-3xl">
          {podcastData?.title}
        </h1>
        <p className="w-full text-md xs:text-lg font-semibold text-center mt-6">
          {podcastData?.publisher}
        </p>
      </div>
      <PlayButton sponsorData={sponsorData} />

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
  const { podcast } = params;
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

  podcastData = podcastData.getPodcast;
  sponsorData = sponsorData.fetchSponsors;
  console.log(sponsorData);
  return {
    props: {
      podcastData,
      sponsorData,
      loading,
    },
  };
};
