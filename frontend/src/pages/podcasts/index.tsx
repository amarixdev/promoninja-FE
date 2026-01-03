import { GetStaticProps } from "next";
import Image from "next/image";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import CategoryList from "../../components/podcasts-sponsors/PodcastCategories";
import { NavContext } from "../../context/navContext";
import client from "../../graphql/apollo-client";
import { Operations } from "../../graphql/operations";
import LogoText from "../../public/assets/logo-text.png";
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
    <div className="flex base:mb-[60px] xs:mb-[70px] lg:mb-0">
      <Sidebar />
      <div
        className={`w-full bg-gradient-to-b lg:ml-[240px] ${
          ninjaMode
            ? "from-[#101010] via-[#0e0e0e]"
            : "from-[#1e1e1e] via-[#1a1a1a]"
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

        <header className=" w-full top-16 lg:top-20 py-6 relative justify-center flex">
          <div className="flex w-full justify-center items-center max-w-[120px] lg:min-w-[200px]">
            <Image
              priority
              src={LogoText}
              alt="logo"
              width={200}
              height={200}
            />
          </div>
        </header>

        {isBreakPoint ? (
          <main className={`w-full relative mt-14 flex flex-col pb-20`}>
            {categoryPreviews.map((category: CategoryPodcast) => (
              <CategoryList
                key={Object.keys(category)[0]}
                category={category}
                ninjaMode={ninjaMode}
              />
            ))}
          </main>
        ) : (
          <main className={`w-full relative mt-14 flex flex-col pb-20`}>
            {categoryPreviews.map((category: CategoryPodcast) => (
              <CategoryList
                key={Object.keys(category)[0]}
                category={category}
                ninjaMode={ninjaMode}
              />
            ))}
          </main>
        )}

        <Footer />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const { data: podcastCategories } = await client.query({
      query: Operations.Queries.GetPodcastCategories,
    });

    const categories = podcastCategories?.getPodcastCategories;
    
    if (!categories || categories.length === 0) {
      return {
        props: {
          categoryPreviews: [],
        },
        revalidate: 60,
      };
    }

    const categoryTitles = categories.map((category: any) => category.name);
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
    const oneWeek = 604800;
    return {
      props: {
        categoryPreviews,
      },
      revalidate: oneWeek,
    };
  } catch (error) {
    console.error("Error fetching podcasts page data:", error);
    return {
      props: {
        categoryPreviews: [],
      },
      revalidate: 60,
    };
  }
};

export default Podcasts;
