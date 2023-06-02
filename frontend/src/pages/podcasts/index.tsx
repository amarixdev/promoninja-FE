import { GetStaticProps } from "next";
import Image from "next/image";
import CategoryList from "../../components/CategoryList";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { NavContext } from "../../context/navContext";
import client from "../../graphql/apollo-client";
import { Operations } from "../../graphql/operations";
import LogoText from "../../public/assets/logo-text.png";
import { currentYear } from "../../utils/functions";
import { useMediaQuery, useSetCurrentPage } from "../../utils/hooks";
import { CategoryPodcast } from "../../utils/types";


interface Props {
  categoryPreviews: CategoryPodcast[];
}

const Podcasts = ({ categoryPreviews }: Props) => {
  const isBreakPoint = useMediaQuery(1023);
  const { ninjaMode } = NavContext();
  useSetCurrentPage({
    home: false,
    podcasts: true,
    search: false,
    offers: false,
  });
  return (
    <>
      <div className="flex base:mb-[60px] xs:mb-[70px] lg:mb-0">
        <Sidebar />
        <div
          className={`w-full bg-gradient-to-b ${
            ninjaMode
              ? "from-[#0e0e0e] via-[#0e0e0e] to-[black]"
              : "from-[#1e1e1e] via-[#1a1a1a] to-[#151515]"
          }  relative overflow-x-hidden z-1 mt-10`}
        >
          {ninjaMode ? (
            <div
              className={` from-[#1b1b1b] bg-gradient-to-b  absolute w-full h-[200px] z-0 `}
            ></div>
          ) : (
            <div
              className={` from-[#373737] bg-gradient-to-b  absolute w-full h-[200px] z-0 `}
            ></div>
          )}
          <Header page="Podcasts" />
          {/* Mobile */}
          {
            <div className=" w-full top-16 lg:top-20 py-6 relative justify-center flex">
              <div className="flex w-full justify-center items-center max-w-[120px] lg:min-w-[200px]">
                <Image src={LogoText} alt="logo" width={200} height={200} />
              </div>
            </div>
          }
          {isBreakPoint ? (
            <div className={`w-full relative mt-14 flex flex-col pb-20`}>
              {categoryPreviews.map((category: CategoryPodcast) => (
                <CategoryList
                  key={Object.keys(category)[0]}
                  category={category}
                  ninjaMode={ninjaMode}
                />
              ))}
            </div>
          ) : (
            <div className={`w-full relative mt-14 flex flex-col pb-20`}>
              {categoryPreviews.map((category: CategoryPodcast) => (
                <CategoryList
                  key={Object.keys(category)[0]}
                  category={category}
                  ninjaMode={ninjaMode}
                />
              ))}
            </div>
          )}
          <p className="flex font-bold text-[#9f9f9f] text-xs w-full items-center justify-center  pb-6 lg:px-4">
          {`© PromoNinja ${currentYear}`}
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data: podcastCategories } = await client.query({
    query: Operations.Queries.GetPodcastCategories,
  });

  const categoryTitles = podcastCategories?.getPodcastCategories.map(
    (category: any) => category.name
  );
  const categoryPromises = categoryTitles.map(async (category: string) => {
    const { data } = await client.query({
      query: Operations.Queries.FetchCategoryPodcasts,
      variables: {
        input: {
          category,
        },
      },
    });
    return { [category]: data };
  });

  const categoriesData = await Promise.all(categoryPromises);

  const categoryPreviews = categoriesData.map((category) => {
    const key = Object.keys(category)[0];
    const value = category[key].fetchCategoryPodcasts;
    return { [key]: value };
  });

  return {
    props: {
      categoryPreviews,
    },
  };
};

export default Podcasts;
