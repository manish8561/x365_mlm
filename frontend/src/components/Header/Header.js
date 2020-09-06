import React, { Component } from "react";
import { connect } from "react-redux";
import "./Header.scss";
import { Link } from "react-router-dom";
// import logofooter from "../../image/logo-footer.svg";
import { withRouter } from "react-router";

import { logOut, toggleBox } from "../../redux/_actions/persist.action";
import { EthereumLogOut } from "../../redux/_actions/ethereum.action";

import { HOME_ROUTE } from "../../_constants";

class Header extends Component {
  componentWillMount = () => {
    const { totals } = this.props;
    if (!totals) {
      this.logOutFunction();
      window.location.reload();
    }
  };

  logOutFunction = () => {
    let { EthereumLogOut, logOut, history } = this.props;

    EthereumLogOut();
    logOut();
    history.push(HOME_ROUTE);
    // window.location.reload();
  };



  render() {
    const { toggleBox, isLeftbar, registerationPerDay, totals, totalParticipants } = this.props;

    return (
      <div className="headerTop">
        <div className="headerLeft">
          <Link to="#" className="mobile_navBtn" onClick={() => toggleBox(!isLeftbar)}>
            Mobile
          </Link>
          {/* <h3>Welcome</h3>
          <h4>{address}</h4> */}
          <ul className="header_crruntActivityRow">
            <li>
              <strong>{totalParticipants}</strong>
              <span>All participants</span>
            </li>
            <li>
              <strong>+{registerationPerDay}</strong>
              <span>Joined in 24 hours</span>
            </li>
            <li>
              <strong>{totals.ether}</strong>
              <span>Total earned ETH</span>
            </li>
            <li>
              <strong>{totals.eur}</strong>
              <span>Total earned USD</span>
            </li>
          </ul>
        </div>
        <div className="headerRight">
          <ul className="navRight">
            <li className="navR_item">
              <Link to="#">
                <span>Membership</span>
              </Link>
            </li>
            <li className="navR_item">
              <a href="https://app-stage.x365.io/" target="_blank">
                <span>Information</span>
              </a>
            </li>
            <li className="navR_item navR_logedinOut">
              <Link to={HOME_ROUTE} onClick={() => this.logOutFunction()}>
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
// logo_url
const mapStateToProps = state => {
  return {
    loggedIn: state.persist.loggedIn,
    loginType: state.persist.loginType,
    address: state.persist.address,
    registerationPerDay: state.persist.registerationPerDay,
    totals: state.persist.totals,
    totalParticipants: state.persist.totalParticipants,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    logOut: () => dispatch(logOut()),
    toggleBox: () => dispatch(toggleBox()),
    EthereumLogOut: () => dispatch(EthereumLogOut())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
