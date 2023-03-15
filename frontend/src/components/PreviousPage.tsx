import Link from "next/link";
import React from "react";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { capitalizeString } from "../utils/functions";

interface Props {
  category: string;
}

const PreviousPage = ({ category }: Props) => {
  return (
    <div className="absolute left-2 top-2">
      <Link href={`/podcasts/${category}`} className="flex items-center ">
        <MdOutlineArrowBackIos size={15} />
        <p className="text-sm text-white/70 font-semibold">
          {capitalizeString(category)}
        </p>
      </Link>
    </div>
  );
};

export default PreviousPage;
