import { GetStaticProps } from "next";
import CategoryList from "../../components/CategoryList";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import client from "../../graphql/apollo-client";
import { Operations } from "../../graphql/operations";
import {
  useMediaQuery, useSetCurrentPage,
} from "../../utils/hooks";
import { CategoryPodcast } from "../../utils/types";

interface Props {
  categoryPreviews: CategoryPodcast[];
}

const podcasts = ({ categoryPreviews }: Props) => {
  const isBreakPoint = useMediaQuery(1023);

  useSetCurrentPage({ home: false, podcasts: true, search: false });
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="w-full h-screen bg-gradient-to-t from-[#151515] via-[#151515] to-[#282727] relative overflow-x-hidden z-1 mt-10">
          <div className="flex items-center justify-between w-full relative">
            <h1
              className={`text-3xl sm:text-5xl p-8 fixed font-bold z-10 text-white bg-[#121212] w-full `}
            >
              Podcasts
            </h1>
          </div>
          <div
            className={`w-full ${
              isBreakPoint && "h-[200px]"
            } relative mt-20 flex flex-col`}
          >
            {categoryPreviews.map((category: CategoryPodcast) => (
              <CategoryList
                key={Object.keys(category)[0]}
                category={category}
              />
            ))}
            <div className="w-full mt-6 text-[#121212] relative">margin</div>
          </div>
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
