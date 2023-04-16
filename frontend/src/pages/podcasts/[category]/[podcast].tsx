// import ColorExtractor from "../../../components/ColorExtractor";
import { Button, Spinner, useDisclosure } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "../../../components/Footer";
import Sidebar from "../../../components/Sidebar";
import client from "../../../graphql/apollo-client";
import { Operations } from "../../../graphql/operations";
import { FaEllipsisV } from "react-icons/fa";
import { useMediaQuery } from "../../../utils/hooks";
import { OfferData, PodcastData, SponsorData } from "../../../utils/types";
import DescriptionDrawer from "../../../components/DescriptionDrawer";
import { convertToFullURL, truncateString } from "../../../utils/functions";
import { BsPlayCircle } from "react-icons/bs";
import PreviousPage from "../../../components/PreviousPage";
import { NavContext } from "../../../context/navContext";

interface Props {
  podcastData: PodcastData;
  sponsorData: SponsorData[];
  loading: boolean;
  category: string;
}

const podcast = ({ podcastData, sponsorData, category }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setPreviousPage, previousPage, categoryType, setCategoryType } =
    NavContext();

  const imageSrc = podcastData?.imageUrl;
  const isBreakPoint = useMediaQuery(1023);
  const [sponsorDrawer, setSponsorDrawer] = useState(true);
  const [truncated, setTruncated] = useState(true);
  const [drawerData, setDrawerData] = useState({
    image: "",
    title: "",
    subtitle: "",
    description: "",
    url: "",
  });

  let existingSponsor: boolean = true;
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

  const handleDrawer = (sponsor: string, isSponsorDrawer: boolean) => {
    setSponsorDrawer(isSponsorDrawer);

    let sponsorPromotionUrl = "";

    if (isSponsorDrawer) {
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
      sponsorPromotionUrl = filteredPodcast.url;

      setDrawerData({
        image: sponsorImage,
        title: sponsorName,
        subtitle: sponsorBaseUrl,
        description: sponsorOffer,
        url: sponsorPromotionUrl,
      });
    } else {
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
      });
    }

    onOpen();
  };

  return (
    <div className={`${isBreakPoint ? "flex flex-col" : "flex"}`}>
      <Sidebar />
      <div className="flex-col w-full">
        <PreviousPage />
        {
          <div className="flex flex-col items-center relative h-[50vh] gradient bg-[#000000] w-full">
            <div
              className={`items-center w-full h-full flex justify-center`}
              style={gradientStyle}
            >
              <div className="flex flex-col justify-center items-center w-full relative top-[60px]">
                <Image
                  src={imageSrc}
                  alt="/"
                  width={250}
                  height={250}
                  priority
                  className={`z-10 top-4 mt-10 relative base:w-[150px] xs:w-[180px] sm:w-[250px] shadow-2xl shadow-black`}
                />
                <div className="w-full my-10">
                  <h1 className=" base:text-3xl xs:text-4xl sm:text-5xl font-bold lg:font-extrabold ml-6 px-2">
                    {podcastData?.title}
                  </h1>
                  <h2 className="base:text-md font-medium xs:text-lg ml-6 my-4 text-[#aaaaaa] p-2">
                    {podcastData?.publisher}{" "}
                  </h2>
                  {isBreakPoint || (
                    <div className="w-full">
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
                              className="hover:text-white active:scale-95"
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
          <div className="flex justify-center items-center">
            <div className="w-[95%] border-b-[1px] py-8 mt-2 mb-6"></div>
          </div>
          <DescriptionDrawer
            isOpen={isOpen}
            onClose={onClose}
            drawer={drawerData}
            sponsorDrawer={sponsorDrawer}
            podcastPage={true}
            externalUrl={podcastData?.externalUrl}
          />
          <div className="flex flex-wrap mx-4 justify-between">
            {podcastData.offer.map((offer: OfferData, index) => (
              <div
                key={offer.sponsor}
                className="w-full h-[50px] flex justify-between items-center hover:bg-[#101010]"
              >
                <div className="flex items-center">
                  <p className="text-[#aaaaaa] base:text-xs xs:text-sm font-semibold p-4">
                    {index + 1}
                  </p>
                  {isBreakPoint || (
                    <Image
                      src={
                        sponsorData.filter(
                          (sponsor) => sponsor.name === offer.sponsor
                        )[0].imageUrl
                      }
                      width={40}
                      height={40}
                      priority
                      alt={offer.sponsor}
                      className="mx-2"
                    />
                  )}

                  <div className="w-full items-start px-2">
                    <h1 className="text-white font-semibold base:text-sm ">
                      {offer.sponsor}
                    </h1>
                    <h3 className="base:text-xs">{offer.url}</h3>
                  </div>
                </div>
                {isBreakPoint || (
                  <div className="flex w-[50vw] absolute justify-start right-[100px] px-[140px] items-center">
                    <p className="text-sm self-start font-medium">
                      {
                        sponsorData.filter(
                          (sponsor) => sponsor.name === offer.sponsor
                        )[0].offer
                      }
                    </p>
                  </div>
                )}
                {isBreakPoint || (
                  <div className="relative right-10 text-xs">
                    <Link
                      href={convertToFullURL(offer.url)}
                      target="_blank"
                      className=""
                    >
                      <Button>Visit Site</Button>
                    </Link>
                  </div>
                )}
                {isBreakPoint && (
                  <FaEllipsisV
                    className="mr-4 hover:cursor-pointer"
                    onClick={() => handleDrawer(offer.sponsor, true)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        {isBreakPoint && (
          <div className="w-full text-[#000000] base:text-[50px] xs:text-[60px] relative">
            margin
          </div>
        )}
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
