const INITIAL_STATE = {
  stack: []
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

const layersReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {
    case ADD_LAYER: {
      return {
        ...state,
        stack: [...state.stack, action.payload.displayObject]
      }
    }
      
    default:
      return state
  }
}

export default layersReducer