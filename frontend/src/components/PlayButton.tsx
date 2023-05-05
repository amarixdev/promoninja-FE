import styles from "../../styles/style.module.css";

interface Props {
  isActive: boolean;
  setIsActive: any;
}

const PlayButton = ({ isActive, setIsActive }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center mt-4 absolute base:top-[320px] xs:top-[340px] sm:top-[360px] ">
      {/* Play Button */}
      <div
        className="w-fit flex flex-col items-center justify-center cursor-pointer base:mt-2 xs:mt-10"
        onClick={() => setIsActive((prev: any) => !prev)}
      >
        <div
          className={`${styles.play} ${
            isActive && styles.clicked
          } mt-4 base:w-[25px] base:h-[25px] xs:w-[40px] xs:h-[40px] bg-white cursor-pointer transition-all duration-300 ease-in-out`}
        ></div>
      </div>
    </div>
  );
};

export default PlayButton;
