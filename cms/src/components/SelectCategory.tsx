import { Select } from "@chakra-ui/react";
import { Dispatch } from "react";
import {
  REDUCER_ACTION_TYPE,
  ReducerAction,
  initState,
} from "../utils/reducer";

interface Props {
  // category: string;
  // setCategory: Dispatch<SetStateAction<string>>;
  dispatch: Dispatch<ReducerAction>;
  state: typeof initState;
}

const SelectCategory = ({ state, dispatch }: Props) => {
  return (
    <div>
      <Select
        placeholder="--Select Category--"
        textColor={"white"}
        textAlign={"center"}
        onChange={(e) =>
          dispatch({
            type: REDUCER_ACTION_TYPE.SET_CATEGORY,
            payload: e.target.value,
          })
        }
        value={state.category}
      >
        <option value="comedy">Comedy</option>
        <option value="technology">Technology</option>
        <option value="news & politics">News & Politics</option>
        <option value="educational">Educational</option>
        <option value="society">Society & Culture</option>
        <option value="true crime">True Crime</option>
        <option value="sports">Sports</option>
      </Select>
    </div>
  );
};

export default SelectCategory;
