import Link from "next/link";
import React, { useEffect, useRef } from "react";
import styles from "../../styles/style.module.css";

function Button() {
  return (
    <div className="mt-10">
      <Link href="/podcasts">
        <div className={`${styles.btn}`}>
          <h1 className="text-center justify-self-center">Get Started</h1>
        </div>
      </Link>
    </div>
  );
}

export default Button;
