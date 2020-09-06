/** seting action types */
export const actionTypes = {
  START_LOADING: "START_LOADING",
  STOP_LOADING: "STOP_LOADING"
};

/*
 * Action creators for loading
 */

export function startLoading() {
  return {
    type: actionTypes.START_LOADING
  };
}

export function stopLoading() {
  return {
    type: actionTypes.STOP_LOADING
  };
}
