import React, { Dispatch, RefObject, SetStateAction } from "react";
import { useCopyToClipboard, useMediaQuery } from "../../utils/hooks";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@chakra-ui/react";
import { BsShareFill } from "react-icons/bs";
import { SponsorData } from "../../utils/types";
import fallbackImage from "../../public/assets/fallback.png";
import Logo from "../../public/assets/logo.png";

interface SponsorHeroProps {
  sponsorData: SponsorData;
  setCategoryIndex: Dispatch<SetStateAction<number>>;
  categoryIndex: number;
  bannerBreakpointRef: RefObject<HTMLDivElement>;
  ninjaMode: boolean;
}

const SponsorHero = ({
  sponsorData,
  setCategoryIndex,
  categoryIndex,
  ninjaMode,
  bannerBreakpointRef,
}: SponsorHeroProps) => {
  const isBreakPoint = useMediaQuery(1023);
  const { handleCopy } = useCopyToClipboard();
  const copyToClipboard = () => {
    handleCopy(window.location.href);
  };

  return (
    <>
      {/* Mobile */}
      {isBreakPoint ? (
        <section>
          <div className="flex-col w-full items-center justify-center py-2">
            <header>
              <div className="p-10  flex items-center justify-center relative ">
                <Image
                  src={sponsorData?.imageUrl || fallbackImage}
                  width={150}
                  height={150}
                  priority
                  alt={sponsorData?.name}
                  className="shadow-xl rounded-lg shadow-black z-10 relative base:w-[150px] xs:w-[180px] sm:w-[220px] base:h-[150px] xs:h-[180px] sm:h-[220px]"
                />
              </div>
              <div className="flex w-full items-center justify-center flex-col">
                <h1 className="text-[#e6e6e6] text-center relative z-10 base:text-3xl xs:text-4xl sm:text-5xl font-bold lg:font-extrabold px-2">
                  {sponsorData?.name}
                </h1>
                <h3 className="base:text-md font-medium xs:text-lg mb-4 text-[#aaaaaa] p-2">
                  {sponsorData?.url}
                </h3>
              </div>
            </header>
            <section>
              <p className="font-thin text-lg px-8 py-6 relative bottom-4 text-start tracking-wider">
                {sponsorData?.summary}
              </p>
              <div className="w-full flex items-center justify-start gap-2 px-4">
                <Link href={"/offers"} className="">
                  <Button
                    className="active:scale-95 font-semibold "
                    onClick={() => setCategoryIndex(categoryIndex)}
                  >
                    <p className="text-xs xs:text-sm">
                      {sponsorData.sponsorCategory[0].name}
                    </p>
                  </Button>
                </Link>
                <Button
                  className="active:scale-95 font-semibold "
                  onClick={() => copyToClipboard()}
                  minW={"fit-content"}
                >
                  <div className="flex items-center gap-2">
                    <BsShareFill size={12} />
                    <p className="text-xs xs:text-sm">Share</p>
                  </div>
                </Button>
              </div>
            </section>

            <div className="w-[100%] pb-4 border-b-[1px] mb-10"></div>
          </div>
          <section
            className={`w-full bg-gradient-to-b rounded-lg ${
              ninjaMode
                ? "from-[#31313172]  to-[#20202091]"
                : "from-[#2020201d]  to-[#20202091]"
            } p-10`}
          >
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-[#0ec10e] w-2 h-2"></div>
                <h2 className="text-xl font-semibold"> Exclusive Offer:</h2>
              </div>
              <div ref={bannerBreakpointRef} className="px-4 py-2">
                <p className={`font-thin text-lg`}>{sponsorData?.offer}</p>
              </div>
            </div>
          </section>
        </section>
      ) : (
        /* Desktop */
        <section
          className="flex-col w-full items-center mt-14 justify-center z-10 relative"
          id={"banner"}
        >
          <header className="p-10 flex items-center w-full">
            <Image
              src={sponsorData?.imageUrl || fallbackImage}
              width={230}
              height={230}
              priority
              alt={sponsorData?.name}
              className="shadow-xl shadow-black relative rounded-md w-[230px] h-[230px]"
            />
            <div className="flex flex-col items-start mx-4 p-6 ">
              <h2 className="font-bold text-sm relative top-4">Sponsor</h2>
              <h1 className="font-extrabold text-[#dddddd] text-7xl mt-6">
                {sponsorData?.name}
              </h1>
              <h3 className="text-[#aaaaaa] text-2xl mt-4 font-bold">
                {sponsorData?.url}
              </h3>
            </div>
          </header>
          <section>
            <div className="px-6 ">
              <div className="px-4 flex items-center gap-4">
                <Link href={"/offers"}>
                  <Button
                    className="active:scale-95"
                    onClick={() => setCategoryIndex(categoryIndex)}
                  >
                    <p>{sponsorData.sponsorCategory[0].name}</p>
                  </Button>
                </Link>
                <Button
                  className="active:scale-95"
                  onClick={() => copyToClipboard()}
                >
                  <BsShareFill />
                  <p className="ml-3">Share</p>
                </Button>
              </div>
              <div className="flex m-4 mt-8">
                <div
                  className={`w-full bg-gradient-to-b rounded-lg ${
                    ninjaMode
                      ? "from-[#31313172]  to-[#20202091]"
                      : "from-[#2020201d]  to-[#20202091]"
                  } p-10`}
                  ref={bannerBreakpointRef}
                >
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-[#0ec10e] w-2 h-2"></div>
                      <h2 className="text-xl font-bold"> Exclusive Offer:</h2>
                    </div>
                    <div className="px-4 py-2">
                      <p className={` font-normal text-xl text-[#aaaaaa]`}>
                        {sponsorData?.offer}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-col px-10">
                  <div className="pl-10">
                    <div className=" flex justify-start">
                      <h2 className="font-bold text-2xl">About</h2>
                    </div>
                    <p className=" font-medium text-[#aaaaaa] pr-16 mt-6">
                      {sponsorData?.summary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center px-6 pt-4">
              <Image
                src={Logo}
                alt="logo"
                width={140}
                height={140}
                className="relative"
              />
              <div className="flex">
                <div className="w-[75%] flex items-center justify-center relative ">
                  <p className=" font-light text-xl text-start text-[#909090] p-6 lg:p-2 tracking-wider italic">
                    &ldquo;Empower your favorite podcaster by making your
                    purchases through their sponsor link.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </section>
        </section>
      )}
    </>
  );
};

export default SponsorHero;
