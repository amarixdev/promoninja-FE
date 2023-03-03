import { useMutation, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <Hero />
    </>
  );
};

export default Home;
