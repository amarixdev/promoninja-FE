import { GetStaticProps } from "next";
import CategoryList from "../../components/CategoryList";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import client from "../../graphql/apollo-client";
import { Operations } from "../../graphql/operations";
import { useMediaQuery, useSetCurrentPage } from "../../utils/hooks";
import { CategoryPodcast } from "../../utils/types";

interface Props {
  categoryPreviews: CategoryPodcast[];
}

const podcasts = ({ categoryPreviews }: Props) => {
  const isBreakPoint = useMediaQuery(1023);
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
        <div className="w-full bg-gradient-to-b from-[#1e1e1e] via-[#1a1a1a] to-[#1f1f1f] relative overflow-x-hidden z-1 mt-10">
          <div className="absolute top-0 from-[#5757577d] bg-gradient-to-b to-[#1e1e1e] w-full h-[200px] z-0"></div>

          <div className="flex items-center justify-between w-full relative">
            <h1
              className={`text-3xl sm:text-5xl p-8 fixed font-bold z-10 text-white bg-[#121212] w-full `}
            >
              Podcasts
            </h1>
          </div>
          {isBreakPoint ? (
            <div
              className={`w-full relative mt-14 flex flex-col pb-20`}
            >
              {categoryPreviews.map((category: CategoryPodcast) => (
                <CategoryList
                  key={Object.keys(category)[0]}
                  category={category}
                />
              ))}
            </div>
          ) : (
            <div
              className={`w-full relative mt-14 flex flex-col pb-20`}
            >
              {categoryPreviews.map((category: CategoryPodcast) => (
                <CategoryList
                  key={Object.keys(category)[0]}
                  category={category}
                />
              ))}
            </div>
          )}
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

export default podcasts;
