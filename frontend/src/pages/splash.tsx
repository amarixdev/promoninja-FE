import React from "react";
import Logo from "../public/assets/logo.png";
import Image from "next/image";

type Props = {};

const SplashScreen = (props: Props) => {
  return (
    <div className="h-screen bg-gradient-to-b from-[#222222] via-[#151515] to-black w-full flex items-center justify-center">
      <Image
        src={Logo}
        alt={"logo"}
        width={120}
        height={120}
        loading="eager"
        priority
      />
    </div>
  );
};

export default SplashScreen;
