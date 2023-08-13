import React from "react";
import Sidebar from "../components/layout/Sidebar";
import { NavContext } from "../context/navContext";
import Logo3 from "../public/assets/alt-ninja2.png";
import Image from "next/image";
import Link from "next/link";
import BackButton from "../components/misc/BackButton";
import { useMediaQuery, useSetCurrentPage } from "../utils/hooks";
import { GiNinjaHead } from "react-icons/gi";
import Footer from "../components/layout/Footer";

type Props = {};

const About = (props: Props) => {
  const { ninjaMode, setNinjaMode } = NavContext();
  const isBreakpoint = useMediaQuery(1023);
  useSetCurrentPage({
    home: false,
    podcasts: false,
    search: false,
    offers: false,
  });
  return (
    <div className="flex base:mb-[60px] xs:mb-[70px] lg:mb-0 ">
      <Sidebar />
      <div className="lg:ml-[240px]">
        <div
          className={`w-full flex flex-col py-10 bg-gradient-to-b justify-center items-center ${
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
            } flex flex-col items-center lg:text-left justify-center rounded-lg mt-10 py-8 px-4 max-w-[95%] lg:max-w-[70%] `}
          >
            <header className="w-full px-8 text-center lg:text-left">
              <h1 className="font-extrabold text-6xl lg:text-7xl ">About</h1>
            </header>
            <main>
              <section className="w-full px-8 pt-8 text-center lg:text-left">
                <h2 className=" text-xl lg:text-2xl font-semibold">
                  Why did I build this?
                </h2>
                <p className="pt-2 text-[#cbcbcb] text-base lg:text-lg">
                  Sponsor affiliate links are the most common way podcasts
                  generate income. I noticed several podcasts had sponsors in
                  common, so I came up with the idea to support multiple shows
                  simultaneously. As a software developer and avid podcast
                  listener, I felt happy to repay the podcasting community for
                  the countless hours of entertainment.
                </p>
              </section>
              <section className="w-full mt-12 lg:mt-16  px-8 text-center lg:text-left">
                <h2 className="font-semibold text-xl lg:text-2xl ">
                  What is PromoNinja?
                </h2>
                <div className="flex flex-col gap-8 text-[#cbcbcb] text-base lg:text-lg">
                  <p className="pt-2 ">
                    PromoNinja is a{" "}
                    <span className="font-bold">win-win-win.</span> As a podcast{" "}
                    <span className="font-bold">creator</span>, you get the
                    luxury of having all your running sponsors in one
                    centralized location. As a podcast{" "}
                    <span className="font-bold">enjoyer</span>, you get access
                    to exclusive promotions and the opportunity to discover new
                    shows. As a podcast{" "}
                    <span className="font-bold"> sponsor</span>, you get an even
                    greater reach from not only the podcasts you&apos;ve
                    sponsored, but anyone looking for a deal.
                  </p>
                  <p>
                    PromoNinja is a{" "}
                    <span className="font-bold">free service</span> for the
                    community! However, if you&apos;d like to help out, checkout
                    the{" "}
                    <Link href={"/support"}>
                      <span className="text-[#e09249] underline underline-offset-2">
                        support
                      </span>{" "}
                    </Link>
                    page.
                  </p>

                  <p>
                    PromoNinja is not affiliated with any of the podcasts on
                    this site. If you have any feedback or questions, or would
                    like to have your podcast featured on the site please reach
                    out on Twitter{" "}
                    <Link
                      href={"https://www.twitter.com/promoninjaapp"}
                      target="_blank"
                    >
                      <span className="text-[#e09249] underline underline-offset-2">
                        @PromoNinjaApp
                      </span>
                    </Link>
                  </p>
                </div>
              </section>
              <section className="w-full mt-12 lg:mt-16  px-8 text-center lg:text-left">
                <h2 className="font-semibold text-xl lg:text-2xl ">
                  Accessibility
                </h2>
                <div
                  className={`${
                    isBreakpoint ? "flex-col" : "flex-row"
                  } w-full flex justify-start items-center gap-4`}
                >
                  <p className="pt-2">
                    To enhance color contrast for improved accessibility,
                    consider utilizing Ninja Mode{" "}
                  </p>
                  <GiNinjaHead
                    size={25}
                    onClick={() => setNinjaMode((prev) => !prev)}
                    className="cursor-pointer animate-pulse hover:animate-none active:scale-95"
                  />
                </div>
              </section>
            </main>
            <Image
              placeholder="blur"
              src={Logo3}
              alt="alt-logo"
              width={300}
              height={300}
              className="mt-10"
            />
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default About;
