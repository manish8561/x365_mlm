import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { logOut } from "../../redux/_actions/persist.action";
import { HOME_ROUTE } from "../../_constants/index";

const NoGuard = ({ component: Component, ...rest }) => {
  const { loggedIn } = rest;
  // const isAuthenticated = true;

  return (
    <Route
      {...rest}
      render={props =>
        !loggedIn ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: `${HOME_ROUTE}auth/home`,
                state: {
                  from: props.location
                }
              }}
            />
          )
      }
    />
  );
};

const mapStateToProps = state => {
  return {
    loggedIn: state.persist.loggedIn
  };
};
const mapDispatchToProps = dispatch => {
  return {
    logOut: () => dispatch(logOut())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NoGuard);
