import Link from "next/link";
import React, { useEffect, useRef } from "react";
import styles from "../../styles/style.module.css";

function Button() {
  return (
    <div className="mt-10">
      <Link href="/podcasts">
        <div className={`${styles.btn} active:scale-[99%]`}>
          <h1 className="text-center  text-xl justify-self-center font-bold text-black">
            Get Started
          </h1>
        </div>
      </Link>
    </div>
  );
}

export default Button;
