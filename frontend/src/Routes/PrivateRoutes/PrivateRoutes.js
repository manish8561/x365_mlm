import React, { Component } from "react";
import { Route } from "react-router-dom";
import { withRouter } from "react-router";
import Home from "../../containers/Home/Home";
import Transaction from "../../containers/Transaction/Transaction";
import { HOME_ROUTE } from "../../_constants";
import Userlevel from "../../containers/Userlevel/Userlevel";

class PrivateRoutes extends Component {
  state = {};
  render() {
    return (
      <div className="PrivateArea__content">
        <Route path={`${HOME_ROUTE}auth/home`} component={Home} exact={true} />
        <Route
          path={`${HOME_ROUTE}auth/transaction`}
          component={Transaction}
          exact={true}
        />
        <Route
          path={`${HOME_ROUTE}auth/userLevel/:address/:level/:matrix/:reinvest?`}
          component={Userlevel}
          exact={true}
        />
      </div>
    );
  }
}

export default withRouter(PrivateRoutes);
