import React, { Component } from "react";
import {
  BrowserRouter as Router,
  // Route,
  Switch,
  // HashRouter
} from "react-router-dom";
import PublicRoutes from "./Routes/PublicRoutes/PublicRoute";
import AuthGuard from "./Routes/Guards/AuthGuard";
import NoGuard from "./Routes/Guards/NoGuard";
import PrivateRoutes from "./Routes/PrivateRoutes/PrivateRoutes";
import LoaderComponent from "./components/LoaderComponent/LoaderComponent.jsx";
import { HOME_ROUTE } from "./_constants/index";

class Application extends Component {
  componentDidMount = () => { };
  render() {
    return (
      <React.Fragment>
        <LoaderComponent></LoaderComponent>
        <Router>
          <Switch>
            <AuthGuard path={`${HOME_ROUTE}auth`} component={PrivateRoutes} />
            <NoGuard path={`${HOME_ROUTE}`} component={PublicRoutes} />
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

export default Application;
