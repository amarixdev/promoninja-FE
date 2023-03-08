// import ColorExtractor from "../../../components/ColorExtractor";
import { Img, Spinner } from "@chakra-ui/react";
import Image from "next/image";
import Footer from "../../../components/Footer";
import PlayButton from "../../../components/PlayButton";
import Sidebar from "../../../components/Sidebar";
import client from "../../../graphql/apollo-client";
import { Operations } from "../../../graphql/operations";
import { PodcastData } from "../../../utils/types";

interface Props {
  podcastData: PodcastData;
  loading: boolean;
}

const podcast = ({ podcastData, loading }: Props) => {
  const imageSrc = podcastData?.imageUrl;
  if (!imageSrc)
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="flex flex-col h-screen items-center relative">
      <Image
        src={imageSrc}
        alt="/"
        width={200}
        height={200}
        priority
        className="z-10 rounded-3xl relative mt-10"
      />
      <div className="w-9/12 flex flex-col justify-center">
        <h1 className="font-bold text-2xl text-center mt-10 px-6">
          {podcastData?.title}
        </h1>
        <p className="w-full font-semibold text-center mt-6">
          {podcastData?.publisher}
        </p>
      </div>

      <PlayButton /* sponsors prop */ />

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
  const { data, loading } = await client.query({
    query: Operations.Queries.GetPodcast,
    variables: {
      input: {
        podcast,
      },
    },
  });
  const podcastData = data.getPodcast;
  return {
    props: {
      podcastData,
      loading,
    },
  };
};
