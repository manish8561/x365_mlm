import React, { Component } from "react";
import { Route } from "react-router-dom";
import { withRouter } from "react-router";
import SignUp from "../../containers/User/SignUp";
import { HOME_ROUTE } from "../../_constants";

const My404Component = props => {
  return <div>Page Not Found</div>;
};

class PublicRoutes extends Component {
  state = {};
  render() {
    return (
      <div className="PublicArea__content">
        <Route
          path={`${HOME_ROUTE}referral/:upline`}
          component={SignUp}
          exact
        />
        <Route
          path={`${HOME_ROUTE}r/:upline`}
          component={SignUp}
          exact
        />
        {/* <Route path="/transaction" component={Transaction} exact /> */}

        <Route path={HOME_ROUTE} component={SignUp} exact />
        {/* <Route path="/" render={() => { return (<Redirect to={HOME_ROUTE} />) }} /> */}

        {/* <Route component={My404Component} /> */}
      </div>
    );
  }
}

export default withRouter(PublicRoutes);
