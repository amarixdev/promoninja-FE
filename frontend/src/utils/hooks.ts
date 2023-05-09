import { useCallback, useEffect, useLayoutEffect, useState } from "react";

export const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(false);
  const updateTarget = useCallback((e: any) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  if (typeof window !== "undefined") {
    useLayoutEffect(() => {
      const media = window.matchMedia(`(max-width: ${width}px)`);
      media.addEventListener("change", updateTarget);

      // Check on mount (callback is not called until a change occurs)

      if (media.matches) {
        setTargetReached(true);
      } else {
        setTargetReached(false);
      }

      return () => media.removeEventListener("change", updateTarget);
    }, []);
  }

  return targetReached;
};

import { useRouter } from "next/router";
import { CurrentPage, NavContext } from "../context/navContext";

export const useSetCurrentPage = (currentPage: CurrentPage) => {
  const { setCurrentPage } = NavContext();

  useEffect(() => {
    setCurrentPage((prev) => ({
      ...prev,
      home: currentPage.home,
      podcasts: currentPage.podcasts,
      search: currentPage.search,
    }));
  }, [setCurrentPage]);
};

export const useLoadingScreen = () => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, []);

  return isLoading;
};

export const useCarouselSpeed = (
  clickCount: number,
  startTime: number,
  setDisplayEasterEgg: React.Dispatch<React.SetStateAction<boolean>>,
  setNinjaMode: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    if (clickCount > 1) {
      const elapsedTime = Date.now() - startTime;
      const clickSpeed = clickCount / (elapsedTime / 1000);

      if (clickSpeed >= 3 && clickCount > 6) {
        setDisplayEasterEgg(true);
        setNinjaMode(true);
      }
    }
  }, [clickCount, startTime]);
};

type RotateDirection = "next" | "prev";

export type HandleRotate = (direction: RotateDirection) => void;

export const useRotate = (
  startTime: number,
  clickCount: number,
  setClickCount: React.Dispatch<React.SetStateAction<number>>,
  setStartTime: React.Dispatch<React.SetStateAction<number>>
): [number, HandleRotate] => {
  const [currDeg, setCurrDeg] = useState(0);
  const [rotateDirection, setRotateDirection] =
    useState<RotateDirection>("next");

  const handleRotate: HandleRotate = (direction) => {
    setClickCount((prev) => prev + 1);

    if (clickCount === 0) {
      setStartTime(Date.now());
    }

    if (rotateDirection !== direction) {
      setClickCount(0);
      setStartTime(Date.now());
    }

    if (direction === "next") {
      setCurrDeg(currDeg + 45);
      setRotateDirection("next");
    } else if (direction === "prev") {
      setCurrDeg(currDeg - 45);
      setRotateDirection("prev");
    }
  };

  return [currDeg, handleRotate];
};
