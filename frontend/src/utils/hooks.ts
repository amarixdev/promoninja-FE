import {
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(true);
  const updateTarget = useCallback((e: any) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(`(max-width: ${width}px)`);
      media.addEventListener("change", updateTarget);
      if (media.matches) {
        setTargetReached(true);
      } else {
        setTargetReached(false);
      }

      return () => media.removeEventListener("change", updateTarget);
    }
  }, [width, updateTarget]);

  return targetReached;
};

import { useDisclosure, useToast } from "@chakra-ui/react";
import { NextRouter, useRouter } from "next/router";
import { CurrentPage, NavContext } from "../context/navContext";

export const useSetCurrentPage = (currentPage: CurrentPage) => {
  const { setCurrentPage } = NavContext();

  useEffect(() => {
    setCurrentPage((prev) => ({
      ...prev,
      home: currentPage.home,
      podcasts: currentPage.podcasts,
      search: currentPage.search,
      offers: currentPage.offers,
    }));
  }, [
    setCurrentPage,
    currentPage.home,
    currentPage.offers,
    currentPage.podcasts,
    currentPage.search,
  ]);
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
  }, [router.events]);

  return isLoading;
};

export const useCarouselSpeed = (
  clickCount: number,
  startTime: number,
  setNinjaMode: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [easterEgg, setEaserEgg] = useState(false);
  useEffect(() => {
    if (clickCount > 1) {
      const elapsedTime = Date.now() - startTime;
      const clickSpeed = clickCount / (elapsedTime / 1000);
      if (clickSpeed >= 3 && clickCount > 8) {
        setNinjaMode(true);
        setEaserEgg(true);
      }
    }
  }, [clickCount, startTime, setNinjaMode, easterEgg]);

  return { easterEgg, setEaserEgg };
};

type RotateDirection = "next" | "prev";

export type HandleRotate = (direction: RotateDirection) => void;

export const useRotate = (
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

const useSlider = (
  slider: HTMLDivElement | null,
  scrollDistance: number,
  podcastPage: boolean
) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const showLeftArrowRef = useRef(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const showRightArrowRef = useRef(true);

  const slideTopPicks = (direction: string) => {
    if (slider) {
      if (direction === "left") {
        slider.scrollLeft -= scrollDistance;
      } else if (direction === "right") {
        slider.scrollLeft += scrollDistance;
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (slider) {
        const { scrollWidth, scrollLeft, clientWidth } = slider;
        const scrollPosition = scrollLeft + clientWidth;
        if (
          (podcastPage && slider.scrollLeft <= 40) ||
          slider.scrollLeft === 0
        ) {
          setShowLeftArrow(false);
        } else {
          setShowLeftArrow(true);
        }

        if (scrollPosition === scrollWidth) {
          setShowRightArrow(false);
        } else {
          setShowRightArrow(true);
        }
      }
    };

    if (slider) {
      slider.addEventListener("scroll", handleScroll);
      return () => slider.removeEventListener("scroll", handleScroll);
    }
  }, [slider, podcastPage]);

  return { showLeftArrow, showRightArrow, slideTopPicks };
};

export default useSlider;

export const useHoverCard = () => {
  const isBreakPoint = useMediaQuery(1023);
  const [activeIndex, setActiveIndex] =
    useState<SetStateAction<number | null>>(null);
  let timerId: NodeJS.Timeout;

  const handleHoverCard = async (index: number, event: string) => {
    if (!isBreakPoint) {
      clearTimeout(timerId);
      if (event == "mouseenter" && !activeIndex) {
        timerId = setTimeout(() => {
          setActiveIndex(index);
        }, 500);
      }
      if (event === "mouseleave") {
        clearTimeout(timerId);
      }
    }
  };

  return { handleHoverCard, setActiveIndex, activeIndex };
};

export const useScrollRestoration = (router: NextRouter) => {
  useEffect(() => {
    const handleRouteChange = () => {
      window.history.scrollRestoration = "manual";
    };
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);
};

export const useBanner = (
  bannerBreakpointRef: RefObject<HTMLDivElement>,
  breakpoint: number,
  page?: string
) => {
  const [banner, setBanner] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (bannerBreakpointRef.current) {
        const elementRect = bannerBreakpointRef.current.getBoundingClientRect();
        const isPastElement =
          page === "sponsor" && !breakpoint
            ? elementRect.top <= breakpoint
            : elementRect.bottom <= breakpoint;

        setBanner(isPastElement);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [banner, bannerBreakpointRef, breakpoint, page]);

  return { banner };
};

export const useReportIssue = (selected: string) => {
  const [podcastState, setPodcastState] = useState<string[]>([]);
  const [notified, setNotified] = useState(false);

  const handleBrokenLink = (selected: string) => {
    onOpenBrokenLink();
    setNotified(false);
    if (podcastState.includes(selected)) {
      setNotified(true);
    }
  };
  const {
    isOpen: isOpenBrokenLink,
    onOpen: onOpenBrokenLink,
    onClose: onCloseBrokenLink,
  } = useDisclosure();
  return {
    handleBrokenLink,
    isOpenBrokenLink,
    onCloseBrokenLink,
    notified,
    podcastState,
    setPodcastState,
  };
};

export const useCopyToClipboard = (promoCode?: string) => {
  console.log("test");

  const isBreakPoint = useMediaQuery(1023);
  const toastPosition = isBreakPoint ? "top" : "bottom";
  const toast = useToast();
  const handleCopy = async (link?: string) => {
    try {
      if (promoCode) {
        await navigator.clipboard.writeText(promoCode);
        CopyToast();
      } else if (link) {
        await navigator.clipboard.writeText(link);
        CopyToast();
      }
    } catch (error) {
      console.error("Failed to copy");
    }
  };

  const CopyToast = () => {
    return toast({
      title: `${
        promoCode ? "Copied To Clipboard" : "Link Copied To Clipboard"
      } `,
      description: `${
        promoCode ? `Promocode: ${promoCode?.toUpperCase()}` : ""
      }`,
      status: "success",
      duration: 2000,
      isClosable: true,
      colorScheme: `gray`,
      position: toastPosition,
    });
  };

  return { handleCopy };
};

export const addOpacityToRGB = (
  rgb: string | undefined,
  opacity: number
): string | null => {
  const colorValues = rgb?.match(/\d+/g);
  if (colorValues && colorValues.length === 3) {
    const [red, green, blue] = colorValues;
    const rgba = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
    return rgba;
  }
  return null;
};

export const useCounter = () => {
  const [count, setCount] = useState(0);
  setTimeout(() => {
    setCount((c) => c + 1);
  }, 3000);

  return { count };
};
