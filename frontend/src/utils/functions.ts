export const capitalizeString = (str: string) => {
    const result = str
      .split(" ")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");

    return result;
};
  

export const truncateString = (string: string, num: number) => {
  if (string?.length > num) {
    return string.slice(0, num) + `...`;
  } else return string;
};