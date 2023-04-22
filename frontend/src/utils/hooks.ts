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

import { NavContext } from "../context/navContext";
function useSetHomePage(bool: boolean) {
  const { setHomePage } = NavContext();

  useEffect(() => {
    setHomePage(bool);
  }, [setHomePage, bool]);
}

export default useSetHomePage;
