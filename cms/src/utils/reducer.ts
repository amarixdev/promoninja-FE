export const initState = {
  category: "",
  podcast: "",
  text: "",
  extractedColor: "",
  isExistingPodcast: false,
  display: {
    sponsor: false,
    submit: false,
    preview: true,
    image: true,
    title: false,
    category: false,
    updateColor: true,
  },
  currentPodcast: {
    category: "",
    bgColor: "",
    title: "",
    image: "",
  },
};

export const enum REDUCER_ACTION_TYPE {
  SET_CATEGORY,
  SET_EXTRACTED_COLOR,
  INPUT_CHANGE,
  SELECT_PODCAST,
  RESET_FIELDS,
  TOGGLE_EXISTING_PODCAST,
  UPDATE_DISPLAY,
  UPDATE_CURRENT_PODCAST,
}

export type ReducerAction = {
  type: REDUCER_ACTION_TYPE;
  payload?: any;
};

export const reducer = (state: typeof initState, action: ReducerAction) => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.SET_CATEGORY: {
      return { ...state, category: action.payload };
    }
    case REDUCER_ACTION_TYPE.SET_EXTRACTED_COLOR: {
      return { ...state, extractedColor: action.payload };
    }
    case REDUCER_ACTION_TYPE.INPUT_CHANGE: {
      return {
        ...state,
        text: action.payload,
        podcast: "",
        extractedColor: "",
        isExistingPodcast: false,
        display: {
          ...state.display,
          submit: false,
          sponsor: false,
          preview: true,
          title: false,
          category: false,
        },
      };
    }
    case REDUCER_ACTION_TYPE.SELECT_PODCAST: {
      return {
        ...state,
        text: action.payload,
        podcast: action.payload,
        extractedColor: "",
        display: {
          ...state.display,
          preview: false,
          sponsor: true,
          image: true,
          title: true,
          category: false,
          updateColor: true,
        },
      };
    }
    case REDUCER_ACTION_TYPE.RESET_FIELDS: {
      return {
        ...state,
        text: "",
        podcast: "",
        category: "",
        extractedColor: "",
      };
    }
    case REDUCER_ACTION_TYPE.TOGGLE_EXISTING_PODCAST: {
      return { ...state, isExistingPodcast: action.payload };
    }
    case REDUCER_ACTION_TYPE.UPDATE_DISPLAY: {
      return {
        ...state,
        display: {
          ...state.display,
          ...action.payload,
        },
      };
    }
    case REDUCER_ACTION_TYPE.UPDATE_CURRENT_PODCAST: {
      return {
        ...state,
        currentPodcast: {
          ...state.currentPodcast,
          ...action.payload,
        },
      };
    }
  }
};
