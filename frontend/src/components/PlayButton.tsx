import React, { useState } from "react";
import styles from "../../styles/style.module.css";

const PlayButton = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div
      className="flex flex-col items-center justify-center mt-10"
      onClick={() => setIsActive((prev) => !prev)}
    >
      <div
        className={`${styles.play} ${
          isActive && styles.clicked
        } mt-4 w-[40px] h-[40px] bg-white cursor-pointer transition-all duration-300 ease-in-out`}
      ></div>
      {isActive || <h1 className="font-bold py-4">Show Sponsors</h1>}
      {isActive && ""}
      {isActive && (
        <div className=" mt-10 p-6">
          Sponsors
        </div>
      )}
    </div>
  );
};

export default PlayButton;
