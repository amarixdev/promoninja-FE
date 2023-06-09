import Link from "next/link";
import React from "react";
import style from "../../../styles/style.module.css";
import { HandleRotate } from "../../utils/hooks";
import { SponsorCategory } from "../../utils/types";

interface Props {
  handleRotate: HandleRotate;
  currDeg: number;
  categoryData: SponsorCategory[];
  categoryIndex: number;
  setCategoryIndex: (value: number) => void;
}

const Carousel = ({
  currDeg,
  categoryData,
  setCategoryIndex,
  categoryIndex,
}: Props) => {
  const carouselDiv = [
    style.a,
    style.b,
    style.c,
    style.d,
    style.e,
    style.f,
    style.g,
    style.h,
  ];

  return (
    <div className={style.container}>
      <div
        className={style.carousel}
        style={{
          transform: `rotateY(${currDeg}deg)`,
          WebkitTransform: `rotateY(${currDeg}deg)`,
          OTransform: `rotateY(${currDeg}deg)`,
        }}
      >
        {categoryData.map((category: SponsorCategory, i) => (
          <Link
            href={`/offers/`}
            className={`${style.item} ${carouselDiv[i]} ${style.category}`}
            key={category.name}
            onClick={() => setCategoryIndex(i)}
          >
            <h1 className="font-bold relative h-fit">{category.name}</h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
