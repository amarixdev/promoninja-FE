import Link from "next/link";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { NavContext } from "../context/navContext";
import { capitalizeString } from "../utils/functions";
import { useMediaQuery } from "../utils/hooks";

interface Props {
  category?: string;
  previousPageText?: string;
}

const PreviousPage = ({ previousPageText }: Props) => {
  const { previousPage, categoryType } = NavContext();
  const isBreakPoint = useMediaQuery(1023);
  return (
    <div
      className={` ${
        isBreakPoint
          ? " absolute left-2 top-2 z-20"
          : " absolute left-[240px] top-[100px] z-20"
      }`}
    >
      <Link
        href={
          previousPage === "podcasts"
            ? "/podcasts"
            : `/podcasts/${categoryType}`
        }
        className="flex items-center"
      >
        <MdOutlineArrowBackIos size={15} />
        <p
          className={`${
            isBreakPoint ? " text-sm" : "text-md ml-2"
          }   text-[#ffffffea] font-semibold ml-1`}
        >
          {previousPage === "category"
            ? capitalizeString(categoryType)
            : previousPageText
            ? "Podcasts"
            : "Podcasts"}
        </p>
      </Link>
    </div>
  );
};

export default PreviousPage;
