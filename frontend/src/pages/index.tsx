import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Layout from "../components/Layout";
import { Operations } from "../graphql/operations";
import { useEffect, useState } from "react";

// const CLIENT_ID = process.env.CLIENT_ID;

const Home: NextPage = () => {

  return (
    <>
      <Layout/>
    </>
  );
};

export default Home;
