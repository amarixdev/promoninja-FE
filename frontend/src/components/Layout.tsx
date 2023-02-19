import React, { createContext, useContext, useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import dotenv from "dotenv";
import gql from "graphql-tag";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Button } from "@chakra-ui/react";
import APIContext from "../context/context";
import Image from "next/image";
import Link from "next/link";
("../context/context");

type Props = {};

interface Item {
  name: string;
}

const Layout = (props: Props) => {
  return (
    <>
      <Header />
      <Hero />
    </>
  );
};

export default Layout;
