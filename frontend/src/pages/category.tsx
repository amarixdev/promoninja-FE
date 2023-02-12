import Image from "next/image";
import React from "react";
import * as Hero from "../public/assets/comedy.png";

type Props = {};

const category = (props: Props) => {
  const podcasts = [1, 2, 3, 4, 5, 6];
  return (
    <div className="w-full h-screen bg-[#121212]">
      <Image
        src={Hero}
        alt="comedy"
        className="fixed z-0 w-full lg:top-[-100px] xl:top-[-150px]"
      />
      <h1 className="text-5xl font-bold text-white absolute z-2 top-[8rem]">
        Comedy
      </h1>
      <div className="bg-[#121212] w-full h-screen relative top-[30%] sm:top-[35%] md:top-[40%] lg:top-[45%] xl:top-[50%] grid-cols-2 sm:grid-cols-3 grid gap-10 p-5 ">
        {podcasts.map((pod) => (
          <div className="bg-[#1e1e1e] rounded-3xl h-[260px]">{pod}</div>
        ))}
      </div>
      <div className="w-full bg-green-200 fixed z-100 h-[200px]">Test</div>
    </div>
  );
};

export default category;
