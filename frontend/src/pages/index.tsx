import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

const Home: NextPage = () => {
  const QUERY = gql`
    mutation {
      createCategory
    }
  `;
  const [addProduct, { data, loading, error }] = useMutation(QUERY);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>ERROR</div>;

  //   if (data) {
  //    console.log(data?.createCategory)
  //  }

  return (
    <>
      <div>
        <button onClick={() => addProduct()}></button>
      </div>
    </>
  );
};

export default Home;
