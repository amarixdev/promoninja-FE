export const capitalizeString = (str: string) => {
    if(!str) return
    const result = str
      .split(" ")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");

    return result;
  };