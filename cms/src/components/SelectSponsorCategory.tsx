import { Select } from "@chakra-ui/react";
import { useState } from "react";
import Sponsors from "../pages/sponsors";

interface Props {
  newCategory?: string;
  setSponsor: (prev: any) => void;
  isExisting: boolean;
  currentCategory?: string;
}

/* TODO: 
1. Work on adding sponsor categories
2. Add back accidentally deleted sponsors
3. Work on sponsor page */

const SelectSponsorCategory = ({
  newCategory,
  currentCategory,
  setSponsor,
  isExisting,
}: Props) => {
  return (
    <div>
      <Select
        placeholder="--Select Category--"
        textColor={"black"}
        textAlign={"center"}
        onChange={(e) => {
          {
            isExisting ||
              setSponsor((prev: any) => ({
                ...prev,
                category: e.target.value,
              }));
          }
        }}
        value={isExisting ? currentCategory : newCategory}
      >
        <option value="Health & Wellness">Health & Wellness</option>
        <option value="Digital Services">Digital Services</option>
        <option value="Food">Food</option>
        <option value="Accessories">Accessories</option>
        <option value="Home Decor">Home Decor</option>
        <option value="Outdoors">Outdoors</option>
        <option value="Smoke & Vape">Smoke & Vape</option>
        <option value="Alcohol">Alcohol</option>
      </Select>
    </div>
  );
};

export default SelectSponsorCategory;
