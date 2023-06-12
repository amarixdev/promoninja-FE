import React from "react";
import { SponsorData } from "../../utils/types";
import { useLazyQuery } from "@apollo/client";
import { Operations } from "../../graphql/operations";
import { Button, Spinner } from "@chakra-ui/react";

interface LoadMoreProps {
  filteredSponsors: SponsorData[];
  currentCategory: string;
  getCategorySponsors: any;
  setFilteredSponsors: (value: SponsorData[]) => void;
  sponsorsCount: number;
  categoryCount: number;
}

const LoadMore = ({
  filteredSponsors,
  currentCategory,
  setFilteredSponsors,
  getCategorySponsors,
  sponsorsCount,
  categoryCount,
}: LoadMoreProps) => {
  const [loadMoreSponsors, { loading: sponsorsLoading }] = useLazyQuery(
    Operations.Queries.GetSponsors
  );

  const handlePagination = async () => {
    const offset = filteredSponsors.length;

    if (currentCategory === "All Offers") {
      const { data } = await loadMoreSponsors({
        variables: {
          input: {
            offerPage: true,
            offset,
            pageSize: 15,
          },
        },
      });
      if (data) {
        setFilteredSponsors([...filteredSponsors, ...data.getSponsors]);
      }
    } else {
      const { data } = await getCategorySponsors({
        variables: {
          input: {
            category: currentCategory,
            offset,
            pageSize: 15,
          },
        },
      });

      if (data) {
        setFilteredSponsors([...filteredSponsors, ...data.getCategorySponsors]);
      }
    }
  };

  console.log(currentCategory);
  console.log(sponsorsCount);

  return (
    <div>
      <>
        {(filteredSponsors.length &&
          currentCategory === "All Offers" &&
          filteredSponsors.length < sponsorsCount) ||
        (currentCategory !== "All Offers" &&
          filteredSponsors.length < categoryCount) ? (
          <div className="w-full flex items-center justify-center px-10 py-10 pb-28 active:scale-[0.95]">
            {sponsorsLoading ? (
              <Button minW={"full"} py={6}>
                <Spinner />
              </Button>
            ) : (
              <Button onClick={() => handlePagination()} minW={"full"} py={6}>
                <div className="flex gap-4">
                  <p className="font-bold text-[#d3d3d3] text-base xs:text-lg lg:text-xl">
                    Load More
                  </p>
                </div>
              </Button>
            )}
          </div>
        ) : null}
      </>
    </div>
  );
};

export default LoadMore;
