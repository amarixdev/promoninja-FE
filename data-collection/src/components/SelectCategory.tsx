import { Select } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
}

const SelectCategory = ({ category, setCategory }: Props) => {
  return (
    <div>
      <Select
        placeholder="--Select Category--"
        textColor={"white"}
        textAlign={"center"}
        onChange={(e) => setCategory(e.target.value)}
        value={category}
      >
        <option value="comedy">Comedy</option>
        <option value="technology">Technology</option>
        <option value="news & politics">News & Politics</option>
        <option value="educational">Educational</option>
        <option value="lifestyle">Lifestyle</option>
        <option value="true crime">True Crime</option>
        <option value="sports">Sports</option>
      </Select>
    </div>
  );
};

export default SelectCategory;
