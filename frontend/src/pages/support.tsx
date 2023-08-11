import React from "react";
import Sidebar from "../components/layout/Sidebar";
import { NavContext } from "../context/navContext";
import LogoAlt from "../public/assets/alt-ninja.png";
import Footer from "../components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery, useSetCurrentPage } from "../utils/hooks";
import BackButton from "../components/misc/BackButton";
import { currentYear } from "../utils/functions";
import { BsSpotify } from "react-icons/bs";
import { Button } from "@chakra-ui/react";

type Props = {};

const About = (props: Props) => {
  const isBreakPoint = useMediaQuery(1023);
  const { ninjaMode } = NavContext();
  useSetCurrentPage({
    home: false,
    podcasts: false,
    search: false,
    offers: false,
  });

  return (
    <div className="flex base:mb-[60px] xs:mb-[70px] lg:mb-0">
      <Sidebar />
      <div className="lg:ml-[240px]">
        <div
          className={`w-full  flex flex-col py-10 bg-gradient-to-b justify-center items-center ${
            ninjaMode
              ? "from-[#131313] via-[#0e0e0e] to-[black]"
              : "from-[#252525] via-[#1a1a1a] to-[#121212] "
          } relative overflow-x-hidden z-1`}
        >
          <div className="w-full absolute top-0">
            <BackButton />
          </div>

          <div
            className={` ${
              ninjaMode
                ? "bg-gradient-to-b from-[#212121] to-[#111111]  "
                : "bg-gradient-to-b from-[#2a2a2a] to-[#181818]"
            } flex flex-col items-center lg:text-left justify-center mt-10 rounded-lg  py-8 px-4 max-w-[95%] lg:max-w-[70%]`}
          >
            <header
              className={`w-full px-8 text-center lg:text-left flex ${
                isBreakPoint ? "justify-center" : "justify-start"
              } items-center`}
            >
              <h1 className="font-extrabold text-3xl lg:text-5xl ">Support</h1>
            </header>
            <main className="w-full px-8 pt-8 text-center lg:text-left">
              <p className="pt-2 text-[#cbcbcb] text-base lg:text-lg">
                PromoNinja is a passion project that was designed, developed,
                and is maintained independently. If you find value in the site
                and want to support my mission in growing the platform, you can
                help out by clicking the link below. Thank you for reading and
                enjoy the service!
              </p>
              <Link
                href={"https://www.buymeacoffee.com/promoninja"}
                target="_blank"
              >
                <Button className="mt-4">Buy me a coffee</Button>
              </Link>
            </main>
          </div>
          {isBreakPoint ? (
            <Image
              placeholder="blur"
              src={LogoAlt}
              alt="alt-logo"
              width={240}
              height={240}
              className="mt-10"
            />
          ) : (
            <Image
              placeholder="blur"
              src={LogoAlt}
              alt="alt-logo"
              width={300}
              height={300}
              className="mt-10"
            />
          )}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default About;
