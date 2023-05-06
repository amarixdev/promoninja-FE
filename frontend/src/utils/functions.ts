export const capitalizeString = (str: string | undefined) => {
  if (!str) return;
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

export const convertToSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

export const convertToFullURL = (link: string) => {
  if (link.startsWith("http://") || link.startsWith("https://")) {
    return link;
  } else {
    return "http://" + link;
  }
};

export const callToAction = (input: string) => {
  let output = input.trim();
  // remove "Podcast" at the end (if present)
  if (output.toLowerCase().endsWith("podcast")) {
    output = output.slice(0, output.length - 7).trim();
  }
  // check if the input already includes "the" (case-insensitive)
  if (!output.toLowerCase().includes("the ")) {
    output = "The " + output;
  }
  // add "Support" and "podcast" to the output
  output = `Support ${output} podcast!`;

  return output;
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};