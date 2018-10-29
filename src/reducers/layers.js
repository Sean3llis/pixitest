const INITIAL_STATE = {
  stack: [],
  spaceDown: false
};

export const ADD_LAYER = 'ADD_LAYER';
export const IMAGE_LAYER = 'IMAGE_LAYER';
export function addLayer(layer) {
  console.log('layer ~~>', layer);
  return {
    type: ADD_LAYER,
    payload: {
      layer: {
        type: IMAGE_LAYER,
        name: layer.filename,
        id: layer.id
      }
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
      const { layer } = action.payload;
      return {
        ...state,
        stack: [layer, ...state.stack]
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