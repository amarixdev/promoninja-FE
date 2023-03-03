import { useState, useEffect } from "react";

const useScreenWidth = () => {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleScreenWidth = () => {
      setScreenWidth(window.screen.width);
    };

    window.addEventListener("resize", handleScreenWidth);

    return () => {
      window.removeEventListener("resize", handleScreenWidth);
    };
  }, []);

  return screenWidth;
};

export default useScreenWidth;
