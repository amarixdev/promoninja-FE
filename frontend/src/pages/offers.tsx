import { useLazyQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import style from "../../styles/style.module.css";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { NavContext } from "../context/navContext";
import client from "../graphql/apollo-client";
import { Operations } from "../graphql/operations";
import { currentYear } from "../utils/functions";
import { useSetCurrentPage } from "../utils/hooks";
import { SponsorCategory, SponsorData } from "../utils/types";
import Slider from "../components/offers-page/Slider";
import Main from "../components/offers-page/Main";
import Banner from "../components/offers-page/Banner";

interface OffersProps {
  sponsorsData: SponsorData[];
  sponsorCategoryData: SponsorCategory[];
}

const Offers = ({ sponsorsData, sponsorCategoryData }: OffersProps) => {
  const { categoryIndex: contextIndex, ninjaMode } = NavContext();
  const bannerBreakpointRef = useRef<HTMLDivElement>(null);

  useSetCurrentPage({
    home: false,
    podcasts: false,
    search: false,
    offers: true,
  });
  const [rendering, setRendering] = useState(false);
  const [isScrolledToTop, setIsScrolledToTop] = useState(true);
  const [pageTitle, setPageTitle] = useState("Offers");
  const [filteredSponsors, setFilteredSponsors] = useState<SponsorData[]>([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [bannerCategory, setBannerCategory] = useState("");
  const [categoryIndex, setCategoryIndex] = useState(0);
  let [getCategorySponsors, { loading: categoryLoading }] = useLazyQuery(
    Operations.Queries.GetCategorySponsors
  );

  useEffect(() => {
    if (contextIndex === -1) {
      setCurrentCategory("All Offers");
      setBannerCategory("All Offers");
      setCategoryIndex(0);
      setFilteredSponsors(sponsorsData);
    } else {
      const filteredIndexes = sponsorCategoryData.filter((_, index) => {
        return index === contextIndex;
      });
      const fetchData = async () => {
        const { data: categoryData } = await getCategorySponsors({
          variables: {
            input: {
              category: filteredIndexes[0].name,
            },
          },
        });

        if (categoryData) {
          setCurrentCategory(filteredIndexes[0].name);
          setBannerCategory(filteredIndexes[0].name);
          setCategoryIndex(contextIndex + 1);
          setFilteredSponsors(categoryData.getCategorySponsors);
        }
      };

      fetchData();
    }
  }, [contextIndex, getCategorySponsors, sponsorCategoryData, sponsorsData]);

  return (
    <div className="flex base:mb-[60px] xs:mb-[70px] lg:mb-0">
      {categoryLoading && (
        <div className="h-screen fixed w-full flex top-0 z-[9999]">
          <div className={`${style.loader}`} />
        </div>
      )}

      <Sidebar />
      <Banner
        bannerBreakpointRef={bannerBreakpointRef}
        bannerCategory={bannerCategory}
        isScrolledToTop={isScrolledToTop}
        setIsScrolledToTop={setIsScrolledToTop}
      />

      <div
        className={`w-full relative z-0 mt-12 bg-gradient-to-b   ${
          ninjaMode
            ? "from-[#0e0e0e] via-[#0e0e0e] to-[black]"
            : "from-[#151515] via-[#151515] to-[#121212]"
        }`}
      >
        <div
          className={`absolute top-10 w-full z-0  ${
            ninjaMode
              ? "from-[#222222] bg-gradient-to-b h-[400px]"
              : "from-[#484848] bg-gradient-to-b h-[500px]"
          }`}
        ></div>

        <Header page={pageTitle} />
        <Slider
          getCategorySponsors={getCategorySponsors}
          categoryIndex={categoryIndex}
          contextIndex={contextIndex}
          isScrolledToTop={isScrolledToTop}
          setBannerCategory={setBannerCategory}
          setCategoryIndex={setCategoryIndex}
          setCurrentCategory={setCurrentCategory}
          setFilteredSponsors={setFilteredSponsors}
          setPageTitle={setPageTitle}
          setRendering={setRendering}
          sponsorCategoryData={sponsorCategoryData}
          sponsorsData={sponsorsData}
        />
        <Main
          ninjaMode={ninjaMode}
          bannerBreakpointRef={bannerBreakpointRef}
          currentCategory={currentCategory}
          filteredSponsors={filteredSponsors}
          rendering={rendering}
        />
        {!rendering && (
          <p className="flex font-bold text-[#aaaaaa] text-xs w-full items-center justify-center  pt-4 pb-6 lg:px-4">
            {`© PromoNinja ${currentYear}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default Offers;

export const getStaticProps = async () => {
  let { data: sponsorsData } = await client.query({
    query: Operations.Queries.GetSponsors,
    variables: {
      input: {
        offerPage: true,
      },
    },
  });

  let { data: sponsorCategoryData } = await client.query({
    query: Operations.Queries.GetSponsorCategories,
  });

  sponsorCategoryData = sponsorCategoryData?.getSponsorCategories;
  sponsorsData = sponsorsData.getSponsors;
  const oneWeek = 604800;

  return {
    props: { sponsorsData, sponsorCategoryData },
    revalidate: oneWeek,
  };
};
