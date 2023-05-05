import { useState, useEffect, useCallback, useLayoutEffect } from "react";

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

import { CurrentPage, NavContext } from "../context/navContext";
import { useRouter } from "next/router";

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
