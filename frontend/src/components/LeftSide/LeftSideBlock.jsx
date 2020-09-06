import React, { Component } from "react";
import "./LeftSideBlock.scss";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
// import { Accordion, Icon } from "semantic-ui-react";
import logo from "../../images/logo_10xZoom.png";
import copyIcon from "../../images/icon_copyAddress.svg";
// import parse from "html-react-parser";
import { toggleBox } from "../../redux/_actions/persist.action";
import { HOME_ROUTE, REFERRAL_URL, ETHERSCAN_URL } from "../../_constants";
import { toast } from "../../components/Toast/Toast";
import {
  levelPrice,
  getEuroPrice,
  lastUserId,
  getTotalDB,
  registeredPerDay
} from "../../redux/_actions/ethereum.action";

class LeftSideBlock extends Component {
  state = { activeIndex: "" };

  componentDidMount = () => {
    const { levelPrice, lastUserId, getTotalDB, registeredPerDay } = this.props;
    levelPrice();
    lastUserId();
    getTotalDB();
    registeredPerDay();
  };

  componentWillReceiveProps = (nextProps) => {
    if (this.props.location.pathname === nextProps.location.pathname &&
      this.props.location.search === nextProps.location.search
    ) {
      // this means that no change in the path, so we don't need to refire the
      // action
      return;
    }
    // if not fire the action
    this.props.getEuroPrice();
    this.props.lastUserId();
    this.props.getTotalDB();
    this.props.registeredPerDay();
  }


  //copy function 
  copyToClipboard = referralUrl => {
    this.textArea.value = referralUrl;
    this.textArea.select();
    document.execCommand("copy");
    toast.success("Copied!");
  };

  render() {
    let {
      isLeftbar, toggleBox,
      history: {
        location: { pathname }
      }, userDetails, address, totalIncome, totalIncome3x, totalIncome4x, euroPrice
    } = this.props;
    // console.log(this.props, 'left');
    const referralUrl = REFERRAL_URL + userDetails.id;
    const trustWalletLink = `https://link.trustwallet.com/open_url?url=${referralUrl}`;
    const etherscanLink = ETHERSCAN_URL + 'address/' + address;
    const euroPrice3x = (euroPrice * totalIncome3x).toFixed(2);
    const euroPrice4x = (euroPrice * totalIncome4x).toFixed(2);
    const euroTotalIncome = (totalIncome * euroPrice).toFixed(2);
    totalIncome = totalIncome.toFixed(3);
    totalIncome3x = totalIncome3x.toFixed(3);
    totalIncome4x = totalIncome4x.toFixed(3);

    // console.log('Total income Render', euroPrice, euroPrice3x, euroPrice4x);

    return (
      <div className={`leftBar ${isLeftbar ? "isShow" : "isHide"}`}>
        <div className="left_logoBlock">
          <div className="logoBlock">
            <Link to={`${HOME_ROUTE}auth/home`} title="Dashboard">
              <img src={logo} alt="logo" />
            </Link>
          </div>
        </div>
        <h2 className="navHeading">
          {/* Navigations{" "} */}
          <span className="closeBtn" onClick={() => toggleBox()}>
            Close X
          </span>
        </h2>
        <div className="sidebarNav">
          <div className="sn_identity">
            <h2>ID  <span>-</span>  {userDetails.id}</h2>
            <ul>
              <li>
                <strong>{euroTotalIncome}</strong>
                <span>USD</span>
              </li>
              <li>
                <strong>{totalIncome} </strong>
                <span>ETH</span>
              </li>
            </ul>
          </div>

          <div className="sn_matType">
            <h2>M3</h2>
            <ul>
              <li>
                <strong>{euroPrice3x}</strong>
                <span>USD</span>
              </li>
              <li>
                <strong>{totalIncome3x}</strong>
                <span>ETH</span>
              </li>
            </ul>
          </div>
          <div className="sn_matType ex_bottom_margin">
            <h2>M4</h2>
            <ul>
              <li>
                <strong>{euroPrice4x}</strong>
                <span>USD</span>
              </li>
              <li>
                <strong>{totalIncome4x}</strong>
                <span>ETH</span>
              </li>
            </ul>
          </div>

          <div className="sn_LinkBar">
            <textarea
              type="text"
              style={{
                position: "absolute",
                top: "0",
                border: "none",
                background: "none",
                color: "#3ca4d5",
                width: "1px",
                height: "1px",
                overflow: "hidden",
                resize: "none"
              }}
              ref={textarea => (this.textArea = textarea)}
              defaultValue={referralUrl}
            />
            <label>Trust Wallet</label>
            <div className="linkBlock">
              <span>{referralUrl}</span>
              <Link to="#" onClick={() => this.copyToClipboard(trustWalletLink)}><img src={copyIcon} alt="copy" /></Link>
            </div>
          </div>

          <div className="sn_LinkBar">
            <label>Affiliate Link</label>
            <div className="linkBlock">
              <span>{referralUrl}</span>
              <Link to="#" onClick={() => this.copyToClipboard(referralUrl)}><img src={copyIcon} alt="copy" /></Link>
            </div>
          </div>

          <div className="sn_LinkBar">
            <label>Your Ethereum Wallet</label>
            <div className="linkBlock">
              <span>{etherscanLink}</span>
              <Link to="#" href="#" onClick={() => this.copyToClipboard(etherscanLink)}><img src={copyIcon} alt="copy" /></Link>
            </div>
            <a href={etherscanLink} target="_blank" className="ethScanLink">To Etherscan</a>
          </div>
          {/* <ul className="nav_list"> */}
          {/* <li
              className={`nav_item item_team ${
                pathname === "/auth/home" ? "item_active" : ""
                }`}
            >
              <Link to={`${HOME_ROUTE}auth/home`}>Dashboard</Link>
            </li> */}
          {/* <li
              className={`nav_item item_topUp ${
                pathname === "/auth/topup" ? "item_active" : ""
              }`}
            >
              <Link to={`${HOME_ROUTE}auth/topup`}>Topup</Link>
            </li>
           */}

          {/* <li
              className={`nav_item item_transaction ${
                pathname === "/auth/transaction" ? "item_active" : ""
                }`}
            >
              <Link to={`${HOME_ROUTE}auth/transaction`}>Transaction</Link>
            </li> */}
          {/* </ul> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    address: state.persist.address,
    userDetails: state.persist.userDetails,
    loggedIn: state.persist.loggedIn,
    loginType: state.persist.loginType,
    totalIncome: state.ethereum.totalIncome,
    totalIncome3x: state.ethereum.totalIncome3x,
    totalIncome4x: state.ethereum.totalIncome4x,
    euroPrice: state.persist.euroPrice,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleBox: () => dispatch(toggleBox()),
    levelPrice: () => dispatch(levelPrice()),
    getEuroPrice: () => dispatch(getEuroPrice()),
    lastUserId: () => dispatch(lastUserId()),
    registeredPerDay: () => dispatch(registeredPerDay()),
    getTotalDB: () => dispatch(getTotalDB()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LeftSideBlock)
);
