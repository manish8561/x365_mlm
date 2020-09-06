import { combineReducers } from "redux";
import loading from "./loading.reducer";
import { createBrowserHistory } from "history";
import { reducer as formReducer } from "redux-form";
import { connectRouter } from "connected-react-router";
import order from "./order.reducer";
import ethereum from "./ethereum.reducer";
import persist from "./persist.reducer";
import merchant from "./merchant.reducer";
export const history = createBrowserHistory();
const appReducer = combineReducers({
  order,
  loading,
  persist,
  form: formReducer,
  router: connectRouter(history),
  merchant,
  ethereum
});

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT_USERS_PERSIST") {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
