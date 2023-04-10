import React from "react";
import Footer from "../../components/Footer";
import client from "../../graphql/apollo-client";
import { Operations } from "../../graphql/operations";
import { SponsorCategory } from "../../utils/types";

type Props = {
  categoryData: SponsorCategory;
};

const SponsorCategory = ({ categoryData }: Props) => {
  console.log(categoryData);
  return (
    <div>
      <h1>{categoryData?.name}</h1>
      <Footer />
    </div>
  );
};

export default SponsorCategory;

export const getStaticPaths = async () => {
  const paths = [{ params: { sponsorCategory: "" } }];
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }: any) => {
  const { sponsorCategory: category } = params;
  console.log(params);

  const { data, error } = await client.query({
    query: Operations.Queries.GetSponsorCategory,
    variables: {
      input: category,
    },
  });

  const categoryData = data?.getSponsorCategory;

  return {
    props: {
      categoryData,
    },
  };
};
