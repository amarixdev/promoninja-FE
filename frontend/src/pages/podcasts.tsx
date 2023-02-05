import { Card, CardBody, SimpleGrid } from "@chakra-ui/react";
import React from "react";

type Props = {};

const podcasts = (props: Props) => {

  
  
  return (
    <div className="w-full h-screen">
      <div className="w-full h-200px flex justify-center">
        <h1 className="font-bold text-5xl p-5">Podcasts</h1>
      </div>
      <div className="grid grid-cols-4 p-8">
        <div className="bg-red-200 w-[200px] h-[200px] rounded-3xl"></div>
      </div>
    </div>
  );
};

export default podcasts;
