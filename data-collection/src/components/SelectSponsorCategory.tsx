import { Select } from "@chakra-ui/react";
import { useState } from "react";

interface Props {
  category: string;
  setSponsor: (prev: any) => void;
}

/* TODO: 
1. Work on adding sponsor categories
2. Add back accidentally deleted sponsors
3. Work on sponsor page */

const SelectSponsorCategory = ({ category, setSponsor }: Props) => {
  return (
    <div>
      <Select
        placeholder="--Select Category--"
        textColor={"black"}
        textAlign={"center"}
        onChange={(e) => {
          setSponsor((prev: any) => ({ ...prev, category: e.target.value }));
        }}
        value={category}
      >
        <option value="Health & Wellness">Health & Wellness</option>
        <option value="Digital Services">Digital Services</option>
        <option value="Food & Beverage">Food & Beverage</option>
        <option value="Personal Care">Personal Care</option>
        <option value="Accessories">Accessories</option>
        <option value="Home Decor">Home Decor</option>
        <option value="Outdoors">Outdoors</option>
        <option value="Smoke & Vape">Smoke & Vape</option>
      </Select>
    </div>
  );
};

export default SelectSponsorCategory;
