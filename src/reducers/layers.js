const INITIAL_STATE = {
  stack: [],
  spaceDown: false
};

export const ADD_LAYER = 'ADD_LAYER';
export function addLayer(displayObject) {
  return {
    type: ADD_LAYER,
    payload: {
      displayObject
    }
  }
}

export const SET_SPACE_DOWN = 'SET_SPACE_DOWN';
export function setSpaceDown(spaceDown) {
  return {
    type: SET_SPACE_DOWN,
    payload: {
      spaceDown
    }
  }
}

const layersReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {
    case ADD_LAYER: {
      return {
        ...state,
        stack: [...state.stack, action.payload.displayObject]
      }
    }

    case SET_SPACE_DOWN: {
      const { spaceDown } = action.payload;
      return {
        ...state,
        spaceDown
      }
    }
      
    default:
      return state
  }
}

export default layersReducer