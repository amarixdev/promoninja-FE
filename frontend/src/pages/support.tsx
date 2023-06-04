import React from "react";
import Sidebar from "../components/Sidebar";
import { NavContext } from "../context/navContext";
import LogoAlt from "../public/assets/logo-alt2.png";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery, useSetCurrentPage } from "../utils/hooks";
import BackButton from "../components/BackButton";
import style from "../../styles/style.module.css";

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
    <>
      <div className="flex base:mb-[60px] xs:mb-[70px] lg:mb-0">
        <Sidebar />
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

          <div className="flex flex-col items-center lg:text-left justify-center border-[1px] mt-10 rounded-lg border-[#e09249] py-8 px-4 max-w-[95%] lg:max-w-[70%] ">
            <div
              className={`w-full px-8 text-center lg:text-left flex ${
                isBreakPoint ? "justify-center" : "justify-start"
              } items-center`}
            >
              <p className="font-extrabold text-3xl lg:text-5xl ">Support</p>
            </div>
            <div className="w-full px-8 pt-8 text-center lg:text-left">
              <Link
                href={"http://www.buymeacoffee.com/promoninja"}
                className=" text-xl lg:text-2xl font-semibold"
                target="_blank"
              >
                {isBreakPoint ? (
                  <h2 className="underline underline-offset-2 font-bold text-[#e09249]">
                    Buy Me A Coffee
                  </h2>
                ) : (
                  <h2 className="underline underline-offset-2 hover:text-[#e09249] transition-all duration-150 ease-in font-normal">
                    Buy Me A Coffee
                  </h2>
                )}
              </Link>
              <p className="pt-2 text-[#cbcbcb] text-base lg:text-lg">
                PromoNinja is developed, designed, and maintained independently.
                If you would like to help out, feel free to click the link
                above. Otherwise, enjoy the platform!
              </p>
            </div>
          </div>
          {isBreakPoint ? (
            <div className="pt-10 pb-20">
              <Image src={LogoAlt} alt="alt-logo" width={240} height={240} />
            </div>
          ) : (
            <div className="pt-10">
              <Image src={LogoAlt} alt="alt-logo" width={300} height={300} />
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default About;
