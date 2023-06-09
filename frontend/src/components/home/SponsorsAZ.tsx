import Image from "next/image";
import Link from "next/link";
import { convertToSlug } from "../../utils/functions";
import { SponsorData } from "../../utils/types";
import { useMediaQuery } from "../../utils/hooks";
import fallbackImage from "../../public/assets/fallback.png";
import { useEffect } from "react";

interface SponsorsAZProps {
  sponsorsData: SponsorData[];
}

const SponsorsAZ = ({ sponsorsData }: SponsorsAZProps) => {
  const isBreakPoint = useMediaQuery(1023);
  type GroupedSponsors = { [key: string]: string[] };
  const sortedSponsors = sponsorsData?.map((sponsor) => sponsor.name).sort();
  const groupedSponsors: GroupedSponsors = {};

  sortedSponsors.forEach((str) => {
    const firstLetter = str.charAt(0).toUpperCase();
    if (!groupedSponsors[firstLetter]) {
      groupedSponsors[firstLetter] = [];
    } else {
    }
    groupedSponsors[firstLetter].push(str);
  });

  return (
    <div className="relative">
      <div className="w-full flex items-center lg:mt-14 justify-start">
        <h1 className={`text-base lg:text-2xl font-bold p-4 text-[#cdcdcd]`}>
          Sponsors A-Z
        </h1>
      </div>
      <div className="w-full mb-14 flex flex-col items-center">
        {Object.keys(groupedSponsors).map((letter) => (
          <div className="w-full p-4 my-4" key={letter}>
            <p className="text-[#909090] text-3xl font-bold">{letter}</p>
            <div className="w-full flex flex-wrap p-1 gap-y-16 gap-x-2 items-center base:justify-center lg:justify-start">
              {groupedSponsors[letter].map((sponsor) =>
                sponsorsData
                  .filter((data) => data.name === sponsor)
                  .map((sponsor) => (
                    <div key={sponsor.name} className="flex flex-col">
                      <div className="flex flex-col w-[100px] mx-5 active:scale-95 transition-all duration-300 ease-in-out ">
                        <Link href={`/${convertToSlug(sponsor.name)}`}>
                          {isBreakPoint || (
                            <div className="hover:bg-[#ffffff0e] h-[100px] w-[100px] rounded-lg absolute transition ease-in-out duration-300"></div>
                          )}
                          <Image
                            src={sponsor.imageUrl || fallbackImage}
                            alt={sponsor.name}
                            width={100}
                            height={100}
                            className="rounded-lg min-w-[100px] min-h-[100px]"
                            loading="eager"
                          />
                        </Link>

                        <div className="min-w-[100px] bg-red-500">
                          <h1 className="w-full text-white font-semibold absolute text-xs lg:text-sm mt-2 text-center max-w-[100px]">
                            {sponsor.name}
                          </h1>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SponsorsAZ;
