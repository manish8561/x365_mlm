import React, { Component } from "react";
import { Grid, Container, Header } from "semantic-ui-react";
// import { deleteCookie } from "../../_utils/index";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  purchaseLevel,
  getDetails,
  convertFromWei,
  levelPrice,
  callWeb3,

} from "../../redux/_actions/ethereum.action";
import { toast } from "../../components/Toast/Toast";

import cricleIcon from "../../images/refresh_iconY.svg";
import icon_group from "../../images/icon_usergroupY.svg";

import { HOME_ROUTE } from "../../_constants";

import iconCostofEath from "../../images/icon_cost_of_eth.svg";
import iconNoOfReopen from "../../images/icon_noOfReopen.svg";
import iconPartnersOfPlatform from "../../images/icon_partnersOfPlatform.svg";

export class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      joinPoolConfirmation: true,
      loginType: 'none',
    };
  }
  componentDidMount = async () => {
    const { loggedIn } = this.props;
    if (loggedIn) {
      this.getUserOtherDetails();
    }
  };

  getUserOtherDetails = () => {
    const {
      getDetails,
    } = this.props;

    getDetails();
    this.setState({ joinPoolConfirmation: true });
  };
  // get level Price Meghraj
  getLevelPrice = async () => {
    const { levelPrice } = this.props;
    levelPrice();
    this.setState({ joinPoolConfirmation: true });
  };
  // End get level Price

  //to enable extension in metamask
  isMetaMaskInstalled = async () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum, web3 } = window;
    const result = Boolean(ethereum && ethereum.isMetaMask);
    if (result) {
      //metamask
      this.setState({ loginType: "metamask" });
      return "metamask";
    } else if (web3) {
      // console.log(web3, "trustwallet");
      //trustwallet
      this.setState({ loginType: "trustwallet" });
      return "trustwallet";
    } else {
      alert("Install Metamask extension first!");
      return "none";
    }
  };

  // Buy new level Meghraj
  purchaseLevelCommon = async (value, level, matrix) => {
    const { purchaseLevel, address, callWeb3 } = this.props;
    const { joinPoolConfirmation } = this.state;
    const loggedUser = address;
    if (value && joinPoolConfirmation) {
      if (window.confirm(`Are you sure to purchase the plan?`)) {
        const installed = await this.isMetaMaskInstalled();
        // if (installed !== 'none') {
        //   this.setState({ joinPoolConfirmation: false });
        //   await purchaseLevel(value, level, matrix);
        //   this.getLevelPrice();
        // }
        try {
          if (installed === "metamask") {
            const { ethereum } = window;
            ethereum
              .enable()
              .then(async accounts => {
                let address = accounts[0];
                if (loggedUser.toLowerCase() === address.toLowerCase()) {
                  this.setState({ joinPoolConfirmation: false });
                  await purchaseLevel(value, level, matrix);
                  this.getLevelPrice();
                } else {
                  return toast.error("Logged ID and metamask ID does not match!");
                }
              }).catch(err => console.log(err));
          }
          if (installed === "trustwallet") {
            const { web3 } = window;
            if (web3) {
              const web3 = await callWeb3();
              const accounts = await web3.eth.getAccounts();
              let address = accounts[0];
              if (loggedUser.toLowerCase() === address.toLowerCase()) {
                this.setState({ joinPoolConfirmation: false });
                await purchaseLevel(value, level, matrix);
                this.getLevelPrice();
              } else {
                return toast.error("Logged ID and wallet ID does not match!");
              }
            } else {
              alert("no wallet found");
            }
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    }
  };

  render() {
    const { address, ethLevelPrice3x, ethLevelPrice4x } = this.props;

    const numArr3x = [0, 1, 2];
    const numArr4x_level1 = [0, 1];
    const numArr4x_level2 = [0, 1, 2, 3];
    const resultArr3x = ethLevelPrice3x;
    const resultArr4x = ethLevelPrice4x;
    // console.log('RESULT 3x' ,resultArr3x );
    // console.log('RESULT 4x' ,resultArr4x );

    return (
      <div className="contentArea">
        <div className="teamMainOut">
          <div className="teamMain">
            <div className="teamRight">
              <Container fluid>
                <Grid columns={6}>
                  <Header as="h3">M3 Plan</Header>
                  <Grid.Row className="fastPlanRow">
                    {resultArr3x.map((data, index) => (
                      <Grid.Column
                        key={index}
                        className={`${(!data.activeStatus && resultArr3x[index - 1].activeStatus) ? "buyNowPlan" : ""} ${data.activeStatus ? "planPurchasedColumn" : ""}`}
                      >
                        <ul className="cardTopBar">
                          <li className="cardCountStyle">{index + 1}</li>
                          <li>
                            {/* buy 3x button */}

                            {!data.activeStatus && ((resultArr3x[index - 1].activeStatus) ? (<Link to="#"
                              className="linkBuy"
                              onClick={() =>
                                this.purchaseLevelCommon(data.levelPrice, index + 1, "1")
                              }
                            >
                              <span className="isHide">Buy</span>
                            </Link>) : (<Link to="#"
                              className="linkBuy"
                            >
                              <span className="isHide">Buy</span>
                            </Link>))
                            }
                          </li>
                        </ul>
                        <Header as="h4"
                          className={
                            data.activeStatus
                              ? "activated"
                              : ""
                          }>
                          <Link to={`${HOME_ROUTE}auth/userLevel/${address}/${index + 1}/1`} title={address}>
                            <strong>{data.levelPrice}</strong>
                            <strong className="currencyType">ETH</strong>
                          </Link>
                        </Header>

                        <div className="ternary-children">
                          <div className="ternary-childrenHolder">
                            {numArr3x.map((a) =>
                              (<div key={a} className="childrenParent">
                                {
                                  data.levelOneUsers.length > 0 && data.levelOneUsers[a]
                                    ? (
                                      <Link to={`${HOME_ROUTE}auth/userLevel/${data.levelOneUsers[a].address}/${index + 1}/1`} title={data.levelOneUsers[a].address}>
                                        {data.levelOneUsers.map((l, index2) => (<div key={index2}>
                                          {(l.address === data.levelOneUsers[a].address) &&
                                            <span className={`children childrenActivate ${l.ahead ? "aheadId" : ""}`}></span>}
                                        </div>))}</Link>
                                    ) : (
                                      <span className="children"></span>
                                    )
                                }
                              </div>)
                            )}
                          </div>
                        </div>

                        <ul className={`refLinkBlock ${data.activeStatus ? "planPurchased" : ""}`}>
                          <li><img style={{ marginRight: '5px' }} src={icon_group} alt="cicleIcon" /> {data.userCounts} </li>
                          <li><img style={{ marginRight: '5px' }} src={cricleIcon} alt="cicleIcon" /> {data.reinvestStatus.length}</li>
                        </ul>
                      </Grid.Column>
                    ))}
                    {/* End Eth level and price */}
                  </Grid.Row>
                </Grid>
                <Grid columns={1}>
                  <Grid.Row>
                    <Grid.Column>
                      <ul className="about_platForm">
                        <li><img src={iconCostofEath} alt="icon" /> The cost of platforms in ETH (ethereum)</li>
                        <li><img src={iconNoOfReopen} alt="icon" />Number of reopens</li>
                        <li><img src={iconPartnersOfPlatform} alt="icon" />Partners on the platform</li>
                      </ul>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>

                <Grid columns={6}>
                  <Header as="h3">M4 Plan</Header>
                  <Grid.Row className="fastPlanRow">
                    {resultArr4x.map((data, index) => (
                      <Grid.Column
                        key={index}
                        className={`${(!data.activeStatus && resultArr4x[index - 1].activeStatus) ? "buyNowPlan" : ""} ${data.activeStatus ? "planPurchasedColumn" : ""}`}
                      >
                        <ul className="cardTopBar">
                          <li className="cardCountStyle">{index + 1}</li>
                          <li>
                            {/* buy 4x button */}
                            {!data.activeStatus && ((resultArr4x[index - 1].activeStatus) ? (<Link to="#"
                              className="linkBuy"
                              onClick={() =>
                                this.purchaseLevelCommon(data.levelPrice, index + 1, "2")
                              }
                            >
                              <span className="isHide">Buy</span>
                            </Link>) : (<Link to="#"
                              className="linkBuy"
                            >
                              <span className="isHide">Buy</span>
                            </Link>))
                            }
                          </li>
                        </ul>
                        <Header as="h4"
                          className={
                            data.activeStatus
                              ? "activated"
                              : ""
                          }>
                          <Link to={`${HOME_ROUTE}auth/userLevel/${address}/${index + 1}/2`} title={address}>
                            <strong>{data.levelPrice}</strong>
                            <strong className="currencyType">ETH</strong>
                          </Link>
                        </Header>

                        <div className="ternary-children">
                          <div className="ternary-childrenHolder has_4x">
                            {numArr4x_level1.map((a) =>
                              (<div key={a} className="childrenParentBinary">
                                {
                                  data.levelOneUsers[a] !== undefined
                                    ? (
                                      <Link to={`${HOME_ROUTE}auth/userLevel/${data.levelOneUsers[a].address}/${index + 1}/2`} title={data.levelOneUsers[a]}>
                                        
                                        {data.levelOneUsers.map((l, index2) => (<div key={index2}>
                                          {l.address === data.levelOneUsers[a].address &&
                                            <span className={`children childrenActivate ${l.ahead ? "aheadId" : ""}`}></span>}
                                        </div>))}
                                      </Link>
                                    ) : (
                                      <span className="children"></span>
                                    )
                                }
                              </div>)
                            )}
                          </div>
                          <div className="ternary-childrenHolder4">
                            {numArr4x_level2.map((a) =>
                              (<div key={a} className="childrenParentBinary2">
                                {
                                  data.levelTwoArr[a].address
                                    ? (
                                      <Link to={`${HOME_ROUTE}auth/userLevel/${data.levelTwoArr[a].address}/${index + 1}/2`} title={data.levelTwoArr[a].address}>
                                        <div className={`children childrenActivate ${data.levelTwoArr[a].upOverflow ? "upOverflow" : ""} ${data.levelTwoArr[a].bottomOverflow ? "botOverflow" : ""} ${data.levelTwoArr[a].ahead ? "aheadId" : ""}`}>
                                          {/* {data.levelTwoArr[a].id} */}
                                          {/* {l.up && <img src={arrowUpHistroy} className="arrowUp" />}
                                                 {l.down && <img src={arrowDownHistroy} className="arrowDown" />} */}
                                        </div>
                                      </Link>
                                    ) : (
                                      <span className="children"></span>
                                    )
                                }
                              </div>)
                            )}
                          </div>
                        </div>
                        <ul className={`refLinkBlock ${data.activeStatus ? "planPurchased" : ""}`}>
                          <li><img style={{ marginRight: '5px' }} src={icon_group} alt="cicleIcon" /> {data.userCounts} </li>
                          <li><img style={{ marginRight: '5px' }} src={cricleIcon} alt="cicleIcon" /> {data.reinvestStatus.length}
                          </li>
                        </ul>
                      </Grid.Column>
                    ))}
                    {/* End Eth level and price */}
                  </Grid.Row>
                </Grid>
                <Grid columns={1}>
                  <Grid.Row>
                    <Grid.Column>
                      <ul className="circlePlans">
                        <li className="partnersInvitedByYou">Partner Invited by you</li>
                        <li className="bottomOverflow">Bottom overflow</li>
                        <li className="overflowFromUp">Overflow from up</li>
                        <li className="aheadOfInvesting">Partner who is ahead of his inviter</li>
                      </ul>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Container>
              <div className="tf-tree example">
                {/* new  */}
                <div className="infiniteTreeStyle"></div>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    address: state.persist.address,
    userDetails: state.persist.userDetails,
    loggedIn: state.persist.loggedIn,
    loginType: state.persist.loginType,
    ethLevelPrice3x: state.ethereum.ethLevelPrice3x,
    ethLevelPrice4x: state.ethereum.ethLevelPrice4x,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    convertFromWei: value => dispatch(convertFromWei(value)),
    getDetails: () => dispatch(getDetails()),
    purchaseLevel: (value, level, matrix) => dispatch(purchaseLevel(value, level, matrix)),
    levelPrice: () => dispatch(levelPrice()),
    callWeb3: () => dispatch(callWeb3()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Homepage)
);
