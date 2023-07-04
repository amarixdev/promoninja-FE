import { GetStaticProps } from "next";
import Image from "next/image";
import Sidebar from "../components/layout/Sidebar";
import client from "../graphql/apollo-client";
import { Operations } from "../graphql/operations";
import LogoText from "../public/assets/logo-text.png";
import Logo from "../public/assets/ninja4.png";

import { useSetCurrentPage } from "../utils/hooks";
import { PodcastData, SponsorCategory, SponsorData } from "../utils/types";

import PopularPodcasts from "../components/home/PopularPodcasts";
import ShopCategories from "../components/home/ShopCategories";
import SponsorsAZ from "../components/home/SponsorsAZ";
import TrendingOffers from "../components/home/TrendingOffers";
import Header from "../components/layout/Header";
import { NavContext } from "../context/navContext";
import { currentYear } from "../utils/functions";

interface Props {
  topPicksData: PodcastData[];
  sponsorsData: SponsorData[];
  categoryData: SponsorCategory[];
  trendingOffersData: SponsorData[];
}

const Home = ({
  categoryData,
  sponsorsData,
  trendingOffersData,
  topPicksData,
}: Props) => {
  useSetCurrentPage({
    home: true,
    podcasts: false,
    search: false,
    offers: false,
  });

  const { ninjaMode, setNinjaMode, categoryIndex, setCategoryIndex } =
    NavContext();

  return (
    <div className="base:mb-[60px] xs:mb-[70px] lg:mb-0">
      <Sidebar />
      {
        <div className="lg:ml-[240px]">
          <div
            className={`w-full flex flex-col bg-gradient-to-b  ${
              ninjaMode
                ? "from-[#0e0e0e] via-[#0e0e0e] to-[black]"
                : "from-[#121212] via-[#151515] to-[#121212] "
            } relative overflow-x-hidden z-1 mt-10`}
          >
            {ninjaMode || (
              <div
                className={` from-[#313131] bg-gradient-to-b  absolute top-10   w-full h-[500px] z-0 `}
              ></div>
            )}
            <Header page="Home" />
            <div className="w-full flex flex-col items-start justify-center z-10">
              <div className="w-full mt-20 mb-6 gap-2 flex flex-col items-center justify-center relative ">
                <Image
                  src={LogoText}
                  alt="logo-text"
                  width={225}
                  loading="eager"
                  className="w-[180px] xs:w-[200px] lg:w-[225px]"
                  placeholder="empty"
                />
                <Image
                  src={Logo}
                  width={120}
                  alt="logo"
                  loading="eager"
                  className="mx-2 w-[80px] xs:w-[100px] lg:w-[120px]"
                />
              </div>
              <div className="w-full flex items-center justify-center">
                <div className="flex w-full sm:w-[60%] md:w-[50%] items-center justify-center px-6 pb-10 lg:pb-14">
                  <p className="text-center  font-light text-sm xs:text-base sm:text-lg lg:text-xl text-[#909090] tracking-widest italic">
                    &ldquo;<span className="font-bold">Save money</span> and{" "}
                    <span className="font-semibold">give back</span> to your
                    favorite creators when you shop with PromoNinja verified
                    sponsors&rdquo;
                  </p>
                </div>
              </div>
              <PopularPodcasts
                ninjaMode={ninjaMode}
                topPicksData={topPicksData}
              />
              <TrendingOffers
                ninjaMode={ninjaMode}
                trendingOffersData={trendingOffersData}
              />
              <ShopCategories
                categoryData={categoryData}
                categoryIndex={categoryIndex}
                setCategoryIndex={setCategoryIndex}
                setNinjaMode={setNinjaMode}
              />
              <SponsorsAZ sponsorsData={sponsorsData} />
            </div>
            <p className="flex font-bold text-[#aaaaaa] text-xs w-full items-center justify-center  pb-6 lg:px-4">
              {`© PromoNinja ${currentYear}`}
            </p>
          </div>
        </div>
      }
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const popularPodcasts = [
    "Huberman Lab",
    "Bad Friends",
    "Almost Adulting with Violet Benson",
    "Lex Fridman Podcast",
    "Duncan Trussell Family Hour",
    "Pardon My Take",
    "This Past Weekend",
    "Science Vs",
    "The Always Sunny Podcast",
    "Normal Gossip",
    "KILL TONY",
    "Murder, Mystery & Makeup",
    "On Purpose with Jay Shetty",
    "Last Podcast On The Left",
    "SmartLess",
  ];
  let { data: topPicksData } = await client.query({
    query: Operations.Queries.GetTopPicks,
    variables: {
      input: {
        podcastTitles: popularPodcasts,
      },
    },
  });

  const trendingOffers = [
    "Athletic Greens",
    "Tushy",
    "Helix Mattress",
    "SquareSpace",
    "ExpressVPN",
  ];

  let { data: trendingOffersData } = await client.query({
    query: Operations.Queries.GetTrendingOffers,
    variables: {
      input: {
        sponsors: trendingOffers,
      },
    },
  });

  let { data: sponsorsData } = await client.query({
    query: Operations.Queries.GetSponsors,
    variables: {
      input: {
        offset: 0,
        pageSize: 100,
        offerPage: false,
      },
    },
  });

  let { data: categoryData } = await client.query({
    query: Operations.Queries.GetSponsorCategories,
  });

  sponsorsData = sponsorsData?.getSponsors;
  categoryData = categoryData?.getSponsorCategories;
  topPicksData = topPicksData?.getTopPicks;
  trendingOffersData = trendingOffersData?.getTrendingOffers;
  const oneWeek = 604800;
  return {
    props: {
      sponsorsData,
      categoryData,
      topPicksData,
      trendingOffersData,
    },
    revalidate: oneWeek,
  };
};
