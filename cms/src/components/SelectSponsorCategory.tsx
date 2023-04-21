import { Select } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import Sponsors from "../pages/sponsors";
import { Sponsor } from "../utils/types";

interface Props {
  newCategory?: string;
  setSponsor?: Dispatch<SetStateAction<Sponsor>>;
  isExisting?: boolean;
  currentCategory?: string;
  setCurrentCategory?: Dispatch<SetStateAction<string>>;
  setNewCategory?: Dispatch<SetStateAction<string>>;
  editing?: boolean;
}

const SelectSponsorCategory = ({
  newCategory,
  setNewCategory,
  currentCategory,
  setSponsor,
  isExisting,
  editing,
}: Props) => {
  return (
    <div>
      <Select
        placeholder="--Select Category--"
        textColor={"black"}
        textAlign={"center"}
        onChange={(e) => {
          {
            editing
              ? setNewCategory?.(e.target.value)
              : setSponsor?.((prev: Sponsor) => ({
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
